import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules
} from '@creit.tech/stellar-wallets-kit';
import {
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  rpc
} from '@stellar/stellar-sdk';

const NETWORK = import.meta.env.VITE_STELLAR_NETWORK || 'testnet';
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org:443';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export const server = new rpc.Server(RPC_URL);

export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: 'freighter',
  modules: allowAllModules(),
});

// Cache connected wallet address
let connectedAddress = null;

export async function connectWallet() {
  try {
    const { address } = await kit.connect();
    connectedAddress = address;
    return address;
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
}

export function getConnectedAddress() {
  return connectedAddress;
}

export function disconnectWallet() {
  connectedAddress = null;
}

/**
 * Invokes a Soroban smart contract method.
 * @param {string} functionName Name of the contract function
 * @param {Array<any>} args Array of native arguments to encode
 * @param {boolean} signTx Whether to sign the transaction (false for read-only queries)
 * @returns {Promise<any>} Result of the contract invocation
 */
export async function invokeContract(functionName, args = [], signTx = true) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  const address = signTx ? (connectedAddress || await connectWallet()) : 'GATU5I4FA4XAD73GFLA4OM5VENVNVGQI3UBAR2ALUVMW23SUYOKVC2KK'; // fallback public address for simulation

  // Get source account
  const sourceAccount = await server.getAccount(address);

  // Build the Soroban transaction
  let tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      TransactionBuilder.cloneOperation(
        TransactionBuilder.buildInvokeContractOperation({
          contractId: CONTRACT_ADDRESS,
          function: functionName,
          args: args.map(arg => {
            // Encode custom objects or types if needed
            if (arg && typeof arg === 'object' && arg._type) {
              if (arg._type === 'address') {
                return Address.fromString(arg.val).toScVal();
              }
              if (arg._type === 'i128') {
                return nativeToScVal(BigInt(arg.val), { type: 'i128' });
              }
              if (arg._type === 'u64') {
                return nativeToScVal(BigInt(arg.val), { type: 'u64' });
              }
            }
            return nativeToScVal(arg);
          }),
        })
      )
    )
    .setTimeout(60)
    .build();

  // Simulate transaction
  const simulation = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationSuccess(simulation)) {
    // Assemble transaction with simulation results
    tx = rpc.assembleTransaction(tx, simulation).build();
  } else {
    throw new Error(`Simulation failed: ${simulation.error || 'Unknown error'}`);
  }

  if (!signTx) {
    // For read-only actions, return decoded output from simulation
    const resultScVal = simulation.result.retval;
    return scValToNative(resultScVal);
  }

  // Sign transaction
  const { signedTxXdr } = await kit.sign({
    xdr: tx.toXDR(),
    network: 'TESTNET',
  });

  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);

  // Submit transaction
  const submission = await server.sendTransaction(signedTx);
  if (submission.status !== 'PENDING') {
    throw new Error(`Transaction submission failed: ${JSON.stringify(submission)}`);
  }

  // Poll for status
  let response = await server.getTransaction(submission.hash);
  for (let i = 0; i < 30; i++) {
    if (response.status === 'SUCCESS') {
      const txResult = xdr.TransactionResult.fromXDR(Buffer.from(response.resultXdr, 'base64'));
      const results = txResult.result().results();
      if (results.length > 0) {
        const scVal = results[0].tr().invokeHostFunctionResult().success();
        const localScVal = xdr.ScVal.fromXDR(scVal.toXDR('base64'), 'base64');
        return {
          hash: submission.hash,
          result: scValToNative(localScVal),
        };
      }
      return { hash: submission.hash };
    } else if (response.status === 'FAILED') {
      throw new Error(`Transaction execution failed: ${JSON.stringify(response)}`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    response = await server.getTransaction(submission.hash);
  }

  throw new Error('Transaction polling timed out');
}

/**
 * Get details of a specific escrow agreement.
 */
export async function getEscrowDetails(escrowId) {
  try {
    const idVal = { _type: 'u64', val: escrowId };
    return await invokeContract('get_escrow', [idVal], false);
  } catch (error) {
    console.error(`Error fetching escrow ${escrowId}:`, error);
    throw error;
  }
}

/**
 * Get total number of escrows created.
 */
export async function getEscrowsCount() {
  try {
    return await invokeContract('get_counter', [], false);
  } catch (error) {
    console.error('Error fetching escrows count:', error);
    return 0;
  }
}

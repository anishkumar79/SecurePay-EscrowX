import { rpc, TransactionBuilder, Networks, Address, scValToNative, BASE_FEE, Operation, StrKey } from '@stellar/stellar-sdk';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const server = new rpc.Server(RPC_URL);

const CONTRACT_ADDRESS = "CBGL7N5GANUBPAV2UHXC5UBW3JSXGNLAKOMVJD54YNIZF6WN6PHSMQAL";

async function run() {
  try {
    console.log('Simulating get_counter on contract:', CONTRACT_ADDRESS);
    const dummyAddress = "GB6M5WVK5P556U6XRBGP2S7GAKTWBNBU4ISGNQQBR2U2VLR3CMANTC2U";
    const sourceAccount = await server.getAccount(dummyAddress);

    let tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ADDRESS,
        function: 'get_counter',
        args: []
      })
    )
    .setTimeout(60)
    .build();

    const simulation = await server.simulateTransaction(tx);
    console.log('Simulation success status:', rpc.Api.isSimulationSuccess(simulation));
    if (rpc.Api.isSimulationSuccess(simulation)) {
      console.log('Result native:', scValToNative(simulation.result.retval));
    } else {
      console.error('Simulation failed with error:', simulation.error);
      console.error('Simulation events:', JSON.stringify(simulation.events, null, 2));
    }
  } catch (err) {
    console.error('Run failed:', err);
  }
}

run();

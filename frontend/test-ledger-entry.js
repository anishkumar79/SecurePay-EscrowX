import { rpc, xdr, StrKey } from '@stellar/stellar-sdk';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const server = new rpc.Server(RPC_URL);
const CONTRACT_ADDRESS = "CBGL7N5GANUBPAV2UHXC5UBW3JSXGNLAKOMVJD54YNIZF6WN6PHSMQAL";

async function run() {
  try {
    console.log('Querying ledger entry for contract:', CONTRACT_ADDRESS);
    const contractIdBuffer = StrKey.decodeContract(CONTRACT_ADDRESS);
    
    const ledgerKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: xdr.ScAddress.scAddressTypeContract(contractIdBuffer),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent()
      })
    );

    const res = await server.getLedgerEntries([ledgerKey]);
    console.log('RPC Response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Failed to query ledger entry:', err.message || err);
  }
}

run();

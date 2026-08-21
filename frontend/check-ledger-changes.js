import { xdr, StrKey } from '@stellar/stellar-sdk';
import https from 'https';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const TX_HASH = "c6a447a32f1ac2be9baddc7f3cb4887945326c5aa4fd1be42f8ad66becf9fb5d";

async function jsonRpcCall(method, params) {
  const body = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method,
    params
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request(RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.result);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  try {
    console.log('Fetching transaction result metadata for:', TX_HASH);
    const tx = await jsonRpcCall("getTransaction", { hash: TX_HASH });
    
    if (tx.status !== "SUCCESS") {
      throw new Error(`Transaction failed with status: ${tx.status}`);
    }

    // Decode resultMetaXdr
    const metaXdr = xdr.TransactionMeta.fromXDR(Buffer.from(tx.resultMetaXdr, "base64"));
    console.log('TransactionMeta version switch:', metaXdr.switch().value);
    
    // In Soroban, it's usually TransactionMetaV3
    const operationsMeta = metaXdr.v3().sorobanMeta().operations();
    console.log('Operations meta count:', operationsMeta.length);
    
    // Let's traverse all ledger changes to find the contract instance key created
    const changes = metaXdr.v3().sorobanMeta().returnValue().toXDR(); // wait, let's look at ledger changes
    const txChanges = metaXdr.v3().txChangesAfter();
    
    console.log('Scanning ledger changes after transaction:');
    txChanges.forEach((change, i) => {
      const entryType = change.switch().name;
      console.log(`Change ${i}: type is ${entryType}`);
      
      let entry;
      if (entryType === 'ledgerEntryCreated') {
        entry = change.created();
      } else if (entryType === 'ledgerEntryUpdated') {
        entry = change.updated();
      }
      
      if (entry) {
        const data = entry.data();
        const dataType = data.switch().name;
        console.log(`  Data type: ${dataType}`);
        
        if (dataType === 'contractData') {
          const contractData = data.contractData();
          const contractAddress = contractData.contract();
          const contractIdBytes = contractAddress.contractId();
          const encodedId = StrKey.encodeContract(contractIdBytes);
          console.log(`  FOUND Contract ID in ledger change: ${encodedId}`);
        }
      }
    });

  } catch (err) {
    console.error('Failed to decode transaction metadata:', err);
  }
}

run();

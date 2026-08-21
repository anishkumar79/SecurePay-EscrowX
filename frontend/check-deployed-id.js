import { xdr, StrKey, scValToNative } from '@stellar/stellar-sdk';
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
    console.log('Fetching raw transaction result for:', TX_HASH);
    const tx = await jsonRpcCall("getTransaction", { hash: TX_HASH });
    console.log('Transaction Status:', tx.status);
    
    if (tx.status !== "SUCCESS") {
      throw new Error(`Transaction failed with status: ${tx.status}`);
    }

    // Decode result XDR
    const txResult = xdr.TransactionResult.fromXDR(Buffer.from(tx.resultXdr, "base64"));
    const results = txResult.result().results();
    
    const hostFnResult = results[0].tr().invokeHostFunctionResult();
    const successVal = hostFnResult.success();
    console.log('Success ScVal (type):', successVal.constructor.name);
    
    console.log('Buffer length:', successVal.length);
    console.log('Buffer hex:', successVal.toString('hex'));
    
    let contractId;
    if (Buffer.isBuffer(successVal)) {
      contractId = StrKey.encodeContract(successVal);
    } else {
      const nativeVal = scValToNative(successVal);
      contractId = StrKey.encodeContract(Buffer.from(nativeVal));
    }
    console.log('Contract ID extracted is:', contractId);
  } catch (err) {
    console.error('Failed to decode transaction result:', err);
  }
}

run();

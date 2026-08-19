import { Keypair, Operation, rpc, TransactionBuilder, Networks, BASE_FEE, Address, xdr, scValToNative, StrKey } from "@stellar/stellar-sdk";
import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = "https://soroban-testnet.stellar.org:443";

function fundAccount(publicKey) {
  return new Promise((resolve, reject) => {
    https.get(`https://friendbot.stellar.org/?addr=${publicKey}`, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => { resolve(data); });
    }).on("error", reject);
  });
}

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

async function pollTxJsonRpc(hash) {
  for (let i = 0; i < 30; i++) {
    const res = await jsonRpcCall("getTransaction", { hash });
    if (res.status === "SUCCESS") {
      return res;
    } else if (res.status === "FAILED") {
      throw new Error(`Transaction failed: ${JSON.stringify(res)}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Polling timeout");
}

async function run() {
  console.log("Generating keypair...");
  const kp = Keypair.random();
  const pubkey = kp.publicKey();
  console.log(`Keypair generated. Public Key: ${pubkey}`);

  console.log("Funding account via Friendbot...");
  await fundAccount(pubkey);
  console.log("Account funded!");

  // Wait a moment for transaction to settle on ledger
  await new Promise(r => setTimeout(r, 4000));

  console.log("Reading WASM bytecode...");
  const wasmPath = path.join(__dirname, "..", "contract", "target", "wasm32v1-none", "release", "escrowx_contract.wasm");
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found at: ${wasmPath}`);
  }
  const wasm = fs.readFileSync(wasmPath);

  // Compute WASM hash locally
  const wasmHash = crypto.createHash("sha256").update(wasm).digest();
  console.log(`Local WASM Hash: ${wasmHash.toString("hex")}`);

  console.log("Uploading WASM to Testnet...");
  const server = new rpc.Server(RPC_URL);
  const sourceAccount = await server.getAccount(pubkey);
  let tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(Operation.uploadContractWasm({ wasm }))
  .setTimeout(60)
  .build();

  console.log("Simulating upload transaction...");
  let sim = await server.simulateTransaction(tx);
  console.log("Assembling transaction...");
  tx = rpc.assembleTransaction(tx, sim).build();
  tx.sign(kp);

  console.log("Sending upload transaction...");
  let response = await server.sendTransaction(tx);
  if (response.status !== "PENDING") {
    throw new Error(`Upload failed: ${JSON.stringify(response)}`);
  }

  console.log("Waiting for upload transaction to be included in ledger...");
  await pollTxJsonRpc(response.hash);
  console.log("WASM successfully uploaded.");

  console.log("Deploying contract instance...");
  const salt = crypto.randomBytes(32);
  const uploaderAddress = Address.fromString(pubkey);
  
  const freshAccount = await server.getAccount(pubkey);
  let deployTx = new TransactionBuilder(freshAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(Operation.createCustomContract({
    wasmHash,
    address: uploaderAddress,
    salt
  }))
  .setTimeout(60)
  .build();

  console.log("Simulating deploy transaction...");
  let deploySim = await server.simulateTransaction(deployTx);
  deployTx = rpc.assembleTransaction(deployTx, deploySim).build();
  deployTx.sign(kp);

  console.log("Sending deploy transaction...");
  let deployResponse = await server.sendTransaction(deployTx);
  if (deployResponse.status !== "PENDING") {
    throw new Error(`Deploy failed: ${JSON.stringify(deployResponse)}`);
  }

  console.log("Waiting for deploy transaction...");
  const deployStatus = await pollTxJsonRpc(deployResponse.hash);
  
  // Extract contract ID from resultMetaXdr
  let contractId;
  const meta = xdr.TransactionMeta.fromXDR(Buffer.from(deployStatus.resultMetaXdr, 'base64'));
  let changes = [];
  
  if (meta.arm() === 'v3') {
    const v3 = meta.v3();
    changes.push(...v3.txChangesBefore());
    changes.push(...v3.txChangesAfter());
    v3.operations().forEach(op => {
      changes.push(...op.changes());
    });
  } else if (meta.arm() === 'v4') {
    const v4 = meta.v4();
    changes.push(...v4.txChangesBefore());
    changes.push(...v4.txChangesAfter());
    v4.operations().forEach(op => {
      changes.push(...op.changes());
    });
  }
  
  for (const change of changes) {
    const changeType = change.switch().name;
    let entry;
    if (changeType === 'ledgerEntryCreated') {
      entry = change.created();
    } else if (changeType === 'ledgerEntryUpdated') {
      entry = change.updated();
    }
    if (entry) {
      const data = entry.data();
      if (data.switch().name === 'contractData') {
        const cd = data.contractData();
        if (cd.key().switch().name === 'scvLedgerKeyContractInstance') {
          contractId = StrKey.encodeContract(cd.contract().contractId());
          break;
        }
      }
    }
  }

  if (!contractId) {
    throw new Error("Contract ID not found in transaction metadata");
  }
  
  console.log(`Contract deployed! Contract ID: ${contractId}`);

  // Write to .env
  const envContent = `VITE_STELLAR_NETWORK=testnet\n` +
                     `VITE_SOROBAN_RPC_URL=${RPC_URL}\n` +
                     `VITE_CONTRACT_ADDRESS=${contractId}\n` +
                     `VITE_SUPABASE_URL=\n` +
                     `VITE_SUPABASE_ANON_KEY=\n` +
                     `VITE_SENTRY_DSN=\n` +
                     `VITE_POSTHOG_KEY=\n` +
                     `VITE_POSTHOG_HOST=https://us.i.posthog.com\n`;
                     
  fs.writeFileSync(path.join(__dirname, ".env"), envContent);
  fs.writeFileSync(path.join(__dirname, ".env.example"), envContent);
  console.log("Environment variables written to frontend/.env and frontend/.env.example");
}

run().catch(console.error);

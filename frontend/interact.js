import { Keypair, Operation, rpc, TransactionBuilder, Networks, BASE_FEE, Address, nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import https from "https";

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const CONTRACT_ID = "CDT2FAK6BACGLMLXOBPKYGMLOU4KD24Q2BBVYRLHPLTYDN56MCASW32C";
const TOKEN_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

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
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
  return new Promise((resolve, reject) => {
    const req = https.request(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        const parsed = JSON.parse(data);
        if (parsed.error) reject(new Error(parsed.error.message));
        else resolve(parsed.result);
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function pollTx(hash) {
  for (let i = 0; i < 30; i++) {
    const res = await jsonRpcCall("getTransaction", { hash });
    if (res.status === "SUCCESS") return res;
    if (res.status === "FAILED") throw new Error(`Tx failed: ${JSON.stringify(res)}`);
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Polling timeout");
}

async function run() {
  const clientKp = Keypair.random();
  const freelancerKp = Keypair.random();
  
  console.log(`Client PK: ${clientKp.publicKey()}`);
  console.log(`Freelancer PK: ${freelancerKp.publicKey()}`);
  
  console.log("Funding client...");
  await fundAccount(clientKp.publicKey());
  console.log("Client funded!");
  
  // Wait a moment
  await new Promise(r => setTimeout(r, 4000));
  
  const server = new rpc.Server(RPC_URL);
  const sourceAccount = await server.getAccount(clientKp.publicKey());
  
  const amount = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  console.log(`Amount: ${amount}`);
  const releaseTime = Math.floor(Date.now() / 1000) + 86400; // tomorrow
  
  const args = [
    Address.fromString(clientKp.publicKey()).toScVal(),
    Address.fromString(freelancerKp.publicKey()).toScVal(),
    Address.fromString(TOKEN_ID).toScVal(),
    nativeToScVal(BigInt(amount), { type: 'i128' }),
    nativeToScVal(BigInt(releaseTime), { type: 'u64' })
  ];
  
  let tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(Operation.invokeContractFunction({
    contract: CONTRACT_ID,
    function: "create_escrow",
    args: args
  }))
  .setTimeout(60)
  .build();
  
  console.log("Simulating...");
  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error(`Simulation failed: ${JSON.stringify(sim)}`);
  }
  
  tx = rpc.assembleTransaction(tx, sim).build();
  tx.sign(clientKp);
  
  console.log("Sending tx...");
  const response = await server.sendTransaction(tx);
  if (response.status !== "PENDING") {
    throw new Error(`Send failed: ${JSON.stringify(response)}`);
  }
  
  console.log(`Waiting for tx: ${response.hash}`);
  const result = await pollTx(response.hash);
  
  console.log("SUCCESS!");
  console.log(`Transaction Hash: ${response.hash}`);
  console.log(`Client: ${clientKp.publicKey()}`);
  console.log(`Freelancer: ${freelancerKp.publicKey()}`);
}

run().catch(console.error);

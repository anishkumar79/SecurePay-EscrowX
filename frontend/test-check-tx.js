import fetch from 'node-fetch'; // wait, node-fetch is in dependencies or we can use global fetch in Node 18+

const ACCOUNT = "GB6M5WVK5P556U6XRBGP2S7GAKTWBNBU4ISGNQQBR2U2VLR3CMANTC2U";
const URL = `https://horizon-testnet.stellar.org/accounts/${ACCOUNT}/transactions`;

async function run() {
  try {
    console.log('Fetching transactions for deployer account:', ACCOUNT);
    const res = await fetch(URL);
    if (!res.ok) {
      throw new Error(`Horizon error: ${res.statusText}`);
    }
    const data = await res.json();
    const txs = data._embedded.records;
    console.log(`Found ${txs.length} transactions:`);
    txs.forEach((tx, idx) => {
      console.log(`[Tx ${idx + 1}] Hash: ${tx.hash}, Ledgers: ${tx.ledger_attr}, Success: ${tx.successful}`);
    });
  } catch (err) {
    console.error('Failed to fetch transaction history:', err.message || err);
  }
}

run();

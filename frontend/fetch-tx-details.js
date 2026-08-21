import fetch from 'node-fetch';

const TX_HASH = "c6a447a32f1ac2be9baddc7f3cb4887945326c5aa4fd1be42f8ad66becf9fb5d";
const URL = `https://horizon-testnet.stellar.org/transactions/${TX_HASH}/operations`;

async function run() {
  try {
    console.log('Fetching operations for transaction:', TX_HASH);
    const res = await fetch(URL);
    if (!res.ok) {
      throw new Error(`Horizon error: ${res.statusText}`);
    }
    const data = await res.json();
    const ops = data._embedded.records;
    console.log(`Found ${ops.length} operations:`);
    ops.forEach((op, idx) => {
      console.log(`[Op ${idx + 1}] Type: ${op.type}, ID: ${op.id}`);
      console.log('Details:', JSON.stringify(op, null, 2));
    });
  } catch (err) {
    console.error('Failed to fetch operation details:', err.message || err);
  }
}

run();

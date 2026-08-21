import { rpc } from '@stellar/stellar-sdk';
import fetch from 'node-fetch';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const TX_HASH = "c6a447a32f1ac2be9baddc7f3cb4887945326c5aa4fd1be42f8ad66becf9fb5d";
const server = new rpc.Server(RPC_URL);

async function run() {
  try {
    console.log('Fetching latest ledger from Soroban RPC...');
    const rpcLedger = await server.getLatestLedger();
    console.log('Soroban RPC Latest Ledger:', rpcLedger.sequence);

    console.log('Fetching deployment transaction ledger from Horizon...');
    const res = await fetch(`https://horizon-testnet.stellar.org/transactions/${TX_HASH}`);
    if (!res.ok) {
      throw new Error(`Horizon error: ${res.statusText}`);
    }
    const data = await res.json();
    const txLedger = data.ledger;
    console.log('Deployment Transaction Ledger:', txLedger);

    const diff = rpcLedger.sequence - txLedger;
    console.log('Ledger sync difference (RPC - Tx):', diff);
    
    if (diff < 0) {
      console.error('ERROR: The Soroban RPC server is LAGGING behind the deployment ledger!');
    } else {
      console.log('Status: The RPC server is synced past the deployment transaction.');
    }
  } catch (err) {
    console.error('Failed to query ledger status:', err.message || err);
  }
}

run();

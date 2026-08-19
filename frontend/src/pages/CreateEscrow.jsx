import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConnectedAddress, invokeContract, connectWallet } from '../stellar';
import { supabase } from '../supabaseClient';
import { StrKey } from '@stellar/stellar-sdk';
import { Shield, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

// Native XLM SAC address on Testnet
const NATIVE_XLM_SAC = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

export default function CreateEscrow() {
  const [address, setAddress] = useState(getConnectedAddress());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sync wallet address
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getConnectedAddress();
      if (current !== address) {
        setAddress(current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!address) {
      alert('Please connect your Freighter wallet.');
      return;
    }

    if (!StrKey.isValidEd25519PublicKey(freelancer)) {
      alert('Invalid Freelancer wallet address. It must be a valid Stellar G... address.');
      return;
    }

    if (freelancer.toLowerCase() === address.toLowerCase()) {
      alert('You cannot create an escrow with yourself as the freelancer.');
      return;
    }

    const releaseTimestamp = Math.floor(new Date(releaseDate).getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);
    if (releaseTimestamp <= nowTimestamp) {
      alert('Release Date must be in the future.');
      return;
    }

    setLoading(true);

    try {
      // Arguments: client (Address), freelancer (Address), token (Address), amount (i128), release_time (u64)
      const stroopsAmount = BigInt(Math.round(parseFloat(amount) * 10000000));
      const clientVal = { _type: 'address', val: address };
      const freelancerVal = { _type: 'address', val: freelancer };
      const tokenVal = { _type: 'address', val: NATIVE_XLM_SAC };
      const amountVal = { _type: 'i128', val: stroopsAmount.toString() };
      const releaseTimeVal = { _type: 'u64', val: releaseTimestamp };

      // Invoke create_escrow on the Soroban contract
      const txResult = await invokeContract('create_escrow', [
        clientVal,
        freelancerVal,
        tokenVal,
        amountVal,
        releaseTimeVal
      ]);

      const escrowId = txResult.result;

      // Save escrow metadata to Supabase (or localStorage fallback)
      const { error } = await supabase.from('escrows').insert({
        id: Number(escrowId),
        title,
        description,
        client_address: address,
        freelancer_address: freelancer,
        amount: Number(amount),
        token_address: NATIVE_XLM_SAC,
        release_time: releaseTimestamp,
        status: 0,
        tx_hash: txResult.hash
      });

      if (error) throw error;

      alert(`Escrow #${escrowId} successfully created on-chain!`);
      navigate(`/escrow/${escrowId}`);
    } catch (err) {
      console.error('Error creating escrow:', err);
      alert(`Transaction failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-semibold mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
        {/* Top styling accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/15 p-2 rounded-xl text-purple-400">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Escrow Agreement</h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Agreement Title</label>
            <input
              type="text"
              required
              disabled={loading}
              placeholder="e.g. Redesign Landing Page Website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Description / Deliverables</label>
            <textarea
              required
              disabled={loading}
              rows={4}
              placeholder="Specify requirements, milestones, and expected outputs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Freelancer Wallet Address</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="G..."
                value={freelancer}
                onChange={(e) => setFreelancer(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 font-mono focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Contract Token</label>
              <div className="w-full bg-slate-900/60 border border-white/5 rounded-xl px-4 py-3 text-slate-400 text-sm font-semibold select-none">
                Stellar Lumens (XLM)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Payment Amount (XLM)</label>
              <input
                type="number"
                required
                disabled={loading}
                min="0.00001"
                step="any"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Automatic Release Expiry</label>
              <input
                type="datetime-local"
                required
                disabled={loading}
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn flex items-center justify-center gap-2 py-4 rounded-xl font-bold cursor-pointer transition disabled:opacity-50 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Deploying Smart Contract...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Create & Register Escrow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet, getConnectedAddress } from '../stellar';
import { Shield, Coins, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const [address, setAddress] = useState(getConnectedAddress());
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      navigate('/dashboard');
    } catch (e) {
      alert('Freighter connection failed. Make sure Freighter is unlocked and on Testnet.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] flex flex-col justify-center items-center px-6 py-12 overflow-hidden bg-[#030712]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Zap size={14} /> Built on Stellar Network & Soroban Contracts
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-100 max-w-3xl mx-auto">
          Secure Freelance Payments, <span className="gradient-text">Zero Friction</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          EscrowX locks payments in secure smart contracts. Freelancers work with confidence, and clients release funds automatically only when satisfied.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {address ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="gradient-btn flex items-center gap-2 px-8 py-4 rounded-xl font-bold cursor-pointer text-base"
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="gradient-btn flex items-center gap-2 px-8 py-4 rounded-xl font-bold cursor-pointer text-base disabled:opacity-50"
            >
              <span>{connecting ? 'Connecting Wallet...' : 'Connect Freighter Wallet'}</span>
              <ArrowRight size={18} />
            </button>
          )}
          <button
            onClick={() => navigate('/feedback')}
            className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:border-white/20 bg-white/5 text-slate-200 hover:text-white transition-all duration-200 text-base"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full mt-24 relative z-10">
        <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-xl">
            <Shield size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Tamper-Proof Protection</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Funds are locked directly in a Soroban smart contract on the blockchain. No middleman can access or divert your payments.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center rounded-xl">
            <Coins size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Ultralow Network Fees</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Stellar transactions settle in seconds and cost less than a fraction of a cent. Keep 99.9% of what you earn.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Automated Escrow Flow</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Simple step-by-step triggers make it easy to deposit, request release, approve payment, or request a refund after expiration.
          </p>
        </div>
      </div>
    </div>
  );
}

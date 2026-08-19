import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConnectedAddress, invokeContract, getEscrowDetails } from '../stellar';
import { supabase } from '../supabaseClient';
import { 
  ArrowLeft, Shield, DollarSign, Send, CheckCircle2, RotateCcw, 
  Loader2, ExternalLink, Calendar, User, Clock, AlertCircle
} from 'lucide-react';

export default function EscrowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState(getConnectedAddress());
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch escrow details
  const fetchEscrow = async () => {
    setLoading(true);
    setError(null);
    try {
      let escrowData = null;
      
      // 1. Try to fetch from Supabase metadata
      try {
        const { data, error: dbError } = await supabase
          .from('escrows')
          .select('*')
          .eq('id', Number(id))
          .single();
        if (!dbError && data) {
          escrowData = data;
        }
      } catch (dbErr) {
        console.warn('DB fetch failed, trying on-chain fallback:', dbErr);
      }

      // 2. Fetch on-chain status
      const onChainData = await getEscrowDetails(Number(id));
      
      if (!onChainData) {
        // If not found on-chain, and we couldn't get it from DB, it doesn't exist
        if (!escrowData) {
          throw new Error('Agreement not found on-chain or in database.');
        }
      } else {
        // If found on-chain
        if (escrowData) {
          // Sync database status if out of sync
          if (Number(onChainData.status) !== Number(escrowData.status)) {
            try {
              await supabase
                .from('escrows')
                .update({ status: Number(onChainData.status) })
                .eq('id', Number(id));
            } catch (syncErr) {
              console.warn('Could not sync status to DB:', syncErr);
            }
            escrowData.status = Number(onChainData.status);
          }
        } else {
          // DB metadata is missing (e.g. friend loaded a link created by user under localStorage)
          // Construct fallback metadata from on-chain data
          escrowData = {
            id: Number(id),
            title: `Escrow Agreement #${id}`,
            description: `This agreement's details are loaded directly from the Stellar blockchain. The original creator has the deliverables details stored in their local browser.`,
            amount: Number(onChainData.amount) / 10000000,
            client_address: onChainData.client,
            freelancer_address: onChainData.freelancer,
            token_address: onChainData.token,
            release_time: Number(onChainData.release_time),
            status: Number(onChainData.status),
            tx_hash: null
          };
        }
      }

      setEscrow(escrowData);
    } catch (err) {
      console.error(err);
      setError('Failed to load escrow details. Verify if the agreement exists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrow();
  }, [id]);

  // Handle smart contract actions
  const handleAction = async (actionName) => {
    setActionLoading(true);
    try {
      let txResult;
      const escrowIdVal = { _type: 'u64', val: id };

      if (actionName === 'deposit') {
        txResult = await invokeContract('deposit', [escrowIdVal]);
      } else if (actionName === 'request_release') {
        txResult = await invokeContract('request_release', [escrowIdVal]);
      } else if (actionName === 'approve_release') {
        txResult = await invokeContract('approve_release', [escrowIdVal]);
      } else if (actionName === 'refund') {
        const callerVal = { _type: 'address', val: address };
        txResult = await invokeContract('refund', [escrowIdVal, callerVal]);
      }

      // Update state in Supabase
      const newStatus = 
        actionName === 'deposit' ? 1 :
        actionName === 'request_release' ? 2 :
        actionName === 'approve_release' ? 3 : 4;

      await supabase
        .from('escrows')
        .update({ 
          status: newStatus,
          tx_hash: txResult.hash
        })
        .eq('id', Number(id));

      alert(`Success! On-chain action executed: ${actionName}`);
      fetchEscrow();
    } catch (err) {
      console.error(err);
      alert(`Action failed: ${err.message || err}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={36} />
        <p className="text-slate-400 text-sm">Verifying escrow status on Stellar ledger...</p>
      </div>
    );
  }

  if (error || !escrow) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-100 mb-2">Error Loading Escrow</h2>
        <p className="text-slate-400 text-sm mb-6">{error || 'Agreement not found.'}</p>
        <button onClick={() => navigate('/dashboard')} className="gradient-btn px-6 py-3 rounded-xl font-semibold text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { title, description, amount, status, client_address, freelancer_address, release_time, tx_hash } = escrow;

  const isClient = address && client_address && address.toLowerCase() === client_address.toLowerCase();
  const isFreelancer = address && freelancer_address && address.toLowerCase() === freelancer_address.toLowerCase();
  const releaseDate = new Date(Number(release_time) * 1000);
  const now = new Date();
  const isExpired = now >= releaseDate;

  // Status visual mapping
  const statuses = [
    { num: 0, label: 'Created', desc: 'Agreement registered.' },
    { num: 1, label: 'Deposited', desc: 'Client deposited XLM.' },
    { num: 2, label: 'Requested', desc: 'Freelancer requested release.' },
    { num: 3, label: 'Released', desc: 'XLM sent to freelancer.' },
    { num: 4, label: 'Refunded', desc: 'XLM returned to client.' }
  ];

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-semibold mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Escrow main details and actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500"></div>

            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Escrow Agreement #{id}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1 mb-0">{title}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Amount</span>
                <span className="text-2xl sm:text-3xl font-black text-purple-400">{amount} XLM</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deliverables & Details</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-4 rounded-xl border border-white/5">
                {description}
              </p>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <User size={12} /> Client Wallet
                </span>
                <span className="text-xs font-mono text-slate-300 break-all">{client_address}</span>
                {isClient && <span className="text-[10px] text-purple-400 font-bold uppercase block">(You)</span>}
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <User size={12} /> Freelancer Wallet
                </span>
                <span className="text-xs font-mono text-slate-300 break-all">{freelancer_address}</span>
                {isFreelancer && <span className="text-[10px] text-purple-400 font-bold uppercase block">(You)</span>}
              </div>
            </div>

            {/* Release Date Info */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 border border-white/5 p-3.5 rounded-xl">
              <Calendar size={14} className="text-purple-400" />
              <span>Release Expiry Deadline: <strong>{releaseDate.toLocaleString()}</strong> ({isExpired ? 'Passed' : 'Active'})</span>
            </div>

            {/* Interactive Actions Panel */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Escrow Actions</h3>

              {!isClient && !isFreelancer && (
                <div className="text-xs text-slate-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                  You are not a participant in this escrow agreement. Action controls are hidden.
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Client Deposits Funds */}
                {status === 0 && isClient && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction('deposit')}
                    className="gradient-btn flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <DollarSign size={16} />}
                    <span>Deposit & Lock {amount} XLM</span>
                  </button>
                )}

                {/* 2. Freelancer Requests Release */}
                {status === 1 && isFreelancer && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction('request_release')}
                    className="gradient-btn flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    <span>Request Payment Release</span>
                  </button>
                )}

                {/* 3. Client Approves Release */}
                {(status === 1 || status === 2) && isClient && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction('approve_release')}
                    className="gradient-btn flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    <span>Approve & Release Funds</span>
                  </button>
                )}

                {/* 4. Refund (Client can refund after expiry OR Freelancer can refund client at any time) */}
                {status === 1 && (
                  ((isClient && isExpired) || isFreelancer) && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction('refund')}
                      className="bg-rose-500 hover:bg-rose-600 border border-rose-500/10 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50 shadow-lg shadow-rose-500/10 transition-all duration-200"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
                      <span>Refund Funds to Client</span>
                    </button>
                  )
                )}

                {/* Freelancer refund if release is already requested */}
                {status === 2 && isFreelancer && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction('refund')}
                    className="bg-rose-500 hover:bg-rose-600 border border-rose-500/10 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50 shadow-lg shadow-rose-500/10 transition-all duration-200"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
                    <span>Refund Funds to Client</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Progress timeline & transaction history */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock size={16} className="text-purple-400" />
              Progress Tracker
            </h3>

            <div className="space-y-6 relative border-l-2 border-slate-800 ml-3 pl-6">
              {statuses.map(step => {
                const isCompleted = status === 3 ? (step.num !== 4) : status === 4 ? (step.num !== 2 && step.num !== 3) : (step.num <= status);
                const isActive = step.num === status;

                return (
                  <div key={step.num} className="relative">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                        : isActive 
                        ? 'bg-purple-500 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                        : 'bg-slate-950 border-slate-800'
                    }`}></div>

                    <div className="space-y-0.5">
                      <h4 className={`text-sm font-bold ${isActive ? 'text-purple-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* On-chain Transaction History */}
          {tx_hash && (
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Shield size={16} className="text-purple-400" />
                Ledger Settlement
              </h3>
              <p className="text-xs text-slate-400">This escrow is verified on Stellar Testnet. View the latest transaction on the block explorer.</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-purple-500/20 text-xs font-semibold py-3 rounded-xl transition duration-200 text-purple-400"
              >
                <span>StellarExpert Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

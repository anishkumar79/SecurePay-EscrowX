import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getConnectedAddress } from '../stellar';
import { supabase } from '../supabaseClient';
import EscrowCard from '../components/EscrowCard';
import { Plus, ShieldAlert, BarChart3, Clock, Wallet, CircleDollarSign } from 'lucide-react';

export default function Dashboard() {
  const [address, setAddress] = useState(getConnectedAddress());
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'client' | 'freelancer'
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

  // Load escrows
  useEffect(() => {
    async function loadData() {
      if (!address) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('escrows')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEscrows(data || []);
      } catch (err) {
        console.error('Failed to load escrows:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [address]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl max-w-md w-full shadow-xl">
          <Wallet className="mx-auto text-purple-400 mb-4 animate-bounce" size={48} />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Please connect your Freighter wallet using the button in the navigation bar to access your EscrowX dashboard.
          </p>
          <Link to="/" className="gradient-btn inline-block px-6 py-3 rounded-xl font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Filter agreements
  const filteredEscrows = escrows.filter(item => {
    if (roleFilter === 'client') {
      return item.client_address.toLowerCase() === address.toLowerCase();
    }
    if (roleFilter === 'freelancer') {
      return item.freelancer_address.toLowerCase() === address.toLowerCase();
    }
    return (
      item.client_address.toLowerCase() === address.toLowerCase() ||
      item.freelancer_address.toLowerCase() === address.toLowerCase()
    );
  });

  // Calculate statistics
  const totalVolume = escrows
    .filter(item => item.client_address.toLowerCase() === address.toLowerCase() || item.freelancer_address.toLowerCase() === address.toLowerCase())
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const pendingRelease = escrows
    .filter(item => (item.status === 1 || item.status === 2) && (item.client_address.toLowerCase() === address.toLowerCase() || item.freelancer_address.toLowerCase() === address.toLowerCase()))
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const completedEscrowsCount = escrows
    .filter(item => item.status === 3 && (item.client_address.toLowerCase() === address.toLowerCase() || item.freelancer_address.toLowerCase() === address.toLowerCase())).length;

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mt-0 mb-1">Your Escrows</h1>
          <p className="text-slate-400 text-sm">Monitor, fund, and manage your freelance agreements on Stellar.</p>
        </div>
        <Link
          to="/create"
          className="gradient-btn flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer shadow-md shadow-purple-500/10"
        >
          <Plus size={16} />
          <span>New Agreement</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3.5 rounded-xl text-purple-400">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <div className="text-slate-400 text-xs">Total Transacted</div>
            <div className="text-2xl font-bold text-slate-100">{totalVolume} XLM</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3.5 rounded-xl text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-slate-400 text-xs">In Escrow</div>
            <div className="text-2xl font-bold text-slate-100">{pendingRelease} XLM</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-slate-400 text-xs">Completed Deals</div>
            <div className="text-2xl font-bold text-slate-100">{completedEscrowsCount}</div>
          </div>
        </div>
      </div>

      {/* Filtering Options */}
      <div className="flex border-b border-white/5 gap-6 text-sm font-semibold">
        <button
          onClick={() => setRoleFilter('all')}
          className={`pb-4 transition-all duration-200 border-b-2 cursor-pointer ${roleFilter === 'all' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          All Agreements
        </button>
        <button
          onClick={() => setRoleFilter('client')}
          className={`pb-4 transition-all duration-200 border-b-2 cursor-pointer ${roleFilter === 'client' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          As Client
        </button>
        <button
          onClick={() => setRoleFilter('freelancer')}
          className={`pb-4 transition-all duration-200 border-b-2 cursor-pointer ${roleFilter === 'freelancer' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          As Freelancer
        </button>
      </div>

      {/* Escrow List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-6 w-16 bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-800 rounded"></div>
              </div>
              <div className="h-5 w-3/4 bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="h-3 w-full bg-slate-800 rounded"></div>
                <div className="h-3 w-full bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEscrows.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-white/5">
          <ShieldAlert className="mx-auto text-slate-500 mb-3" size={36} />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No Escrow Agreements</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            You don't have any escrow agreements configured under this wallet role filter yet.
          </p>
          <Link
            to="/create"
            className="gradient-btn inline-block px-5 py-3 rounded-xl text-sm font-semibold"
          >
            Create Your First Escrow
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEscrows.map(item => (
            <EscrowCard key={item.id} escrow={item} />
          ))}
        </div>
      )}
    </div>
  );
}

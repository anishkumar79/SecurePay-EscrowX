import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connectWallet, disconnectWallet, getConnectedAddress } from '../stellar';
import { Wallet, LogOut, CheckCircle, Shield } from 'lucide-react';

export default function Navbar() {
  const [address, setAddress] = useState(getConnectedAddress());
  const [connecting, setConnecting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Poll to keep wallet state synced
    const interval = setInterval(() => {
      const current = getConnectedAddress();
      if (current !== address) {
        setAddress(current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);

  const handleConnect = async () => {
    if (address) return;
    setConnecting(true);
    try {
      const userAddr = await connectWallet();
      setAddress(userAddr);
    } catch (e) {
      alert('Failed to connect Freighter wallet. Make sure it is installed and unlocked.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAddress(null);
  };

  const shortAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-purple-500/20">
          <Shield size={24} />
        </div>
        <Link to="/" className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Escrow<span className="text-purple-400">X</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/" className={`transition-colors duration-200 hover:text-white ${isActive('/') ? 'text-purple-400' : ''}`}>Home</Link>
        <Link to="/dashboard" className={`transition-colors duration-200 hover:text-white ${isActive('/dashboard') ? 'text-purple-400' : ''}`}>Dashboard</Link>
        <Link to="/create" className={`transition-colors duration-200 hover:text-white ${isActive('/create') ? 'text-purple-400' : ''}`}>New Escrow</Link>
        <Link to="/feedback" className={`transition-colors duration-200 hover:text-white ${isActive('/feedback') ? 'text-purple-400' : ''}`}>Feedback</Link>
      </div>

      <div className="flex items-center gap-3">
        {address ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold shadow-inner">
              <CheckCircle size={16} />
              <span>{shortAddress(address)}</span>
            </div>
            <button 
              onClick={handleDisconnect}
              className="bg-slate-900/60 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 p-2.5 rounded-xl transition-all duration-200"
              title="Disconnect Wallet"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="gradient-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet size={16} />
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </nav>
  );
}

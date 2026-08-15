import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ShieldAlert } from 'lucide-react';

export default function EscrowCard({ escrow }) {
  const { id, title, description, amount, status, client_address, freelancer_address, release_time } = escrow;

  const getStatusDetails = (statusVal) => {
    switch (Number(statusVal)) {
      case 0:
        return { label: 'Created', color: 'text-amber-400 bg-amber-400/10 border-amber-500/20' };
      case 1:
        return { label: 'Deposited', color: 'text-blue-400 bg-blue-400/10 border-blue-500/20' };
      case 2:
        return { label: 'Release Requested', color: 'text-purple-400 bg-purple-400/10 border-purple-500/20' };
      case 3:
        return { label: 'Released', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' };
      case 4:
        return { label: 'Refunded', color: 'text-rose-400 bg-rose-400/10 border-rose-500/20' };
      default:
        return { label: 'Unknown', color: 'text-slate-400 bg-slate-400/10 border-slate-500/20' };
    }
  };

  const statusInfo = getStatusDetails(status);
  const formattedDate = new Date(Number(release_time) * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const shortAddr = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full border border-white/5 relative overflow-hidden">
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-xl font-bold text-slate-100">
            {amount} <span className="text-purple-400 text-sm font-semibold">XLM</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2 truncate" title={title}>
          {title || `Escrow #${id}`}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-6">
          {description || 'No description provided.'}
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-slate-500" />
            Client:
          </span>
          <span className="font-mono">{shortAddr(client_address)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-slate-500" />
            Freelancer:
          </span>
          <span className="font-mono">{shortAddr(freelancer_address)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-500" />
            Release Date:
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to={`/escrow/${id}`}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-purple-500/30 text-slate-200 hover:text-white py-3 rounded-xl text-sm font-medium transition-all duration-300"
        >
          <span>Manage Agreement</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

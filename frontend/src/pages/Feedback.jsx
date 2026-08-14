import { useState, useEffect } from 'react';
import { getConnectedAddress } from '../stellar';
import { supabase } from '../supabaseClient';
import { Star, MessageSquarePlus, Trophy, Award, Loader2 } from 'lucide-react';

export default function Feedback() {
  const [address, setAddress] = useState(getConnectedAddress());
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync address
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getConnectedAddress();
      if (current !== address) {
        setAddress(current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);

  // Load reviews
  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const wallet = address || 'Anonymous / Non-Freighter User';
      const { error } = await supabase.from('feedback').insert({
        wallet_address: wallet,
        rating: Number(rating),
        comments
      });

      if (error) throw error;

      alert('Thank you for your feedback!');
      setComments('');
      loadFeedback();
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute average rating
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left panel: Submission Form */}
      <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden h-fit">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/15 p-2 rounded-xl text-purple-400">
            <MessageSquarePlus size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">User Validation</h2>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Onboarded users can submit rating scores and comments to help validate product usage on Stellar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Connected Wallet</label>
            <input
              type="text"
              readOnly
              disabled
              value={address || 'No wallet connected (Anonymous)'}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-400 font-mono text-xs cursor-not-allowed select-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Feedback Rating (1-5)</label>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition duration-150 transform hover:scale-110"
                >
                  <Star 
                    size={28} 
                    className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Comments & Suggestions</label>
            <textarea
              required
              disabled={submitting}
              rows={4}
              placeholder="How was your experience? Do payments execute quickly on testnet? Any bugs?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500 transition duration-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-btn flex items-center justify-center gap-2 py-4 rounded-xl font-bold cursor-pointer transition disabled:opacity-50 text-base"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <span>Submit Validation Feedback</span>
            )}
          </button>
        </form>
      </div>

      {/* Right panel: Validation metrics and history */}
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Trophy size={16} className="text-purple-400" />
            Validation Overview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Average Rating</span>
              <span className="text-4xl font-extrabold text-amber-400 flex items-center justify-center gap-1.5 mt-2">
                <Star size={24} className="fill-amber-400 text-amber-400" /> {averageRating}
              </span>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-center">
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Users Onboarded</span>
              <span className="text-4xl font-extrabold text-purple-400 block mt-2">
                {feedbacks.length}
              </span>
            </div>
          </div>
        </div>

        {/* Validation entries */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 max-h-[350px] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Award size={16} className="text-purple-400" />
            Validation Feed
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin text-purple-500 mx-auto" size={24} />
            </div>
          ) : feedbacks.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((item) => (
                <div key={item.id} className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-mono truncate max-w-[150px]">{item.wallet_address}</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star size={12} className="fill-amber-400" /> {item.rating}/5
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{item.comments}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

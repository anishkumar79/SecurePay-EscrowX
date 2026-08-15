import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateEscrow from './pages/CreateEscrow';
import EscrowDetails from './pages/EscrowDetails';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateEscrow />} />
            <Route path="/escrow/:id" element={<EscrowDetails />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
        <footer className="w-full py-8 text-center text-xs text-slate-600 border-t border-white/5 bg-[#030712]">
          &copy; {new Date().getFullYear()} EscrowX. Secure Freelance Payments powered by Stellar & Soroban.
        </footer>
      </div>
    </Router>
  );
}

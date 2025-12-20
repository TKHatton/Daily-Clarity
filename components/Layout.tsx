import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { IconDashboard, IconHistory, IconAccount, IconLogout } from './Icons';

// Simple bar chart icon for insights
const IconInsights = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-[#E8956B] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-[#2D2D2D]">Daily Clarity</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 font-medium transition-colors ${isActive('/dashboard') ? 'text-[#E8956B]' : 'text-[#3A3A3A] hover:text-[#E8956B]'}`}
              >
                <IconDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/insights" 
                className={`flex items-center space-x-2 font-medium transition-colors ${isActive('/insights') ? 'text-[#E8956B]' : 'text-[#3A3A3A] hover:text-[#E8956B]'}`}
              >
                <IconInsights size={18} />
                <span>Insights</span>
              </Link>
              <Link 
                to="/history" 
                className={`flex items-center space-x-2 font-medium transition-colors ${isActive('/history') ? 'text-[#E8956B]' : 'text-[#3A3A3A] hover:text-[#E8956B]'}`}
              >
                <IconHistory size={18} />
                <span>History</span>
              </Link>
              <Link 
                to="/account" 
                className={`flex items-center space-x-2 font-medium transition-colors ${isActive('/account') ? 'text-[#E8956B]' : 'text-[#3A3A3A] hover:text-[#E8956B]'}`}
              >
                <IconAccount size={18} />
                <span>Account</span>
              </Link>
              <Button 
                variant="text" 
                onClick={handleLogout} 
                className="text-sm font-semibold flex items-center space-x-2 text-[#6B6B6B]"
              >
                <IconLogout size={18} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#3A3A3A] font-medium hover:text-[#E8956B]">
                Login
              </Link>
              <Link to="/signup">
                <Button className="py-2.5 px-6">Start Free Trial</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-12">
        {children}
      </main>
      <footer className="bg-white border-t border-[#E5E5E5] py-12 mt-24">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[#6B6B6B] text-sm gap-4">
          <p>© {new Date().getFullYear()} Daily Clarity. Thinking made simple.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-[#E8956B]">Privacy Policy</a>
            <a href="#" className="hover:text-[#E8956B]">Terms of Service</a>
            <a href="#" className="hover:text-[#E8956B]">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

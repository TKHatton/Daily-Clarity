import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError("Database is not connected. Please set SUPABASE_URL and SUPABASE_ANON_KEY.");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-3">Welcome back</h1>
        <p className="text-[#6B6B6B]">Sign in to continue your path to clarity.</p>
      </div>

      <Card>
        {!isConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            <strong>Development Note:</strong> Supabase environment variables are missing. Auth and database features require SUPABASE_URL and SUPABASE_ANON_KEY.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#3A3A3A]" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] rounded-lg focus:border-[#E8956B] focus:outline-none transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#3A3A3A]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] rounded-lg focus:border-[#E8956B] focus:outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 overflow-hidden"
            >
              {error}
            </motion.div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#6B6B6B]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#7AB8B8] font-semibold hover:underline">
            Sign up for a free week
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

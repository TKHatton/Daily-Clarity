import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto pt-12 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-3">Get Started</h1>
        <p className="text-[#6B6B6B]">Start your 7-day free trial of Daily Clarity.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#3A3A3A]" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] rounded-lg focus:border-[#E8956B] focus:outline-none transition-all"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Min. 8 characters"
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

          <div className="text-xs text-[#6B6B6B] leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy. You won't be charged for the first 7 days.
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#6B6B6B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7AB8B8] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
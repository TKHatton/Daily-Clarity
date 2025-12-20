import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { HeroIllustration } from '../components/Illustrations';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="pt-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-8 text-left">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-6xl font-bold text-[#2D2D2D] leading-tight"
          >
            Think clearly when your head feels full
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#6B6B6B] leading-relaxed max-w-[500px]"
          >
            Daily Clarity is your personal thinking assistant. Whether you need to dump mental clutter, say something difficult, or make a big decision—we help you find the way forward.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex flex-col items-start gap-4"
          >
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button className="text-lg">
                {user ? "Go to Dashboard" : "Start Your Free Week"}
              </Button>
            </Link>
            {!user && <p className="text-sm text-[#6B6B6B]">No credit card required to explore.</p>}
          </motion.div>
        </div>
        
        <div className="hidden lg:flex justify-center">
          <HeroIllustration />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {TOOLS.map((tool, idx) => (
          <motion.div 
            key={tool.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-white p-8 rounded-xl border border-[#E5E5E5] space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="text-[#E8956B]">{tool.icon}</div>
            <h3 className="text-lg font-bold text-[#2D2D2D]">{tool.name}</h3>
            <p className="text-sm text-[#6B6B6B]">{tool.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center max-w-[800px] mx-auto overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6">Simple, calm pricing</h2>
          <div className="text-5xl font-bold text-[#E8956B] mb-4">$7<span className="text-xl text-[#6B6B6B]">/month</span></div>
          <p className="text-[#6B6B6B] mb-8">Unrestricted access to all tools. Cancel anytime.</p>
          <Link to={user ? "/dashboard" : "/signup"}>
            <Button variant="secondary" className="mx-auto">
              {user ? "View Your Tools" : "Get Started Now"}
            </Button>
          </Link>
        </div>
        
        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FAF8F5] rounded-full z-0 opacity-50" />
      </div>
    </div>
  );
};

export default Home;

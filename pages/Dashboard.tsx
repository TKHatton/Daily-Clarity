import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TOOLS, QUICK_RESET_TOOL } from '../constants';
import { ToolConceptIllustration } from '../components/Illustrations';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { UserInsight } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentInsight, setRecentInsight] = useState<UserInsight | null>(null);

  useEffect(() => {
    if (user) {
      dbService.getInsights(user.id).then(insights => {
        if (insights.length > 0) setRecentInsight(insights[0]);
      });
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-[#2D2D2D]"
          >
            Welcome back, {user?.name?.split(' ')[0] || 'friend'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#6B6B6B]"
          >
            What's on your mind today?
          </motion.p>
        </div>
        
        {recentInsight && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate('/insights')}
            className="bg-[#E8956B]/5 border border-[#E8956B]/20 rounded-lg p-3 cursor-pointer hover:bg-[#E8956B]/10 transition-colors flex items-center space-x-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#E8956B] animate-pulse"></div>
            <div className="text-sm">
              <span className="font-bold text-[#E8956B]">New Pattern Spotted:</span> {recentInsight.title}
            </div>
          </motion.div>
        )}
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8"
      >
        {TOOLS.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Card 
              hoverEffect 
              onClick={() => navigate(`/tools/${tool.id}`)}
              className="flex flex-col h-full group relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="mb-6 text-[#E8956B]"
                >
                  {tool.icon}
                </motion.div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">{tool.name}</h3>
                  <p className="text-[#6B6B6B] mb-8">{tool.description}</p>
                </div>
                <div className="flex items-center text-[#7AB8B8] font-semibold group-hover:translate-x-1 transition-transform">
                  Use This Tool <span className="ml-2">&rarr;</span>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <ToolConceptIllustration type={tool.id} />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-8"
      >
        <Card 
          hoverEffect 
          onClick={() => navigate('/tools/quick-reset')}
          className="bg-white border-2 border-[#7AB8B8]/30 overflow-hidden relative group"
        >
          <div className="flex items-start md:items-center space-x-6 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="p-4 bg-[#7AB8B8]/10 rounded-xl text-[#7AB8B8]"
            >
              {QUICK_RESET_TOOL.icon}
            </motion.div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-1">{QUICK_RESET_TOOL.name}</h3>
              <p className="text-[#6B6B6B]">{QUICK_RESET_TOOL.description}</p>
            </div>
            <div className="hidden md:block">
              <Button>Reset Now</Button>
            </div>
          </div>
          <div className="mt-6 md:hidden relative z-10">
            <Button className="w-full">Reset Now</Button>
          </div>
          
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
              <motion.path 
                d="M0 100C200 80 400 120 800 100V200H0V100Z" 
                fill="#7AB8B8"
                animate={{ d: ["M0 100C200 80 400 120 800 100V200H0V100Z", "M0 100C200 120 400 80 800 100V200H0V100Z", "M0 100C200 80 400 120 800 100V200H0V100Z"] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </svg>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;

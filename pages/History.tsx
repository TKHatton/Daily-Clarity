import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { ToolResult } from '../types';
import { TOOLS, QUICK_RESET_TOOL } from '../constants';
import { EmptyHistoryIllustration } from '../components/Illustrations';
import { motion } from 'framer-motion';

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ToolResult[]>([]);

  useEffect(() => {
    if (user) {
      dbService.getResults(user.id).then(setHistory);
    }
  }, [user]);

  const clearHistory = () => {
    if (window.confirm('Clear all your history?')) {
      // In a real app we'd call Supabase here. 
      // For now we'll just update local state if mock or let service handle it.
      setHistory([]);
    }
  };

  const getToolName = (toolId: string) => {
    const tool = [...TOOLS, QUICK_RESET_TOOL].find(t => t.id === toolId);
    return tool ? tool.name : 'Unknown Tool';
  };

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 space-y-8 flex flex-col items-center"
      >
        <EmptyHistoryIllustration />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#2D2D2D]">No history yet</h2>
          <p className="text-[#6B6B6B] max-w-sm mx-auto">Your insights from the tools will appear here. Start your path to clarity by using one of our thinking tools.</p>
        </div>
        <Button onClick={() => window.location.hash = '#/dashboard'}>Go to Dashboard</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Your History</h1>
          <p className="text-[#6B6B6B]">Reflect on your previous insights</p>
        </div>
        <Button variant="text" onClick={clearHistory} className="text-red-500 hover:text-red-700">
          Clear All
        </Button>
      </header>

      <div className="space-y-8">
        {history.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="space-y-4 relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <span className="bg-[#E8956B]/10 text-[#E8956B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {getToolName(item.toolId)}
                </span>
                <span className="text-xs text-[#6B6B6B]">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mt-4 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wide">Your Input</h4>
                  <p className="text-sm text-[#6B6B6B] bg-[#FAF8F5] p-4 rounded-lg italic">"{item.input.substring(0, 150)}{item.input.length > 150 ? '...' : ''}"</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wide">Clarity Insight</h4>
                  <div className="text-sm text-[#3A3A3A] whitespace-pre-wrap">
                    {item.output.substring(0, 500)}{item.output.length > 500 ? '...' : ''}
                  </div>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FAF8F5] rounded-full -mr-16 -mb-16 z-0" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;

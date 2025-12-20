import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService } from '../services/dbService';
import { personalizationService } from '../services/personalizationService';
import { useAuth } from '../contexts/AuthContext';
import { UserInsight, ToolResult } from '../types';

const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [results, setResults] = useState<ToolResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;
    setIsLoading(true);
    const [insightsData, resultsData] = await Promise.all([
      dbService.getInsights(user.id),
      dbService.getResults(user.id)
    ]);
    setInsights(insightsData);
    setResults(resultsData);
    setIsLoading(false);
  };

  const handleRunAnalysis = async () => {
    if (!user || results.length < 3) return;
    setIsAnalyzing(true);
    try {
      const newInsights = await personalizationService.generateDeepInsights(user.id, results);
      setInsights(newInsights);
      // Also refresh the basic profile themes
      await personalizationService.refreshUserProfile(user.id, results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 border-4 border-[#E8956B] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[#6B6B6B]">Gathering your history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Your Patterns</h1>
          <p className="text-[#6B6B6B]">Deep insights generated from your thinking sessions.</p>
        </div>
        {results.length >= 3 && (
          <Button 
            onClick={handleRunAnalysis} 
            isLoading={isAnalyzing}
            variant={insights.length > 0 ? "secondary" : "primary"}
          >
            {isAnalyzing ? "Analyzing Habits..." : insights.length > 0 ? "Refresh Analysis" : "Generate My Insights"}
          </Button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {insights.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {insights.map((insight, idx) => (
              <motion.div 
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-[#E8956B] flex flex-col group hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#2D2D2D]">{insight.title}</h3>
                    <span className="text-xs font-bold text-[#E8956B] bg-[#E8956B]/10 px-2 py-1 rounded">
                      {Math.round(insight.confidence * 100)}% Match
                    </span>
                  </div>
                  <p className="text-[#3A3A3A] mb-6 flex-grow leading-relaxed">{insight.description}</p>
                  <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5E5E5] group-hover:border-[#E8956B]/30 transition-colors">
                    <h4 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">Personal Suggestion</h4>
                    <p className="text-sm text-[#3A3A3A] font-medium">{insight.suggestion}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12"
          >
            <Card className="text-center py-16 space-y-6">
              <div className="text-5xl">🧠</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#2D2D2D]">Ready to see your patterns?</h2>
                <p className="text-[#6B6B6B] max-w-md mx-auto">
                  {results.length < 3 
                    ? `You've completed ${results.length} sessions. Use the tools a few more times (at least 3) so we can find meaningful patterns in your thinking.`
                    : "You've shared enough for us to find your recurring themes. Click the button above to start the analysis."
                  }
                </p>
              </div>
              {results.length < 3 && (
                <Button variant="secondary" onClick={() => window.location.hash = '#/dashboard'}>
                  Go to Dashboard
                </Button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {user?.commonThemes && user.commonThemes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12 border-t border-[#E5E5E5]"
        >
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Your Recurring Themes</h2>
          <div className="flex flex-wrap gap-4">
            {user.commonThemes.map((theme: string) => (
              <div key={theme} className="bg-white border border-[#E5E5E5] px-6 py-4 rounded-xl shadow-sm flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#7AB8B8]"></div>
                <div className="font-bold text-[#2D2D2D] capitalize">{theme}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Insights;

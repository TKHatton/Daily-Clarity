import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TOOLS } from '../constants';
import { generateClarityResponse, extractConversationMetadata, buildUserContext } from '../services/geminiService';
import { personalizationService } from '../services/personalizationService';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { IconArrowLeft, IconCopy, IconCheck } from '../components/Icons';
import { UserInsight } from '../types';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tool = TOOLS.find(t => t.id === toolId);

  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [insights, setInsights] = useState<UserInsight[]>([]);

  useEffect(() => {
    if (user) {
      dbService.getInsights(user.id).then(setInsights);
    }
  }, [user]);

  if (!tool) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
        <Link to="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!input.trim() || !user) return;
    
    setIsLoading(true);
    setError(null);
    setCopied(false);
    setFeedbackGiven(false);
    
    try {
      const userContext = buildUserContext(user, insights);
      
      const [response, metadata] = await Promise.all([
        generateClarityResponse(tool.systemPrompt, input, userContext),
        extractConversationMetadata(input)
      ]);

      setResult(response || "Sorry, I couldn't generate a response.");
      
      await dbService.saveResult(user.id, {
        toolId: tool.id,
        input: input,
        output: response || '',
        theme: metadata?.main_theme,
        emotion: metadata?.primary_emotion,
        triggers: metadata?.triggers
      });

      // TRIGGER LIVE PERSONALIZATION: 
      // Refresh user profile metadata immediately if they have enough history
      const history = await dbService.getResults(user.id);
      if (history.length % 3 === 0) { // Every 3 sessions, refresh profile
        personalizationService.refreshUserProfile(user.id, history);
      }
      
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (rating: number) => {
    setFeedbackGiven(true);
    // In a real app we'd save this to the conversation record
    console.log(`Rating for session: ${rating}`);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-12">
      <header className="space-y-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm text-[#7AB8B8] hover:underline flex items-center group"
        >
          <IconArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[#2D2D2D]"
        >
          {tool.name}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[#6B6B6B]"
        >
          {tool.description}
        </motion.p>
      </header>

      <section className="space-y-6">
        <label className="block space-y-4">
          <span className="text-[#2D2D2D] font-medium">{tool.promptLabel}</span>
          <textarea
            className="w-full h-64 p-6 bg-white border-2 border-[#E5E5E5] rounded-xl focus:border-[#E8956B] focus:outline-none transition-all resize-none text-[#3A3A3A] text-lg shadow-sm"
            placeholder="Start typing..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleSubmit} 
            isLoading={isLoading}
            disabled={!input.trim()}
          >
            {tool.buttonLabel}
          </Button>
          {result && !isLoading && (
            <Button variant="text" onClick={() => { setInput(''); setResult(null); }}>
              Try Another
            </Button>
          )}
        </div>
      </section>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-red-50 border-red-100 text-red-700">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {result && !isLoading && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="space-y-6"
          >
            <hr className="border-[#E5E5E5]" />
            <Card className="prose max-w-none relative group">
               <div className="whitespace-pre-wrap text-[#3A3A3A] leading-relaxed text-lg">
                  {result}
               </div>
               <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <Button 
                    variant="secondary" 
                    onClick={copyToClipboard} 
                    className="px-6 py-2.5 flex items-center space-x-2"
                  >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy Response'}</span>
                  </Button>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-[#6B6B6B] uppercase">Was this helpful?</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button 
                          key={rating}
                          disabled={feedbackGiven}
                          onClick={() => handleFeedback(rating)}
                          className={`w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-sm font-bold transition-colors ${feedbackGiven ? 'bg-[#FAF8F5] text-[#E5E5E5] border-transparent' : 'hover:border-[#E8956B] hover:text-[#E8956B]'}`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
               {feedbackGiven && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-xs text-[#7AB8B8] font-bold">
                   Thank you for your feedback. We're learning from every interaction.
                 </motion.div>
               )}
            </Card>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolPage;

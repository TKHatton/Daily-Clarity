import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FeedbackRating } from '../components/FeedbackRating';
import { TrainingFeedback } from '../components/TrainingFeedback';
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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

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

      // Save conversation and get the ID for feedback/training
      const savedResult = await dbService.saveResult(user.id, {
        toolId: tool.id,
        input: input,
        output: response || '',
        theme: metadata?.main_theme,
        emotion: metadata?.primary_emotion,
        triggers: metadata?.triggers
      });

      // Get the conversation ID for feedback
      const history = await dbService.getResults(user.id);
      if (history.length > 0) {
        setCurrentConversationId(history[0].id);
      }

      // TRIGGER LIVE PERSONALIZATION:
      // Refresh user profile metadata immediately if they have enough history
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
    if (currentConversationId) {
      await dbService.saveRating(currentConversationId, rating);
    }
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
               <div className="mt-8 flex justify-between items-center">
                  <Button
                    variant="secondary"
                    onClick={copyToClipboard}
                    className="px-6 py-2.5 flex items-center space-x-2"
                  >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy Response'}</span>
                  </Button>
               </div>
            </Card>

            {/* Feedback Rating Component */}
            {!feedbackGiven && (
              <FeedbackRating onRate={handleFeedback} />
            )}

            {/* Training Feedback (only shows if TRAINING_MODE=true) */}
            {currentConversationId && (
              <TrainingFeedback
                conversationId={currentConversationId}
                onComplete={() => console.log('Training feedback completed')}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { QUICK_RESET_TOOL } from '../constants';
import { generateClarityResponse } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';

const QuickReset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    overwhelming: '',
    urgent: '',
    wait: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      id: 1,
      question: "What feels overwhelming right now?",
      key: 'overwhelming' as const,
      placeholder: "List the things that are weighing on you..."
    },
    {
      id: 2,
      question: "What's actually urgent today?",
      key: 'urgent' as const,
      placeholder: "The non-negotiables that must happen in the next few hours..."
    },
    {
      id: 3,
      question: "What can wait until tomorrow (or next week)?",
      key: 'wait' as const,
      placeholder: "Things that feel loud but aren't actually critical today..."
    }
  ];

  const currentStep = steps[step - 1];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        const prompt = `
          User is overwhelmed.
          1. Overwhelming: ${answers.overwhelming}
          2. Urgent: ${answers.urgent}
          3. Can wait: ${answers.wait}
        `;
        const response = await generateClarityResponse(QUICK_RESET_TOOL.systemPrompt, prompt);
        setResult(response || "Reset plan generated.");
        
        if (user && response) {
          await dbService.saveResult(user.id, {
            toolId: QUICK_RESET_TOOL.id,
            input: prompt,
            output: response
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to generate reset plan.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto space-y-12"
      >
        <header className="space-y-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-[#7AB8B8] hover:underline flex items-center">
            <span className="mr-2">&larr;</span> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-[#2D2D2D]">Your 10-Minute Reset</h1>
          <p className="text-xl text-[#6B6B6B]">Breathe. You have a plan now.</p>
        </header>
        <Card className="prose prose-slate max-w-none shadow-lg border-[#7AB8B8]/30">
          <div className="whitespace-pre-wrap text-lg text-[#3A3A3A] leading-relaxed">
            {result}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/dashboard')}>Finish Reset</Button>
            <Button variant="secondary" onClick={() => { setStep(1); setResult(null); setAnswers({overwhelming:'', urgent:'', wait:''}); }}>Start New Reset</Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-12">
      <header className="space-y-4">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-[#7AB8B8] hover:underline flex items-center">
          <span className="mr-2">&larr;</span> Back to Dashboard
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-[#2D2D2D]">Quick Reset</h1>
            <p className="text-xl text-[#6B6B6B]">Find focus in the chaos</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#E8956B] uppercase tracking-wider mb-1">Step {step} of 3</div>
            <div className="flex space-x-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${s <= step ? 'bg-[#E8956B]' : 'bg-[#E5E5E5]'}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className="space-y-8">
            <h2 className="text-2xl font-bold text-[#2D2D2D]">{currentStep.question}</h2>
            <textarea
              className="w-full h-64 p-6 bg-[#FAF8F5] border-2 border-[#E5E5E5] rounded-xl focus:border-[#E8956B] focus:outline-none transition-all resize-none text-[#3A3A3A] text-lg"
              placeholder={currentStep.placeholder}
              value={answers[currentStep.key]}
              onChange={(e) => setAnswers({...answers, [currentStep.key]: e.target.value})}
              autoFocus
            />
            <div className="flex justify-between items-center">
              <div>
                {step > 1 && (
                  <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>
                )}
              </div>
              <Button 
                onClick={handleNext}
                isLoading={isLoading}
                disabled={!answers[currentStep.key].trim()}
              >
                {step === 3 ? 'Generate My Plan' : 'Next Step'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-red-50 text-red-700 border-red-100">
              {error}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickReset;

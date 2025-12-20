/**
 * Training Feedback Component
 *
 * Shows during training mode to collect detailed feedback
 * on each conversation for validation purposes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { trainingService } from '../services/trainingService';

interface TrainingFeedbackProps {
  conversationId: string;
  onComplete?: () => void;
}

export const TrainingFeedback: React.FC<TrainingFeedbackProps> = ({ conversationId, onComplete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatINeeded: '',
    whatWasHelpful: '',
    whatWasMissing: '',
    emotionalAccuracy: 3,
    wouldUseAgain: true,
    additionalNotes: ''
  });

  const handleSubmit = async () => {
    setIsSaving(true);
    const success = await trainingService.saveAnnotation({
      conversationId,
      ...formData
    });

    if (success) {
      setIsOpen(false);
      onComplete?.();
    }
    setIsSaving(false);
  };

  const handleSkip = () => {
    setIsOpen(false);
    onComplete?.();
  };

  if (!trainingService.isTrainingMode()) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 right-4 w-96 z-50"
        >
          <Card className="bg-yellow-50 border-2 border-yellow-400 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧪</span>
              <h3 className="font-bold text-yellow-900">Training Mode Feedback</h3>
            </div>

            <p className="text-sm text-yellow-800 mb-4">
              Help validate the AI by providing detailed feedback on this session.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What did you need from this session?
                </label>
                <input
                  type="text"
                  value={formData.whatINeeded}
                  onChange={e => setFormData({ ...formData, whatINeeded: e.target.value })}
                  placeholder="e.g., clarity on a decision, emotional support"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What was helpful?
                </label>
                <input
                  type="text"
                  value={formData.whatWasHelpful}
                  onChange={e => setFormData({ ...formData, whatWasHelpful: e.target.value })}
                  placeholder="e.g., breaking it down, acknowledging my feelings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What was missing?
                </label>
                <input
                  type="text"
                  value={formData.whatWasMissing}
                  onChange={e => setFormData({ ...formData, whatWasMissing: e.target.value })}
                  placeholder="e.g., didn't address my fear, too generic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emotional accuracy: {formData.emotionalAccuracy}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.emotionalAccuracy}
                  onChange={e => setFormData({ ...formData, emotionalAccuracy: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Missed the mark</span>
                  <span>Perfectly understood</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.wouldUseAgain}
                    onChange={e => setFormData({ ...formData, wouldUseAgain: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">I would use this tool again for a similar situation</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional notes (optional)
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any other feedback..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSubmit}
                isLoading={isSaving}
                variant="primary"
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Submit Feedback'}
              </Button>
              <Button
                onClick={handleSkip}
                variant="secondary"
              >
                Skip
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

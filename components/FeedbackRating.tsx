/**
 * Feedback Rating Component
 *
 * Simple 1-5 star rating that appears after AI responses
 * to collect user satisfaction data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FeedbackRatingProps {
  onRate: (rating: number) => void;
  className?: string;
}

export const FeedbackRating: React.FC<FeedbackRatingProps> = ({ onRate, className = '' }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#FAF8F5] rounded-xl p-4 border border-[#E5E5E5] ${className}`}
    >
      <p className="text-sm text-[#6B6B6B] mb-3">
        {selectedRating ? 'Thanks for your feedback!' : 'Was this helpful?'}
      </p>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => handleRate(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(null)}
            disabled={selectedRating !== null}
            className={`
              w-10 h-10 rounded-lg font-bold text-lg transition-all
              ${selectedRating === rating || hoverRating === rating
                ? 'bg-[#E8956B] text-white shadow-md transform scale-110'
                : selectedRating !== null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-[#E5E5E5] text-[#6B6B6B] hover:border-[#E8956B] hover:text-[#E8956B]'
              }
              ${selectedRating !== null ? '' : 'hover:shadow-sm'}
            `}
          >
            {rating}
          </button>
        ))}
      </div>

      {selectedRating && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[#6B6B6B] mt-2"
        >
          {selectedRating >= 4
            ? "We're glad this was helpful! 💚"
            : selectedRating === 3
            ? "We'll keep improving! 🔧"
            : "Sorry this wasn't more helpful. We'll do better! 🙏"
          }
        </motion.p>
      )}
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, CreditCard, Percent, Star } from 'lucide-react';
import { CardRecommendation } from '../types';

interface CardRecommendationProps {
  recommendation: CardRecommendation;
  index: number;
  onCompare: (cardId: string) => void;
}

export const CardRecommendationComponent: React.FC<CardRecommendationProps> = ({
  recommendation,
  index,
  onCompare
}) => {
  const { card, reasons, estimatedRewards, matchPercentage } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header with match percentage */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <CreditCard className="w-16 h-16 text-white opacity-80" />
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {matchPercentage}% Match
        </div>
        
        {index === 0 && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            Best Match
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Card Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
          <p className="text-gray-600">{card.issuer}</p>
        </div>

        {/* Fees */}
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Joining Fee</p>
            <p className="font-semibold text-gray-900">
              {card.joiningFee === 0 ? 'FREE' : `₹${card.joiningFee.toLocaleString()}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Annual Fee</p>
            <p className="font-semibold text-gray-900">
              {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Why This Card */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            Why This Card?
          </h4>
          <ul className="space-y-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Reward Estimation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-green-800">Estimated Annual Rewards</h4>
          </div>
          <p className="text-2xl font-bold text-green-700">
            ₹{Math.round(estimatedRewards).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">
            Based on your spending pattern
          </p>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
          <div className="space-y-1">
            {card.features.slice(0, 3).map((feature, idx) => (
              <p key={idx} className="text-sm text-gray-600">• {feature}</p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onCompare(card.id)}
            className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Compare
          </button>
          <a
            href={card.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
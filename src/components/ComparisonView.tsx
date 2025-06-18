import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';
import { CreditCard } from '../types';

interface ComparisonViewProps {
  cards: CreditCard[];
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ cards, onClose }) => {
  if (cards.length === 0) return null;

  const comparisonRows = [
    { key: 'joiningFee', label: 'Joining Fee', format: (value: number) => value === 0 ? 'FREE' : `₹${value.toLocaleString()}` },
    { key: 'annualFee', label: 'Annual Fee', format: (value: number) => value === 0 ? 'FREE' : `₹${value.toLocaleString()}` },
    { key: 'rewardType', label: 'Reward Type', format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1) },
    { key: 'minIncome', label: 'Min. Annual Income', format: (value: number) => `₹${(value / 100000).toFixed(1)}L` },
    { key: 'minCreditScore', label: 'Min. Credit Score', format: (value: number) => value.toString() }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Card Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-900 w-48">Feature</th>
                {cards.map((card) => (
                  <th key={card.id} className="text-center p-4 min-w-64">
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg opacity-20" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{card.name}</h3>
                        <p className="text-xs text-gray-500">{card.issuer}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 font-medium text-gray-900">{row.label}</td>
                  {cards.map((card) => {
                    const value = row.key.includes('.')
                      ? row.key.split('.').reduce((obj, key) => obj[key], card as any)
                      : (card as any)[row.key] || card.eligibilityCriteria[row.key as keyof typeof card.eligibilityCriteria];
                    
                    return (
                      <td key={card.id} className="p-4 text-center text-gray-700">
                        {row.format(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Special Perks */}
              <tr className="bg-white">
                <td className="p-4 font-medium text-gray-900">Special Perks</td>
                {cards.map((card) => (
                  <td key={card.id} className="p-4">
                    <div className="space-y-1">
                      {card.specialPerks.slice(0, 3).map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {perk}
                        </div>
                      ))}
                      {card.specialPerks.length > 3 && (
                        <p className="text-xs text-gray-400">+{card.specialPerks.length - 3} more</p>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category Rewards */}
              <tr className="bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Best Categories</td>
                {cards.map((card) => (
                  <td key={card.id} className="p-4">
                    <div className="space-y-1">
                      {card.categories
                        .sort((a, b) => b.rate - a.rate)
                        .slice(0, 3)
                        .map((category, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            <span className="font-medium">{category.rate}X</span> {category.category}
                          </div>
                        ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-4 justify-center">
            {cards.map((card) => (
              <a
                key={card.id}
                href={card.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Apply for {card.name}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
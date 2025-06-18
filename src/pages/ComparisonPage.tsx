import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Minus, ExternalLink, CreditCard } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { creditCardsData } from '../data/creditCards';
import { CreditCard as CreditCardType } from '../types';

export const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cards, setCards] = useState<CreditCardType[]>([]);

  useEffect(() => {
    const cardIds = searchParams.get('cards')?.split(',') || [];
    const selectedCards = creditCardsData.filter(card => cardIds.includes(card.id));
    setCards(selectedCards);
  }, [searchParams]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Cards Selected</h1>
            <p className="text-gray-600 mb-6">Please select at least 2 cards to compare.</p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const comparisonRows = [
    { key: 'joiningFee', label: 'Joining Fee', format: (value: number) => value === 0 ? 'FREE' : `₹${value.toLocaleString()}` },
    { key: 'annualFee', label: 'Annual Fee', format: (value: number) => value === 0 ? 'FREE' : `₹${value.toLocaleString()}` },
    { key: 'rewardType', label: 'Reward Type', format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1) },
    { key: 'minIncome', label: 'Min. Annual Income', format: (value: number) => `₹${(value / 100000).toFixed(1)}L` },
    { key: 'minCreditScore', label: 'Min. Credit Score', format: (value: number) => value.toString() }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Recommendations
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Card Comparison</h1>
          <p className="text-gray-600">Compare {cards.length} selected credit cards side by side</p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-6 font-semibold text-gray-900 w-48">Feature</th>
                  {cards.map((card) => (
                    <th key={card.id} className="text-center p-6 min-w-64">
                      <div className="space-y-3">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center">
                          <img 
                            src={card.image} 
                            alt={card.name} 
                            className="w-full h-full object-cover rounded-xl opacity-20" 
                          />
                          <CreditCard className="absolute w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{card.name}</h3>
                          <p className="text-sm text-gray-500">{card.issuer}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-6 font-medium text-gray-900">{row.label}</td>
                    {cards.map((card) => {
                      const value = row.key.includes('.')
                        ? row.key.split('.').reduce((obj, key) => obj[key], card as any)
                        : (card as any)[row.key] || card.eligibilityCriteria[row.key as keyof typeof card.eligibilityCriteria];
                      
                      return (
                        <td key={card.id} className="p-6 text-center text-gray-700 font-medium">
                          {row.format(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Special Perks */}
                <tr className="bg-white">
                  <td className="p-6 font-medium text-gray-900">Special Perks</td>
                  {cards.map((card) => (
                    <td key={card.id} className="p-6">
                      <div className="space-y-2">
                        {card.specialPerks.slice(0, 4).map((perk, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </div>
                        ))}
                        {card.specialPerks.length > 4 && (
                          <p className="text-xs text-gray-400 mt-2">+{card.specialPerks.length - 4} more perks</p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category Rewards */}
                <tr className="bg-gray-50">
                  <td className="p-6 font-medium text-gray-900">Best Categories</td>
                  {cards.map((card) => (
                    <td key={card.id} className="p-6">
                      <div className="space-y-2">
                        {card.categories
                          .sort((a, b) => b.rate - a.rate)
                          .slice(0, 4)
                          .map((category, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              <span className="font-bold text-blue-600">{category.rate}X</span> {category.category}
                            </div>
                          ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Features */}
                <tr className="bg-white">
                  <td className="p-6 font-medium text-gray-900">Key Features</td>
                  {cards.map((card) => (
                    <td key={card.id} className="p-6">
                      <div className="space-y-2">
                        {card.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {card.features.length > 3 && (
                          <p className="text-xs text-gray-400 mt-2">+{card.features.length - 3} more features</p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Welcome Bonus */}
                <tr className="bg-gray-50">
                  <td className="p-6 font-medium text-gray-900">Welcome Bonus</td>
                  {cards.map((card) => (
                    <td key={card.id} className="p-6 text-center text-sm text-gray-600">
                      {card.welcomeBonus || 'Not specified'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-4 justify-center">
              {cards.map((card) => (
                <a
                  key={card.id}
                  href={card.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Apply for {card.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Back to Recommendations
          </button>
        </motion.div>
      </div>
    </div>
  );
};
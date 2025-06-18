import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Edit3, DollarSign, CreditCard, Heart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  monthly_income: number | null;
  spending_habits: {
    fuel?: number;
    travel?: number;
    groceries?: number;
    dining?: number;
    online?: number;
    utilities?: number;
  } | null;
  preferred_benefits: string[] | null;
  credit_score: number | null;
}

export const ProfilePage: React.FC = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    monthly_income: null,
    spending_habits: null,
    preferred_benefits: null,
    credit_score: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const incomeRanges = [
    { value: 25000, label: '₹25,000 - ₹35,000' },
    { value: 40000, label: '₹35,000 - ₹50,000' },
    { value: 60000, label: '₹50,000 - ₹75,000' },
    { value: 85000, label: '₹75,000 - ₹1,00,000' },
    { value: 125000, label: '₹1,00,000 - ₹1,50,000' },
    { value: 200000, label: '₹1,50,000 - ₹2,50,000' },
    { value: 350000, label: '₹2,50,000 - ₹5,00,000' },
    { value: 750000, label: '₹5,00,000+' }
  ];

  const creditScoreRanges = [
    { value: 550, label: 'Fair (500-600)' },
    { value: 650, label: 'Good (600-700)' },
    { value: 750, label: 'Very Good (700-800)' },
    { value: 850, label: 'Excellent (800+)' },
    { value: 0, label: "I don't know" }
  ];

  const benefitOptions = [
    'Cashback on purchases',
    'Travel points/miles',
    'Airport lounge access',
    'Movie ticket discounts',
    'Fuel surcharge waivers',
    'Dining discounts',
    'Online shopping rewards',
    'Grocery rewards',
    'No annual fee'
  ];

  useEffect(() => {
    if (isGuest) {
      navigate('/chat');
      return;
    }
    loadProfile();
  }, [user, isGuest]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          monthly_income: data.monthly_income,
          spending_habits: data.spending_habits,
          preferred_benefits: data.preferred_benefits,
          credit_score: data.credit_score
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          monthly_income: profile.monthly_income,
          spending_habits: profile.spending_habits,
          preferred_benefits: profile.preferred_benefits,
          credit_score: profile.credit_score,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const updateSpendingHabit = (category: string, value: number) => {
    setProfile(prev => ({
      ...prev,
      spending_habits: {
        ...prev.spending_habits,
        [category]: value
      }
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setProfile(prev => {
      const currentBenefits = prev.preferred_benefits || [];
      const isSelected = currentBenefits.includes(benefit);
      
      return {
        ...prev,
        preferred_benefits: isSelected
          ? currentBenefits.filter(b => b !== benefit)
          : [...currentBenefits, benefit]
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Update your financial profile to get better credit card recommendations
          </p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">Monthly Income</h3>
            </div>
            <div className="space-y-3">
              {incomeRanges.map((range) => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="income"
                    value={range.value}
                    checked={profile.monthly_income === range.value}
                    onChange={(e) => setProfile(prev => ({ ...prev, monthly_income: parseInt(e.target.value) }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Credit Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900">Credit Score</h3>
            </div>
            <div className="space-y-3">
              {creditScoreRanges.map((range) => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="creditScore"
                    value={range.value}
                    checked={profile.credit_score === range.value}
                    onChange={(e) => setProfile(prev => ({ ...prev, credit_score: parseInt(e.target.value) }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Spending Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900">Monthly Spending</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'fuel', label: 'Fuel & Petrol', placeholder: '3000' },
                { key: 'travel', label: 'Travel & Transport', placeholder: '2000' },
                { key: 'groceries', label: 'Groceries & Shopping', placeholder: '8000' },
                { key: 'dining', label: 'Dining & Food', placeholder: '4000' },
                { key: 'online', label: 'Online Shopping', placeholder: '5000' },
                { key: 'utilities', label: 'Bills & Utilities', placeholder: '2000' }
              ].map((category) => (
                <div key={category.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {category.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      placeholder={category.placeholder}
                      value={profile.spending_habits?.[category.key as keyof typeof profile.spending_habits] || ''}
                      onChange={(e) => updateSpendingHabit(category.key, parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferred Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">Preferred Benefits</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select all benefits that matter to you:</p>
            <div className="space-y-3">
              {benefitOptions.map((benefit) => (
                <label key={benefit} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.preferred_benefits?.includes(benefit) || false}
                    onChange={() => toggleBenefit(benefit)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-gray-700">{benefit}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
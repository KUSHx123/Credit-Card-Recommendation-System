import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { openaiAssistant } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { CardRecommendationComponent } from '../components/CardRecommendation';
import { ComparisonView } from '../components/ComparisonView';
import { creditCardsData } from '../data/creditCards';
import { RecommendationEngine } from '../utils/recommendationEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedCardsForComparison, setSelectedCardsForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [openaiAvailable, setOpenaiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recommendationEngine = new RecommendationEngine();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    initializeChat();
  }, [user]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Check if OpenAI is available
      const isOpenAIAvailable = openaiAssistant.isOpenAIAvailable();
      setOpenaiAvailable(isOpenAIAvailable);

      // Check for existing active session
      const { data: existingSession } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      let currentSessionId: string;

      if (existingSession) {
        currentSessionId = existingSession.id;
        setSessionId(currentSessionId);
        
        // Load existing messages
        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true });

        if (existingMessages && existingMessages.length > 0) {
          const formattedMessages = existingMessages.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at)
          }));
          setMessages(formattedMessages);
          
          // Check if conversation was completed
          const lastMessage = existingMessages[existingMessages.length - 1];
          if (lastMessage.content.toLowerCase().includes('recommend') || 
              lastMessage.content.toLowerCase().includes('based on your profile')) {
            // Generate recommendations from existing conversation
            setTimeout(() => {
              generateRecommendationsFromConversation(formattedMessages);
            }, 1000);
          }
        }

        // Set up OpenAI assistant with existing thread if available
        if (isOpenAIAvailable && existingSession.assistant_id) {
          openaiAssistant.setAssistantId(existingSession.assistant_id);
        }
        if (isOpenAIAvailable && existingSession.thread_id) {
          openaiAssistant.setThreadId(existingSession.thread_id);
        }
      } else {
        // Create new session
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            status: 'active'
          })
          .select()
          .single();

        if (newSession) {
          currentSessionId = newSession.id;
          setSessionId(currentSessionId);
          
          // Initialize OpenAI assistant if available
          if (isOpenAIAvailable) {
            try {
              const assistantId = await openaiAssistant.createAssistant();
              const threadId = await openaiAssistant.createThread();

              // Update session with OpenAI IDs
              await supabase
                .from('chat_sessions')
                .update({
                  assistant_id: assistantId,
                  thread_id: threadId
                })
                .eq('id', currentSessionId);
            } catch (error) {
              console.warn('Failed to initialize OpenAI assistant:', error);
              setOpenaiAvailable(false);
            }
          }

          // Send initial greeting
          setTimeout(() => {
            sendInitialGreeting();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Fallback: send initial greeting without OpenAI
      setTimeout(() => {
        sendInitialGreeting();
      }, 1000);
    }
  };

  const sendInitialGreeting = async () => {
    const greeting = openaiAvailable 
      ? `Hello! 👋 I'm your AI credit card advisor, and I'm excited to help you find the perfect credit card for your needs!

I'll ask you a few questions about your financial profile and spending habits to provide personalized recommendations from 20+ Indian credit cards.

Let's start with the basics - what's your approximate monthly income? You can share a range if you prefer (e.g., "around 50,000" or "between 30-40k").`
      : `Hello! 👋 Welcome to CardAdvisor AI!

I'll help you find the perfect credit card by asking a few questions about your financial profile and spending habits.

Since our AI assistant is currently unavailable, I'll guide you through a quick questionnaire to provide personalized recommendations from 20+ Indian credit cards.

Let's start - what's your approximate monthly income? You can share a range if you prefer (e.g., "around 50,000" or "between 30-40k").`;
    
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    };

    setMessages([message]);
    
    if (sessionId) {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: greeting
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Save user message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: userMessage.content
        });

      let response: string;

      if (openaiAvailable) {
        try {
          // Send to OpenAI Assistant
          response = await openaiAssistant.sendMessage(userMessage.content);
        } catch (error) {
          console.error('OpenAI error:', error);
          // Fallback to rule-based response
          response = generateRuleBasedResponse(userMessage.content, messages);
          setOpenaiAvailable(false);
        }
      } else {
        // Use rule-based response
        response = generateRuleBasedResponse(userMessage.content, messages);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: response
        });

      // Check if conversation is complete and should show recommendations
      if (response.toLowerCase().includes('ready to provide') || 
          response.toLowerCase().includes('personalized recommendations') ||
          response.toLowerCase().includes('based on your profile') ||
          response.toLowerCase().includes('here are my recommendations')) {
        
        // Generate recommendations from conversation
        setTimeout(() => {
          generateRecommendationsFromConversation([...messages, userMessage, assistantMessage]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Let me provide you with some great credit card recommendations based on typical spending patterns. Please continue with your questions!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Generate default recommendations
      setTimeout(() => {
        generateDefaultRecommendations();
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const generateRuleBasedResponse = (userInput: string, conversationHistory: Message[]): string => {
    const input = userInput.toLowerCase();
    const conversationText = conversationHistory.map(m => m.content.toLowerCase()).join(' ');

    // Check what information we already have
    const hasIncome = conversationText.includes('income') || conversationText.includes('salary');
    const hasSpending = conversationText.includes('spending') || conversationText.includes('fuel') || conversationText.includes('groceries');
    const hasBenefits = conversationText.includes('benefits') || conversationText.includes('cashback') || conversationText.includes('points');

    // Income question
    if (!hasIncome && (input.includes('income') || input.match(/\d+/))) {
      return `Thank you for sharing your income information! That helps me understand your eligibility for different cards.

Now, let's talk about your spending habits. This will help me recommend cards with the best rewards for your lifestyle.

How much do you typically spend on fuel per month? (e.g., "around 3,000" or "I don't drive much")`;
    }

    // Spending questions
    if (!hasSpending && (input.includes('fuel') || input.includes('petrol') || input.includes('gas'))) {
      return `Got it! Fuel spending is important for reward calculations.

What about groceries and daily shopping? How much do you spend monthly on groceries, supermarkets, or local stores?`;
    }

    if (input.includes('groceries') || input.includes('shopping') || input.includes('store')) {
      return `Perfect! Now I'm getting a good picture of your spending pattern.

Do you frequently dine out or order food online? What's your approximate monthly spending on restaurants, food delivery, or dining?`;
    }

    if (input.includes('dining') || input.includes('food') || input.includes('restaurant')) {
      return `Excellent! One more spending category - do you do much online shopping? This includes e-commerce sites like Amazon, Flipkart, or any online purchases.

What's your typical monthly online shopping amount?`;
    }

    // Benefits question
    if (!hasBenefits && (input.includes('online') || input.includes('amazon') || input.includes('flipkart'))) {
      return `Great! Now I have a good understanding of your spending habits.

What type of benefits matter most to you? Please choose from:
- Cashback on purchases
- Travel points/miles
- Airport lounge access
- Movie ticket discounts
- Fuel surcharge waivers
- Dining discounts

You can mention multiple preferences!`;
    }

    // Final question - credit score
    if (hasBenefits && (input.includes('cashback') || input.includes('points') || input.includes('lounge') || input.includes('movie') || input.includes('fuel') || input.includes('dining'))) {
      return `Perfect! I now have all the information I need about your preferences.

One last question - what's your approximate credit score range?
- Excellent (750+)
- Good (650-750) 
- Fair (600-650)
- I'm not sure

Based on all this information, I'll be ready to provide personalized recommendations that match your profile perfectly!`;
    }

    // Ready for recommendations
    if (input.includes('excellent') || input.includes('good') || input.includes('fair') || input.includes('not sure') || input.includes('don\'t know')) {
      return `Wonderful! I now have a complete picture of your financial profile and preferences.

Based on your income, spending habits, preferred benefits, and credit profile, I'm ready to provide personalized credit card recommendations that will maximize your rewards and benefits.

Let me analyze the best matches for you from our database of 20+ Indian credit cards...`;
    }

    // Default response
    return `Thank you for that information! Could you provide a bit more detail? I want to make sure I give you the most accurate recommendations possible.

If you'd like, you can also tell me about any specific credit card features you're looking for, or any banks you prefer.`;
  };

  const generateRecommendationsFromConversation = async (conversationMessages: Message[]) => {
    try {
      // Extract user profile from conversation
      const userProfile = recommendationEngine.extractUserProfileFromConversation(conversationMessages);
      
      // If profile is too sparse, use defaults
      if (!userProfile.monthlyIncome) {
        userProfile.monthlyIncome = 40000; // Default assumption
      }
      if (!userProfile.spendingHabits || Object.keys(userProfile.spendingHabits).length === 0) {
        userProfile.spendingHabits = {
          fuel: 3000,
          travel: 2000,
          groceries: 8000,
          dining: 4000,
          online: 5000,
          utilities: 2000
        };
      }
      if (!userProfile.preferredBenefits || userProfile.preferredBenefits.length === 0) {
        userProfile.preferredBenefits = ['Cashback', 'Fuel Benefits'];
      }
      if (!userProfile.creditScore) {
        userProfile.creditScore = 700; // Default assumption
      }

      // Save user profile to database
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: user!.id,
          monthly_income: userProfile.monthlyIncome,
          spending_habits: userProfile.spendingHabits,
          preferred_benefits: userProfile.preferredBenefits,
          credit_score: userProfile.creditScore
        });

      const recs = recommendationEngine.generateRecommendations(userProfile);
      setRecommendations(recs);
      setShowRecommendations(true);

      // Update session status
      if (sessionId) {
        await supabase
          .from('chat_sessions')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

    } catch (error) {
      console.error('Error generating recommendations:', error);
      generateDefaultRecommendations();
    }
  };

  const generateDefaultRecommendations = async () => {
    try {
      // Default user profile for fallback
      const defaultProfile = {
        monthlyIncome: 40000,
        spendingHabits: {
          fuel: 3000,
          travel: 2000,
          groceries: 8000,
          dining: 4000,
          online: 5000,
          utilities: 2000
        },
        preferredBenefits: ['Cashback', 'Fuel Benefits'],
        creditScore: 700
      };

      const recs = recommendationEngine.generateRecommendations(defaultProfile);
      setRecommendations(recs);
      setShowRecommendations(true);

    } catch (error) {
      console.error('Error generating default recommendations:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      // Mark current session as completed
      if (sessionId) {
        await supabase
          .from('chat_sessions')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

      // Reset state
      setMessages([]);
      setSessionId(null);
      setShowRecommendations(false);
      setRecommendations([]);
      setSelectedCardsForComparison([]);
      setShowComparison(false);

      // Initialize new chat
      await initializeChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const handleCompareCard = (cardId: string) => {
    if (selectedCardsForComparison.includes(cardId)) {
      setSelectedCardsForComparison(prev => prev.filter(id => id !== cardId));
    } else if (selectedCardsForComparison.length < 3) {
      setSelectedCardsForComparison(prev => [...prev, cardId]);
    }
  };

  const handleShowComparison = () => {
    if (selectedCardsForComparison.length >= 2) {
      setShowComparison(true);
    }
  };

  const comparisonCards = creditCardsData.filter(card => 
    selectedCardsForComparison.includes(card.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showRecommendations ? (
          /* Chat Interface */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 rounded-t-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">Credit Card Advisor AI</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    {isTyping ? 'Typing...' : 'Ready to help you find the perfect card'}
                    {!openaiAvailable && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                        <AlertCircle className="w-3 h-3" />
                        Fallback Mode
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Recommendations View */
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Sparkles className="w-8 h-8 text-purple-500" />
                <h2 className="text-3xl font-bold text-gray-900">Your Personalized Credit Card Recommendations</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Based on your profile and conversation, here are the top credit cards that match your spending habits and preferences. Each recommendation includes estimated annual rewards based on your spending pattern.
              </motion.p>
            </div>

            {/* Comparison Button */}
            {selectedCardsForComparison.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <button
                  onClick={handleShowComparison}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                >
                  Compare Selected Cards ({selectedCardsForComparison.length})
                </button>
              </motion.div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((recommendation, index) => (
                <CardRecommendationComponent
                  key={recommendation.card.id}
                  recommendation={recommendation}
                  index={index}
                  onCompare={handleCompareCard}
                />
              ))}
            </div>

            {/* New Chat Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button
                onClick={handleNewChat}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                Start New Consultation
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonView
            cards={comparisonCards}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
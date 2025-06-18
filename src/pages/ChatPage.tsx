import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, RefreshCw, Sparkles, AlertCircle, Info } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { openaiAssistant } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { CardRecommendationComponent } from '../components/CardRecommendation';
import { creditCardsData } from '../data/creditCards';
import { RecommendationEngine } from '../utils/recommendationEngine';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  options?: string[];
}

type ConversationStep = 
  | 'greeting'
  | 'income'
  | 'spending_fuel'
  | 'spending_travel' 
  | 'spending_groceries'
  | 'spending_dining'
  | 'spending_online'
  | 'spending_utilities'
  | 'benefits'
  | 'existing_cards'
  | 'credit_score'
  | 'recommendations';

interface UserProfile {
  monthlyIncome?: number;
  spendingHabits?: {
    fuel: number;
    travel: number;
    groceries: number;
    dining: number;
    online: number;
    utilities: number;
  };
  preferredBenefits?: string[];
  existingCards?: string[];
  creditScore?: number;
}

export const ChatPage: React.FC = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedCardsForComparison, setSelectedCardsForComparison] = useState<string[]>([]);
  const [openaiAvailable, setOpenaiAvailable] = useState(true);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [userProfile, setUserProfile] = useState<UserProfile>({});
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
  }, [user, isGuest]);

  const initializeChat = async () => {
    if (!user && !isGuest) return;

    try {
      // Check if OpenAI is available
      const isOpenAIAvailable = openaiAssistant.isOpenAIAvailable();
      setOpenaiAvailable(isOpenAIAvailable);

      // For guest users, skip database operations
      if (isGuest) {
        setTimeout(() => {
          sendInitialGreeting();
        }, 1000);
        return;
      }

      // For authenticated users, handle database operations
      if (user) {
        // Check for existing active session
        const { data: existingSession } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

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
    const greeting = `Hello! 👋 I'm your AI credit card advisor, and I'm excited to help you find the perfect credit card for your needs!

I'll ask you a few questions about your financial profile and spending habits to provide personalized recommendations from 20+ Indian credit cards.

Let's start with the basics - what's your approximate monthly income?`;
    
    const incomeOptions = [
      '₹25,000 - ₹35,000',
      '₹35,000 - ₹50,000',
      '₹50,000 - ₹75,000',
      '₹75,000 - ₹1,00,000',
      '₹1,00,000 - ₹1,50,000',
      '₹1,50,000 - ₹2,50,000',
      '₹2,50,000 - ₹5,00,000',
      '₹5,00,000+'
    ];
    
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      options: incomeOptions
    };

    setMessages([message]);
    setCurrentStep('income');
    
    // Only save to database if user is authenticated
    if (sessionId && user) {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: greeting
        });
    }
  };

  const handleOptionClick = async (option: string) => {
    if (isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Save user message to database only if authenticated
    if (sessionId && user) {
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: option
        });
    }

    // Process the response based on current step
    setTimeout(async () => {
      const response = await processStepResponse(option);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        options: response.options
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database only if authenticated
      if (sessionId && user) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: response.content
          });
      }

      setIsTyping(false);
    }, 1500);
  };

  const processStepResponse = async (userInput: string): Promise<{ content: string; options?: string[] }> => {
    switch (currentStep) {
      case 'income':
        // Parse income and store
        const incomeMap: { [key: string]: number } = {
          '₹25,000 - ₹35,000': 30000,
          '₹35,000 - ₹50,000': 42500,
          '₹50,000 - ₹75,000': 62500,
          '₹75,000 - ₹1,00,000': 87500,
          '₹1,00,000 - ₹1,50,000': 125000,
          '₹1,50,000 - ₹2,50,000': 200000,
          '₹2,50,000 - ₹5,00,000': 375000,
          '₹5,00,000+': 750000
        };
        
        setUserProfile(prev => ({ ...prev, monthlyIncome: incomeMap[userInput] }));
        setCurrentStep('spending_fuel');
        
        return {
          content: `Great! Now let's understand your spending habits to find cards with the best rewards for your lifestyle.

How much do you typically spend on fuel and petrol per month?`,
          options: ['₹0 - ₹1,000', '₹1,000 - ₹2,000', '₹2,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000+', "I don't drive"]
        };

      case 'spending_fuel':
        const fuelMap: { [key: string]: number } = {
          '₹0 - ₹1,000': 500,
          '₹1,000 - ₹2,000': 1500,
          '₹2,000 - ₹3,000': 2500,
          '₹3,000 - ₹5,000': 4000,
          '₹5,000+': 6000,
          "I don't drive": 0
        };
        
        setUserProfile(prev => ({ 
          ...prev, 
          spendingHabits: { ...prev.spendingHabits, fuel: fuelMap[userInput] || 0 } as any
        }));
        setCurrentStep('spending_groceries');
        
        return {
          content: `Perfect! What about groceries and daily shopping? How much do you spend monthly on groceries, supermarkets, or local stores?`,
          options: ['₹2,000 - ₹4,000', '₹4,000 - ₹6,000', '₹6,000 - ₹8,000', '₹8,000 - ₹12,000', '₹12,000+']
        };

      case 'spending_groceries':
        const groceryMap: { [key: string]: number } = {
          '₹2,000 - ₹4,000': 3000,
          '₹4,000 - ₹6,000': 5000,
          '₹6,000 - ₹8,000': 7000,
          '₹8,000 - ₹12,000': 10000,
          '₹12,000+': 15000
        };
        
        setUserProfile(prev => ({ 
          ...prev, 
          spendingHabits: { ...prev.spendingHabits, groceries: groceryMap[userInput] || 0 } as any
        }));
        setCurrentStep('spending_dining');
        
        return {
          content: `Excellent! Do you frequently dine out or order food online? What's your approximate monthly spending on restaurants, food delivery, or dining?`,
          options: ['₹1,000 - ₹2,000', '₹2,000 - ₹4,000', '₹4,000 - ₹6,000', '₹6,000 - ₹10,000', '₹10,000+', 'Rarely dine out']
        };

      case 'spending_dining':
        const diningMap: { [key: string]: number } = {
          '₹1,000 - ₹2,000': 1500,
          '₹2,000 - ₹4,000': 3000,
          '₹4,000 - ₹6,000': 5000,
          '₹6,000 - ₹10,000': 8000,
          '₹10,000+': 12000,
          'Rarely dine out': 500
        };
        
        setUserProfile(prev => ({ 
          ...prev, 
          spendingHabits: { ...prev.spendingHabits, dining: diningMap[userInput] || 0 } as any
        }));
        setCurrentStep('spending_online');
        
        return {
          content: `Great! What about online shopping? This includes e-commerce sites like Amazon, Flipkart, or any online purchases. What's your typical monthly online shopping amount?`,
          options: ['₹1,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000 - ₹8,000', '₹8,000 - ₹15,000', '₹15,000+', 'Minimal online shopping']
        };

      case 'spending_online':
        const onlineMap: { [key: string]: number } = {
          '₹1,000 - ₹3,000': 2000,
          '₹3,000 - ₹5,000': 4000,
          '₹5,000 - ₹8,000': 6500,
          '₹8,000 - ₹15,000': 11500,
          '₹15,000+': 20000,
          'Minimal online shopping': 1000
        };
        
        setUserProfile(prev => ({ 
          ...prev, 
          spendingHabits: { ...prev.spendingHabits, online: onlineMap[userInput] || 0 } as any
        }));
        setCurrentStep('spending_utilities');
        
        return {
          content: `Perfect! Last spending category - how much do you spend on utility bills, mobile recharges, and other bill payments per month?`,
          options: ['₹1,000 - ₹2,000', '₹2,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000+']
        };

      case 'spending_utilities':
        const utilitiesMap: { [key: string]: number } = {
          '₹1,000 - ₹2,000': 1500,
          '₹2,000 - ₹3,000': 2500,
          '₹3,000 - ₹5,000': 4000,
          '₹5,000+': 6000
        };
        
        setUserProfile(prev => ({ 
          ...prev, 
          spendingHabits: { 
            ...prev.spendingHabits, 
            utilities: utilitiesMap[userInput] || 0,
            travel: 2000 // Default travel spending
          } as any
        }));
        setCurrentStep('benefits');
        
        return {
          content: `Excellent! Now I have a good understanding of your spending habits. What type of benefits matter most to you? (You can select multiple)`,
          options: [
            'Cashback on purchases',
            'Travel points/miles',
            'Airport lounge access',
            'Movie ticket discounts',
            'Fuel surcharge waivers',
            'Dining discounts',
            'No annual fee',
            'Continue to next question'
          ]
        };

      case 'benefits':
        if (userInput === 'Continue to next question') {
          setCurrentStep('credit_score');
          return {
            content: `Perfect! One last question - what's your approximate credit score range?`,
            options: [
              'Excellent (750+)',
              'Very Good (700-750)',
              'Good (650-700)',
              'Fair (600-650)',
              "I don't know"
            ]
          };
        } else {
          // Add benefit to preferences
          setUserProfile(prev => ({
            ...prev,
            preferredBenefits: [...(prev.preferredBenefits || []), userInput]
          }));
          
          return {
            content: `Great choice! Any other benefits you'd like? Or continue to the next question.`,
            options: [
              'Cashback on purchases',
              'Travel points/miles',
              'Airport lounge access',
              'Movie ticket discounts',
              'Fuel surcharge waivers',
              'Dining discounts',
              'No annual fee',
              'Continue to next question'
            ].filter(option => !userProfile.preferredBenefits?.includes(option))
          };
        }

      case 'credit_score':
        const scoreMap: { [key: string]: number } = {
          'Excellent (750+)': 780,
          'Very Good (700-750)': 725,
          'Good (650-700)': 675,
          'Fair (600-650)': 625,
          "I don't know": 700
        };
        
        const finalProfile = {
          ...userProfile,
          creditScore: scoreMap[userInput] || 700
        };
        
        setUserProfile(finalProfile);
        setCurrentStep('recommendations');
        
        // Generate recommendations
        setTimeout(() => {
          generateRecommendations(finalProfile);
        }, 2000);
        
        return {
          content: `Wonderful! I now have a complete picture of your financial profile and preferences.

Based on your income, spending habits, preferred benefits, and credit profile, I'm analyzing the best credit card matches for you from our database of 20+ Indian credit cards...

This will help you maximize your rewards and benefits!`
        };

      default:
        return { content: 'Thank you for that information!' };
    }
  };

  const generateRecommendations = async (profile: UserProfile) => {
    try {
      // Save user profile to database only if authenticated
      if (user) {
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            monthly_income: profile.monthlyIncome,
            spending_habits: profile.spendingHabits,
            preferred_benefits: profile.preferredBenefits,
            credit_score: profile.creditScore
          });
      }

      const recs = recommendationEngine.generateRecommendations(profile);
      setRecommendations(recs);
      setShowRecommendations(true);

      // Update session status only if authenticated
      if (sessionId && user) {
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

  const generateRecommendationsFromConversation = async (conversationMessages: Message[]) => {
    try {
      // Extract user profile from conversation
      const extractedProfile = recommendationEngine.extractUserProfileFromConversation(conversationMessages);
      
      // If profile is too sparse, use defaults
      if (!extractedProfile.monthlyIncome) {
        extractedProfile.monthlyIncome = 40000; // Default assumption
      }
      if (!extractedProfile.spendingHabits || Object.keys(extractedProfile.spendingHabits).length === 0) {
        extractedProfile.spendingHabits = {
          fuel: 3000,
          travel: 2000,
          groceries: 8000,
          dining: 4000,
          online: 5000,
          utilities: 2000
        };
      }
      if (!extractedProfile.preferredBenefits || extractedProfile.preferredBenefits.length === 0) {
        extractedProfile.preferredBenefits = ['Cashback', 'Fuel Benefits'];
      }
      if (!extractedProfile.creditScore) {
        extractedProfile.creditScore = 700; // Default assumption
      }

      // Save user profile to database only if authenticated
      if (user) {
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            monthly_income: extractedProfile.monthlyIncome,
            spending_habits: extractedProfile.spendingHabits,
            preferred_benefits: extractedProfile.preferredBenefits,
            credit_score: extractedProfile.creditScore
          });
      }

      const recs = recommendationEngine.generateRecommendations(extractedProfile);
      setRecommendations(recs);
      setShowRecommendations(true);

      // Update session status only if authenticated
      if (sessionId && user) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

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
      // Save user message to database only if authenticated
      if (sessionId && user) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'user',
            content: userMessage.content
          });
      }

      // For free text input, provide a helpful response
      const response = "I appreciate your message! For the best experience, please use the option buttons above to answer the questions. This helps me provide more accurate recommendations tailored to your needs.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database only if authenticated
      if (sessionId && user) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: response
          });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try using the option buttons to continue.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    try {
      // Mark current session as completed only if authenticated
      if (sessionId && user) {
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
      setCurrentStep('greeting');
      setUserProfile({});

      // Initialize new chat
      await initializeChat();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const handleCompareCard = (cardId: string) => {
    setSelectedCardsForComparison(prev => {
      if (prev.includes(cardId)) {
        // Remove card if already selected
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 3) {
        // Add card if less than 3 selected
        return [...prev, cardId];
      } else {
        // Replace oldest selection if 3 cards already selected
        return [...prev.slice(1), cardId];
      }
    });
  };

  const handleShowComparison = () => {
    if (selectedCardsForComparison.length >= 2) {
      const cardIds = selectedCardsForComparison.join(',');
      navigate(`/compare?cards=${cardIds}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guest Mode Notice */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-orange-800 font-medium">You're using Guest Mode</p>
                <p className="text-orange-700 text-sm">
                  You have full access to recommendations! Sign up to save your preferences and chat history for future visits.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
                        Guided Mode
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
                        
                        {message.options && message.options.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.options.map((option, index) => (
                              <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleOptionClick(option)}
                                className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                                disabled={isTyping}
                              >
                                {option}
                              </motion.button>
                            ))}
                          </div>
                        )}
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
                    placeholder="Type your message or use the buttons above..."
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
                  isSelected={selectedCardsForComparison.includes(recommendation.card.id)}
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
    </div>
  );
};
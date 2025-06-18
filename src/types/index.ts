export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  joiningFee: number;
  annualFee: number;
  rewardType: 'cashback' | 'points' | 'miles';
  rewardRate: number;
  eligibilityCriteria: {
    minIncome: number;
    minCreditScore: number;
  };
  specialPerks: string[];
  categories: SpendingCategory[];
  applyLink: string;
  features: string[];
  maxRewardCap?: number;
  welcomeBonus?: string;
}

export interface SpendingCategory {
  category: 'fuel' | 'travel' | 'groceries' | 'dining' | 'online' | 'utilities' | 'general';
  rate: number;
  description: string;
}

export interface UserProfile {
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
  primarySpendingCategory?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  options?: string[];
}

export interface CardRecommendation {
  card: CreditCard;
  score: number;
  reasons: string[];
  estimatedRewards: number;
  matchPercentage: number;
}

export type ConversationStep = 
  | 'greeting'
  | 'income'
  | 'spending_fuel'
  | 'spending_travel' 
  | 'spending_groceries'
  | 'spending_dining'
  | 'spending_online'
  | 'benefits'
  | 'existing_cards'
  | 'credit_score'
  | 'recommendations';
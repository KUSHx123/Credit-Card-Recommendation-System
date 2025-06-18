import { CreditCard, UserProfile, CardRecommendation } from '../types';
import { creditCardsData } from '../data/creditCards';

export class RecommendationEngine {
  private cards: CreditCard[];

  constructor() {
    this.cards = creditCardsData;
  }

  generateRecommendations(userProfile: UserProfile): CardRecommendation[] {
    const eligibleCards = this.filterEligibleCards(userProfile);
    const scoredCards = eligibleCards.map(card => this.scoreCard(card, userProfile));
    
    return scoredCards
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private filterEligibleCards(userProfile: UserProfile): CreditCard[] {
    return this.cards.filter(card => {
      // Income eligibility check
      if (userProfile.monthlyIncome && (userProfile.monthlyIncome * 12) < card.eligibilityCriteria.minIncome) {
        return false;
      }
      
      // Credit score eligibility check
      if (userProfile.creditScore && userProfile.creditScore < card.eligibilityCriteria.minCreditScore) {
        return false;
      }
      
      return true;
    });
  }

  private scoreCard(card: CreditCard, userProfile: UserProfile): CardRecommendation {
    let score = 0;
    const reasons: string[] = [];
    let estimatedRewards = 0;

    // Income compatibility score (20 points max)
    if (userProfile.monthlyIncome) {
      const annualIncome = userProfile.monthlyIncome * 12;
      if (annualIncome >= card.eligibilityCriteria.minIncome * 2) {
        score += 20;
        reasons.push('Excellent income compatibility - well above minimum requirement');
      } else if (annualIncome >= card.eligibilityCriteria.minIncome * 1.5) {
        score += 15;
        reasons.push('Very good income match for this card');
      } else if (annualIncome >= card.eligibilityCriteria.minIncome) {
        score += 10;
        reasons.push('Meets income requirements');
      }
    }

    // Spending category alignment (40 points max)
    if (userProfile.spendingHabits) {
      const totalSpending = Object.values(userProfile.spendingHabits).reduce((sum, amount) => sum + amount, 0);
      
      Object.entries(userProfile.spendingHabits).forEach(([category, amount]) => {
        const categoryBonus = card.categories.find(c => c.category === category);
        if (categoryBonus && amount > 0) {
          // Calculate score based on spending amount and reward rate
          const categoryWeight = amount / totalSpending;
          const categoryScore = categoryWeight * categoryBonus.rate * 5; // Max 5 points per category
          score += Math.min(categoryScore, 10); // Cap at 10 points per category
          
          // Calculate estimated annual rewards for this category
          const annualCategorySpend = amount * 12;
          const annualReward = this.calculateCategoryReward(card, category as any, annualCategorySpend);
          estimatedRewards += annualReward;
          
          if (categoryBonus.rate >= 10) {
            reasons.push(`Excellent ${category} rewards - ${categoryBonus.rate}X points/cashback`);
          } else if (categoryBonus.rate >= 5) {
            reasons.push(`Great ${category} rewards - ${categoryBonus.rate}X points/cashback`);
          } else if (categoryBonus.rate >= 3) {
            reasons.push(`Good ${category} rewards - ${categoryBonus.rate}X points/cashback`);
          }
        }
      });
    }

    // Benefits alignment (20 points max)
    if (userProfile.preferredBenefits) {
      userProfile.preferredBenefits.forEach(benefit => {
        const benefitLower = benefit.toLowerCase();
        const hasMatchingPerk = card.specialPerks.some(perk => 
          perk.toLowerCase().includes(benefitLower) ||
          (benefitLower.includes('cashback') && card.rewardType === 'cashback') ||
          (benefitLower.includes('travel') && (card.rewardType === 'points' || card.rewardType === 'miles')) ||
          (benefitLower.includes('lounge') && perk.toLowerCase().includes('lounge')) ||
          (benefitLower.includes('movie') && perk.toLowerCase().includes('movie')) ||
          (benefitLower.includes('fuel') && perk.toLowerCase().includes('fuel')) ||
          (benefitLower.includes('dining') && perk.toLowerCase().includes('dining'))
        );
        
        if (hasMatchingPerk) {
          score += 5;
          reasons.push(`Offers your preferred benefit: ${benefit}`);
        }
      });
    }

    // Fee structure consideration (10 points max)
    if (card.annualFee === 0) {
      score += 10;
      reasons.push('Lifetime free card - no annual fee');
    } else if (card.annualFee <= 500) {
      score += 8;
      reasons.push('Very low annual fee');
    } else if (card.annualFee <= 1000) {
      score += 6;
      reasons.push('Low annual fee');
    } else if (card.annualFee <= 2500) {
      score += 4;
      reasons.push('Moderate annual fee with premium benefits');
    } else {
      score += 2;
      reasons.push('Premium card with exclusive benefits');
    }

    // Credit score compatibility (10 points max)
    if (userProfile.creditScore) {
      if (userProfile.creditScore >= card.eligibilityCriteria.minCreditScore + 100) {
        score += 10;
        reasons.push('Excellent credit score match - high approval chances');
      } else if (userProfile.creditScore >= card.eligibilityCriteria.minCreditScore + 50) {
        score += 8;
        reasons.push('Very good credit score for this card');
      } else if (userProfile.creditScore >= card.eligibilityCriteria.minCreditScore) {
        score += 5;
        reasons.push('Meets credit score requirements');
      }
    }

    // Welcome bonus consideration
    if (card.welcomeBonus) {
      score += 3;
      reasons.push('Attractive welcome bonus offer');
    }

    // Calculate match percentage (cap at 95% to seem realistic)
    const matchPercentage = Math.min(Math.round((score / 100) * 100), 95);

    return {
      card,
      score,
      reasons: reasons.slice(0, 4), // Top 4 reasons
      estimatedRewards: Math.round(estimatedRewards),
      matchPercentage
    };
  }

  private calculateCategoryReward(card: CreditCard, category: string, annualSpend: number): number {
    const categoryBonus = card.categories.find(c => c.category === category);
    if (!categoryBonus) return 0;

    if (card.rewardType === 'cashback') {
      // For cashback cards, calculate direct cashback
      return (annualSpend * categoryBonus.rate) / 100;
    } else {
      // For points/miles cards, assume 1 point = ₹0.25 value
      const pointsEarned = (annualSpend * categoryBonus.rate) / 100;
      return pointsEarned * 0.25;
    }
  }

  // Method to extract user profile from conversation messages
  extractUserProfileFromConversation(messages: any[]): UserProfile {
    const profile: UserProfile = {
      spendingHabits: {}
    };

    // This is a simplified extraction - in a real implementation,
    // you'd use more sophisticated NLP or structured data collection
    const conversationText = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    // Extract income (look for numbers followed by income-related keywords)
    const incomeMatch = conversationText.match(/(\d+)\s*(?:thousand|k|lakh|lakhs|per month|monthly)/i);
    if (incomeMatch) {
      let income = parseInt(incomeMatch[1]);
      if (conversationText.includes('lakh')) {
        income *= 100000;
      } else if (conversationText.includes('thousand') || conversationText.includes('k')) {
        income *= 1000;
      }
      profile.monthlyIncome = income;
    }

    // Extract spending habits (simplified)
    if (conversationText.includes('fuel')) {
      profile.spendingHabits!.fuel = 3000; // Default estimate
    }
    if (conversationText.includes('travel')) {
      profile.spendingHabits!.travel = 5000;
    }
    if (conversationText.includes('groceries') || conversationText.includes('grocery')) {
      profile.spendingHabits!.groceries = 8000;
    }
    if (conversationText.includes('dining') || conversationText.includes('restaurant')) {
      profile.spendingHabits!.dining = 4000;
    }
    if (conversationText.includes('online shopping') || conversationText.includes('shopping')) {
      profile.spendingHabits!.online = 6000;
    }
    if (conversationText.includes('utilities') || conversationText.includes('bills')) {
      profile.spendingHabits!.utilities = 2000;
    }

    // Extract preferred benefits
    const benefits: string[] = [];
    if (conversationText.includes('cashback')) benefits.push('Cashback');
    if (conversationText.includes('travel points') || conversationText.includes('points')) benefits.push('Travel Points');
    if (conversationText.includes('lounge')) benefits.push('Airport Lounge Access');
    if (conversationText.includes('movie')) benefits.push('Movie Tickets');
    if (conversationText.includes('fuel')) benefits.push('Fuel Benefits');
    if (conversationText.includes('dining')) benefits.push('Dining Discounts');
    
    profile.preferredBenefits = benefits;

    // Extract credit score (simplified)
    if (conversationText.includes('excellent') || conversationText.includes('750')) {
      profile.creditScore = 750;
    } else if (conversationText.includes('good') || conversationText.includes('700')) {
      profile.creditScore = 700;
    } else if (conversationText.includes('fair') || conversationText.includes('650')) {
      profile.creditScore = 650;
    }

    return profile;
  }
}
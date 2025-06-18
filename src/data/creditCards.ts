import { CreditCard } from '../types';

export const creditCardsData: CreditCard[] = [
  {
    id: 'hdfc-regalia',
    name: 'HDFC Regalia Credit Card',
    issuer: 'HDFC Bank',
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 2500,
    annualFee: 2500,
    rewardType: 'points',
    rewardRate: 4,
    eligibilityCriteria: {
      minIncome: 300000,
      minCreditScore: 700
    },
    specialPerks: [
      'Airport lounge access - 8 visits per year',
      'Complimentary movie tickets - 2 per month',
      'Air accident insurance up to ₹1 crore',
      'Golf privileges at select courses'
    ],
    categories: [
      { category: 'dining', rate: 10, description: '10X points on dining' },
      { category: 'travel', rate: 6, description: '6X points on travel bookings' },
      { category: 'online', rate: 4, description: '4X points on online shopping' },
      { category: 'general', rate: 2, description: '2X points on other purchases' }
    ],
    features: [
      '8 complimentary airport lounge visits per year',
      '2 complimentary movie tickets per month',
      'Air accident insurance up to ₹1 crore'
    ],
    applyLink: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-credit-card',
    welcomeBonus: '5,000 bonus points on spending ₹30,000 in first 60 days'
  },
  {
    id: 'sbi-cashback',
    name: 'SBI Cashback Credit Card',
    issuer: 'State Bank of India',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 999,
    annualFee: 999,
    rewardType: 'cashback',
    rewardRate: 5,
    eligibilityCriteria: {
      minIncome: 200000,
      minCreditScore: 650
    },
    specialPerks: [
      'High cashback on online purchases - 5%',
      'No cashback cap or limit',
      'Instant cashback credit to statement',
      'Zero liability on lost card transactions'
    ],
    categories: [
      { category: 'online', rate: 5, description: '5% cashback on online shopping' },
      { category: 'general', rate: 1, description: '1% cashback on all other purchases' }
    ],
    features: [
      'No upper limit on cashback earnings',
      'Cashback credited monthly to statement',
      'Zero liability on lost card transactions'
    ],
    applyLink: 'https://www.sbi.co.in/web/personal-banking/cards/credit-cards/cashback-credit-card',
    welcomeBonus: '₹2,000 cashback on spending ₹20,000 in first 60 days'
  },
  {
    id: 'axis-magnus',
    name: 'Axis Bank Magnus Credit Card',
    issuer: 'Axis Bank',
    image: 'https://images.pexels.com/photos/1332191/pexels-photo-1332191.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 12500,
    annualFee: 12500,
    rewardType: 'points',
    rewardRate: 12,
    eligibilityCriteria: {
      minIncome: 1500000,
      minCreditScore: 750
    },
    specialPerks: [
      'Premium airport lounge access - Unlimited domestic',
      'Golf privileges at 250+ courses worldwide',
      'Concierge services 24/7',
      'Travel insurance up to ₹50 lakhs'
    ],
    categories: [
      { category: 'travel', rate: 25, description: '25X points on travel bookings' },
      { category: 'dining', rate: 25, description: '25X points on dining' },
      { category: 'online', rate: 12, description: '12X points on online shopping' },
      { category: 'general', rate: 6, description: '6X points on other purchases' }
    ],
    features: [
      'Unlimited domestic airport lounge access',
      '12 international lounge visits per year',
      'Travel insurance up to ₹50 lakhs'
    ],
    applyLink: 'https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card',
    welcomeBonus: '25,000 bonus points on spending ₹1,50,000 in first 60 days'
  },
  {
    id: 'icici-amazon-pay',
    name: 'ICICI Amazon Pay Credit Card',
    issuer: 'ICICI Bank',
    image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 0,
    annualFee: 0,
    rewardType: 'cashback',
    rewardRate: 5,
    eligibilityCriteria: {
      minIncome: 300000,
      minCreditScore: 650
    },
    specialPerks: [
      'High cashback on Amazon purchases - 5%',
      'Amazon Prime membership worth ₹1,499',
      'No annual fee - Lifetime free',
      'Instant account activation'
    ],
    categories: [
      { category: 'online', rate: 5, description: '5% cashback on Amazon purchases' },
      { category: 'utilities', rate: 2, description: '2% cashback on bill payments' },
      { category: 'general', rate: 1, description: '1% cashback on other purchases' }
    ],
    features: [
      'Amazon Prime membership worth ₹1,499',
      'No joining or annual fee',
      'Instant account activation'
    ],
    applyLink: 'https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card',
    welcomeBonus: '₹3,000 Amazon gift voucher on first purchase'
  },
  {
    id: 'kotak-league-platinum',
    name: 'Kotak League Platinum Credit Card',
    issuer: 'Kotak Mahindra Bank',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 0,
    annualFee: 0,
    rewardType: 'points',
    rewardRate: 4,
    eligibilityCriteria: {
      minIncome: 250000,
      minCreditScore: 650
    },
    specialPerks: [
      'Lifetime free card with no conditions',
      'Movie ticket discounts - Book at ₹99',
      'Dining offers at partner restaurants',
      '1% fuel surcharge waiver'
    ],
    categories: [
      { category: 'fuel', rate: 4, description: '4X points on fuel purchases' },
      { category: 'groceries', rate: 4, description: '4X points on grocery shopping' },
      { category: 'general', rate: 2, description: '2X points on other purchases' }
    ],
    features: [
      'Lifetime free with no conditions',
      '1% fuel surcharge waiver',
      'Book movie tickets at ₹99'
    ],
    applyLink: 'https://www.kotak.com/en/personal-banking/cards/credit-cards/league-platinum-credit-card.html',
    welcomeBonus: '1,000 bonus points on first transaction'
  },
  {
    id: 'indusind-pinnacle',
    name: 'IndusInd Bank Pinnacle Credit Card',
    issuer: 'IndusInd Bank',
    image: 'https://images.pexels.com/photos/4386285/pexels-photo-4386285.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 3000,
    annualFee: 3000,
    rewardType: 'points',
    rewardRate: 6,
    eligibilityCriteria: {
      minIncome: 600000,
      minCreditScore: 700
    },
    specialPerks: [
      'Airport lounge access - 6 visits per year',
      'Golf privileges - 2 games per month',
      'Spa vouchers worth ₹1,000 monthly',
      'Movie benefits and dining discounts'
    ],
    categories: [
      { category: 'travel', rate: 10, description: '10X points on travel' },
      { category: 'dining', rate: 8, description: '8X points on dining' },
      { category: 'fuel', rate: 6, description: '6X points on fuel' },
      { category: 'general', rate: 3, description: '3X points on other purchases' }
    ],
    features: [
      '6 complimentary airport lounge visits',
      '2 complimentary golf games per month',
      'Monthly spa vouchers worth ₹1,000'
    ],
    applyLink: 'https://www.indusind.com/in/en/personal/cards/credit-card/pinnacle-credit-card.html',
    welcomeBonus: '10,000 bonus points on spending ₹50,000 in first 90 days'
  },
  {
    id: 'yes-first-exclusive',
    name: 'YES FIRST Exclusive Credit Card',
    issuer: 'YES Bank',
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 2999,
    annualFee: 2999,
    rewardType: 'points',
    rewardRate: 6,
    eligibilityCriteria: {
      minIncome: 500000,
      minCreditScore: 700
    },
    specialPerks: [
      'Airport lounge access - 4 visits per year',
      'Dining privileges at partner restaurants',
      'Movie ticket discounts',
      'Fuel surcharge waiver'
    ],
    categories: [
      { category: 'dining', rate: 10, description: '10X points on dining' },
      { category: 'fuel', rate: 6, description: '6X points on fuel' },
      { category: 'groceries', rate: 5, description: '5X points on groceries' },
      { category: 'general', rate: 2, description: '2X points on other purchases' }
    ],
    features: [
      '4 complimentary airport lounge visits',
      'Dining privileges at 4000+ restaurants',
      'Movie ticket discounts'
    ],
    applyLink: 'https://www.yesbank.in/personal-banking/yes-individual/cards/credit-cards/yes-first-exclusive',
    welcomeBonus: '5,000 bonus points on spending ₹25,000 in first 60 days'
  },
  {
    id: 'standard-chartered-manhattan',
    name: 'Standard Chartered Manhattan Credit Card',
    issuer: 'Standard Chartered Bank',
    image: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 1999,
    annualFee: 1999,
    rewardType: 'cashback',
    rewardRate: 5,
    eligibilityCriteria: {
      minIncome: 400000,
      minCreditScore: 680
    },
    specialPerks: [
      'High cashback on weekend dining - 5%',
      'Movie ticket offers',
      'Fuel surcharge waiver',
      'Emergency card replacement'
    ],
    categories: [
      { category: 'dining', rate: 5, description: '5% cashback on weekend dining' },
      { category: 'fuel', rate: 2.5, description: '2.5% cashback on fuel' },
      { category: 'general', rate: 1, description: '1% cashback on other purchases' }
    ],
    features: [
      '5% cashback on weekend dining',
      'Movie ticket offers',
      'Emergency card replacement worldwide'
    ],
    applyLink: 'https://www.sc.com/in/credit-cards/manhattan-credit-card/',
    welcomeBonus: '₹1,500 cashback on spending ₹15,000 in first 45 days'
  },
  {
    id: 'citi-rewards',
    name: 'Citi Rewards Credit Card',
    issuer: 'Citibank',
    image: 'https://images.pexels.com/photos/4386285/pexels-photo-4386285.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 1000,
    annualFee: 1000,
    rewardType: 'points',
    rewardRate: 4,
    eligibilityCriteria: {
      minIncome: 350000,
      minCreditScore: 680
    },
    specialPerks: [
      'Flexible reward redemption options',
      'No expiry on reward points',
      'Fuel surcharge waiver',
      'Lost card liability protection'
    ],
    categories: [
      { category: 'utilities', rate: 10, description: '10X points on utility bills' },
      { category: 'groceries', rate: 5, description: '5X points on groceries' },
      { category: 'fuel', rate: 4, description: '4X points on fuel' },
      { category: 'general', rate: 2, description: '2X points on other purchases' }
    ],
    features: [
      'No expiry on reward points',
      'Flexible redemption options',
      'Lost card liability protection'
    ],
    applyLink: 'https://www.online.citibank.co.in/products-services/credit-cards/citi-rewards-credit-card',
    welcomeBonus: '2,500 bonus points on spending ₹20,000 in first 60 days'
  },
  {
    id: 'rbl-world-safari',
    name: 'RBL Bank World Safari Credit Card',
    issuer: 'RBL Bank',
    image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 3000,
    annualFee: 3000,
    rewardType: 'points',
    rewardRate: 8,
    eligibilityCriteria: {
      minIncome: 800000,
      minCreditScore: 720
    },
    specialPerks: [
      'Airport lounge access - 6 visits per year',
      'Travel insurance coverage',
      'Golf privileges',
      'Concierge services'
    ],
    categories: [
      { category: 'travel', rate: 15, description: '15X points on travel' },
      { category: 'dining', rate: 10, description: '10X points on dining' },
      { category: 'fuel', rate: 8, description: '8X points on fuel' },
      { category: 'general', rate: 4, description: '4X points on other purchases' }
    ],
    features: [
      '6 complimentary airport lounge visits',
      'Travel insurance up to ₹25 lakhs',
      'Golf privileges at select courses'
    ],
    applyLink: 'https://www.rblbank.com/cards/credit-cards/world-safari-credit-card',
    welcomeBonus: '8,000 bonus points on spending ₹40,000 in first 90 days'
  },
  {
    id: 'bob-premier',
    name: 'Bank of Baroda Premier Credit Card',
    issuer: 'Bank of Baroda',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 500,
    annualFee: 500,
    rewardType: 'points',
    rewardRate: 3,
    eligibilityCriteria: {
      minIncome: 300000,
      minCreditScore: 650
    },
    specialPerks: [
      'Low annual fee',
      'Fuel surcharge waiver',
      'Insurance coverage',
      'EMI conversion facility'
    ],
    categories: [
      { category: 'fuel', rate: 5, description: '5X points on fuel' },
      { category: 'groceries', rate: 3, description: '3X points on groceries' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Low annual fee of ₹500',
      'Fuel surcharge waiver up to ₹500',
      'Personal accident insurance'
    ],
    applyLink: 'https://www.bankofbaroda.in/personal-banking/cards/credit-cards/premier-credit-card',
    welcomeBonus: '1,000 bonus points on first transaction'
  },
  {
    id: 'pnb-rupay-platinum',
    name: 'PNB RuPay Platinum Credit Card',
    issuer: 'Punjab National Bank',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 0,
    annualFee: 499,
    rewardType: 'cashback',
    rewardRate: 2,
    eligibilityCriteria: {
      minIncome: 200000,
      minCreditScore: 600
    },
    specialPerks: [
      'Low annual fee',
      'RuPay benefits',
      'Fuel surcharge waiver',
      'Easy eligibility criteria'
    ],
    categories: [
      { category: 'fuel', rate: 2, description: '2% cashback on fuel' },
      { category: 'utilities', rate: 1.5, description: '1.5% cashback on utilities' },
      { category: 'general', rate: 0.5, description: '0.5% cashback on other purchases' }
    ],
    features: [
      'Low annual fee of ₹499',
      'RuPay network benefits',
      'Easy approval process'
    ],
    applyLink: 'https://www.pnbindia.in/credit-card-rupay-platinum.html',
    welcomeBonus: '₹500 cashback on spending ₹10,000 in first 30 days'
  },
  {
    id: 'union-bank-platinum',
    name: 'Union Bank Platinum Credit Card',
    issuer: 'Union Bank of India',
    image: 'https://images.pexels.com/photos/1332191/pexels-photo-1332191.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 750,
    annualFee: 750,
    rewardType: 'points',
    rewardRate: 2,
    eligibilityCriteria: {
      minIncome: 250000,
      minCreditScore: 650
    },
    specialPerks: [
      'Affordable annual fee',
      'Fuel surcharge waiver',
      'Insurance benefits',
      'EMI facility'
    ],
    categories: [
      { category: 'fuel', rate: 4, description: '4X points on fuel' },
      { category: 'groceries', rate: 2, description: '2X points on groceries' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Affordable annual fee',
      'Fuel surcharge waiver',
      'Personal accident insurance'
    ],
    applyLink: 'https://www.unionbankofindia.co.in/english/credit-card-platinum.aspx',
    welcomeBonus: '750 bonus points on first transaction'
  },
  {
    id: 'canara-platinum',
    name: 'Canara Bank Platinum Credit Card',
    issuer: 'Canara Bank',
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 500,
    annualFee: 500,
    rewardType: 'points',
    rewardRate: 2,
    eligibilityCriteria: {
      minIncome: 200000,
      minCreditScore: 600
    },
    specialPerks: [
      'Low fees',
      'Easy approval',
      'Fuel benefits',
      'Insurance coverage'
    ],
    categories: [
      { category: 'fuel', rate: 3, description: '3X points on fuel' },
      { category: 'utilities', rate: 2, description: '2X points on utilities' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Low joining and annual fee',
      'Easy approval process',
      'Fuel surcharge waiver'
    ],
    applyLink: 'https://canarabank.com/credit-cards/platinum-credit-card',
    welcomeBonus: '500 bonus points on first purchase'
  },
  {
    id: 'idfc-first-millennia',
    name: 'IDFC FIRST Millennia Credit Card',
    issuer: 'IDFC FIRST Bank',
    image: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 0,
    annualFee: 0,
    rewardType: 'cashback',
    rewardRate: 10,
    eligibilityCriteria: {
      minIncome: 250000,
      minCreditScore: 650
    },
    specialPerks: [
      'Lifetime free card',
      'High cashback on online shopping',
      'No cashback cap',
      'Instant digital card'
    ],
    categories: [
      { category: 'online', rate: 10, description: '10% cashback on online shopping (up to ₹1,500/month)' },
      { category: 'utilities', rate: 5, description: '5% cashback on utility bills' },
      { category: 'general', rate: 1, description: '1% cashback on other purchases' }
    ],
    features: [
      'Lifetime free with no conditions',
      '10% cashback on online shopping',
      'Instant digital card issuance'
    ],
    applyLink: 'https://www.idfcfirstbank.com/credit-card/millennia-credit-card',
    welcomeBonus: '₹1,000 cashback on spending ₹10,000 in first 30 days'
  },
  {
    id: 'au-zenith',
    name: 'AU Bank Zenith Credit Card',
    issuer: 'AU Small Finance Bank',
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 1999,
    annualFee: 1999,
    rewardType: 'points',
    rewardRate: 5,
    eligibilityCriteria: {
      minIncome: 400000,
      minCreditScore: 700
    },
    specialPerks: [
      'Airport lounge access',
      'Movie ticket discounts',
      'Dining privileges',
      'Fuel surcharge waiver'
    ],
    categories: [
      { category: 'dining', rate: 8, description: '8X points on dining' },
      { category: 'fuel', rate: 5, description: '5X points on fuel' },
      { category: 'groceries', rate: 4, description: '4X points on groceries' },
      { category: 'general', rate: 2, description: '2X points on other purchases' }
    ],
    features: [
      '2 complimentary airport lounge visits',
      'Movie ticket discounts',
      'Dining privileges at partner restaurants'
    ],
    applyLink: 'https://www.aubank.in/credit-card/zenith-credit-card',
    welcomeBonus: '3,000 bonus points on spending ₹25,000 in first 60 days'
  },
  {
    id: 'federal-signet',
    name: 'Federal Bank Signet Credit Card',
    issuer: 'Federal Bank',
    image: 'https://images.pexels.com/photos/4386285/pexels-photo-4386285.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 999,
    annualFee: 999,
    rewardType: 'points',
    rewardRate: 3,
    eligibilityCriteria: {
      minIncome: 300000,
      minCreditScore: 650
    },
    specialPerks: [
      'Reward points on all purchases',
      'Fuel surcharge waiver',
      'Insurance benefits',
      'Easy redemption options'
    ],
    categories: [
      { category: 'fuel', rate: 5, description: '5X points on fuel' },
      { category: 'dining', rate: 3, description: '3X points on dining' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Reward points on all purchases',
      'Fuel surcharge waiver',
      'Personal accident insurance'
    ],
    applyLink: 'https://www.federalbank.co.in/credit-cards/signet-credit-card',
    welcomeBonus: '1,500 bonus points on spending ₹15,000 in first 45 days'
  },
  {
    id: 'karur-vysya-platinum',
    name: 'Karur Vysya Bank Platinum Credit Card',
    issuer: 'Karur Vysya Bank',
    image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 750,
    annualFee: 750,
    rewardType: 'cashback',
    rewardRate: 2,
    eligibilityCriteria: {
      minIncome: 250000,
      minCreditScore: 650
    },
    specialPerks: [
      'Cashback on all purchases',
      'Fuel surcharge waiver',
      'Low annual fee',
      'Easy approval process'
    ],
    categories: [
      { category: 'fuel', rate: 3, description: '3% cashback on fuel' },
      { category: 'groceries', rate: 2, description: '2% cashback on groceries' },
      { category: 'general', rate: 1, description: '1% cashback on other purchases' }
    ],
    features: [
      'Cashback on all purchases',
      'Low annual fee',
      'Fuel surcharge waiver'
    ],
    applyLink: 'https://www.kvb.co.in/credit-cards/platinum-credit-card',
    welcomeBonus: '₹750 cashback on spending ₹12,000 in first 45 days'
  },
  {
    id: 'south-indian-platinum',
    name: 'South Indian Bank Platinum Credit Card',
    issuer: 'South Indian Bank',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 500,
    annualFee: 500,
    rewardType: 'points',
    rewardRate: 2,
    eligibilityCriteria: {
      minIncome: 200000,
      minCreditScore: 600
    },
    specialPerks: [
      'Low annual fee',
      'Reward points program',
      'Fuel benefits',
      'Insurance coverage'
    ],
    categories: [
      { category: 'fuel', rate: 4, description: '4X points on fuel' },
      { category: 'utilities', rate: 2, description: '2X points on utilities' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Low annual fee of ₹500',
      'Reward points on all purchases',
      'Fuel surcharge waiver'
    ],
    applyLink: 'https://www.southindianbank.com/credit-cards/platinum-credit-card',
    welcomeBonus: '500 bonus points on first transaction'
  },
  {
    id: 'tamilnad-mercantile-gold',
    name: 'Tamilnad Mercantile Bank Gold Credit Card',
    issuer: 'Tamilnad Mercantile Bank',
    image: 'https://images.pexels.com/photos/1332191/pexels-photo-1332191.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 250,
    annualFee: 250,
    rewardType: 'points',
    rewardRate: 1,
    eligibilityCriteria: {
      minIncome: 150000,
      minCreditScore: 600
    },
    specialPerks: [
      'Very low annual fee',
      'Easy eligibility',
      'Basic reward program',
      'Fuel benefits'
    ],
    categories: [
      { category: 'fuel', rate: 2, description: '2X points on fuel' },
      { category: 'general', rate: 1, description: '1X points on other purchases' }
    ],
    features: [
      'Very low annual fee',
      'Easy approval process',
      'Basic reward program'
    ],
    applyLink: 'https://www.tmb.in/credit-cards/gold-credit-card',
    welcomeBonus: '250 bonus points on first purchase'
  },
  {
    id: 'dhanlaxmi-platinum',
    name: 'Dhanlaxmi Bank Platinum Credit Card',
    issuer: 'Dhanlaxmi Bank',
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=300',
    joiningFee: 600,
    annualFee: 600,
    rewardType: 'cashback',
    rewardRate: 1.5,
    eligibilityCriteria: {
      minIncome: 200000,
      minCreditScore: 650
    },
    specialPerks: [
      'Cashback rewards',
      'Fuel surcharge waiver',
      'Low annual fee',
      'Regional bank benefits'
    ],
    categories: [
      { category: 'fuel', rate: 2.5, description: '2.5% cashback on fuel' },
      { category: 'groceries', rate: 1.5, description: '1.5% cashback on groceries' },
      { category: 'general', rate: 0.5, description: '0.5% cashback on other purchases' }
    ],
    features: [
      'Cashback on all purchases',
      'Low annual fee',
      'Fuel surcharge waiver'
    ],
    applyLink: 'https://www.dhanbank.com/credit-cards/platinum-credit-card',
    welcomeBonus: '₹600 cashback on spending ₹10,000 in first 30 days'
  }
];
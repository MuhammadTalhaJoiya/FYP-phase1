// Pricing configuration for the AI Recruitment Platform
// Optimized for Pakistani market with affordable testing prices

export const CURRENCY = {
  PKR: {
    symbol: 'Rs.',
    code: 'PKR',
    position: 'before', // Rs. 299
  },
  USD: {
    symbol: '$',
    code: 'USD',
    position: 'before', // $9.99
  }
};

// Default currency (can be changed based on user location)
export const DEFAULT_CURRENCY = 'PKR';

// Candidate Pricing (Freemium Model)
export const CANDIDATE_PRICING = {
  FREE: {
    name: 'Free',
    price: {
      PKR: 0,
      USD: 0,
    },
    period: 'forever',
    features: [
      'UNLIMITED job applications',
      '5 AI CV analyses per month',
      'Browse all jobs',
      'Email notifications',
      'Basic profile',
      'Application tracking',
    ],
    limitations: [
      'Limited AI analysis',
      'Standard visibility',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: {
      PKR: 299, // ~$1 USD - Very affordable for testing
      USD: 9.99,
    },
    period: 'month',
    yearlyPrice: {
      PKR: 2999, // Save Rs. 589 (20% off)
      USD: 79,
    },
    features: [
      'Everything in Free',
      'UNLIMITED AI CV analyses',
      'Priority visibility to recruiters',
      'Advanced match insights',
      'Interview preparation AI coach',
      'Resume builder & templates',
      'Direct messaging with recruiters',
      'Skill gap analysis & learning paths',
      'Detailed analytics',
      'Ad-free experience',
    ],
    popular: true,
  },
};

// Recruiter Pricing (Paid Tiers)
export const RECRUITER_PRICING = {
  PAY_PER_POST: {
    name: 'Pay Per Post',
    price: {
      PKR: 499, // ~$1.75 - Great for testing
      USD: 79,
    },
    period: 'post',
    duration: '30 days',
    features: [
      'Single job posting (30 days)',
      'Up to 100 candidate views',
      'Basic AI matching',
      '10 AI interview screenings',
      'Email support',
      'Basic analytics',
    ],
    bestFor: 'Occasional hiring',
  },
  STARTER: {
    name: 'Starter',
    price: {
      PKR: 999, // ~$3.50 - Very affordable for testing
      USD: 49,
    },
    period: 'month',
    features: [
      '5 active job postings',
      'Up to 50 candidate contacts/month',
      'Basic AI matching',
      '20 AI interview screenings/month',
      'Email support (48h response)',
      'Basic analytics dashboard',
      'Single user account',
    ],
    bestFor: 'Small businesses & Startups',
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: {
      PKR: 2999, // ~$10 - Still very affordable
      USD: 149,
    },
    period: 'month',
    features: [
      'UNLIMITED job postings',
      'UNLIMITED candidate views',
      'Advanced AI matching with insights',
      '50 AI interview screenings/month',
      'Candidate ranking & scoring',
      'Priority support (24h response)',
      'Advanced analytics & reporting',
      'Team collaboration (3 users)',
      'ATS integration ready',
      'Custom company branding',
    ],
    popular: true,
    bestFor: 'Growing companies & Agencies',
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: {
      PKR: 9999, // ~$35 - Still reasonable for enterprise
      USD: 499,
    },
    period: 'month',
    features: [
      'Everything in Professional',
      'UNLIMITED AI interviews',
      'Dedicated account manager',
      'Custom branding & white-label',
      'API access',
      'Advanced security features',
      'Unlimited team members',
      'Custom integrations',
      'Priority phone support',
      'Onboarding & training',
      'Custom SLA agreement',
    ],
    bestFor: 'Large enterprises & Corporations',
    contactSales: true,
  },
};

// Helper function to format price
export const formatPrice = (amount, currency = DEFAULT_CURRENCY) => {
  const currencyConfig = CURRENCY[currency];
  const formattedAmount = amount === 0 ? 'Free' : amount.toLocaleString();
  
  if (amount === 0) return 'Free';
  
  return currencyConfig.position === 'before'
    ? `${currencyConfig.symbol} ${formattedAmount}`
    : `${formattedAmount} ${currencyConfig.symbol}`;
};

// Helper to get subscription benefits
export const getSubscriptionBenefits = (tier, userType) => {
  if (userType === 'candidate') {
    return CANDIDATE_PRICING[tier];
  } else if (userType === 'recruiter') {
    return RECRUITER_PRICING[tier];
  }
  return null;
};

// Calculate yearly savings
export const calculateYearlySavings = (monthlyPrice, yearlyPrice) => {
  return (monthlyPrice * 12) - yearlyPrice;
};

// Trial periods
export const TRIAL_PERIODS = {
  CANDIDATE_PREMIUM: 7, // 7 days free trial
  RECRUITER_PROFESSIONAL: 14, // 14 days free trial
  RECRUITER_ENTERPRISE: 30, // 30 days free trial
};

// Discount codes (for testing)
export const DISCOUNT_CODES = {
  'LAUNCH50': {
    type: 'percentage',
    value: 50,
    description: '50% off first 3 months',
    validFor: ['CANDIDATE_PREMIUM', 'RECRUITER_STARTER', 'RECRUITER_PROFESSIONAL'],
  },
  'FIRSTHIRE': {
    type: 'fixed',
    value: { PKR: 500, USD: 20 },
    description: 'Rs. 500 off your first subscription',
    validFor: ['RECRUITER_STARTER', 'RECRUITER_PROFESSIONAL'],
  },
};


# 💰 Pricing Implementation Guide

## Overview
This document explains the new pricing model implemented for the AI Recruitment Platform, optimized for the Pakistani market with affordable testing prices.

---

## 🎯 **Pricing Strategy**

### **Philosophy**
- **Candidates**: Freemium model (Free + Optional Premium)
- **Recruiters**: Paid tiers (Primary revenue source)
- **Currency**: PKR (Pakistani Rupees) for testing, USD supported

---

## 💵 **Pricing Plans**

### **For Candidates**

#### **FREE Plan (Always Free)** ✅
```
Price: Rs. 0 (Free Forever)

Features:
✓ UNLIMITED job applications
✓ 5 AI CV analyses per month
✓ Browse all jobs
✓ Email notifications
✓ Basic profile
✓ Application tracking

Limitations:
✗ Limited AI analysis (5/month)
✗ Standard visibility to recruiters
```

#### **PREMIUM Plan** ⭐
```
Monthly: Rs. 299/month (~$1 USD)
Yearly:  Rs. 2,999/year (Save Rs. 589 - 20% off)

Features:
✓ Everything in Free
✓ UNLIMITED AI CV analyses
✓ Priority visibility to recruiters
✓ Advanced match insights
✓ Interview preparation AI coach
✓ Resume builder & templates
✓ Direct messaging with recruiters
✓ Skill gap analysis & learning paths
✓ Detailed analytics
✓ Ad-free experience

Target: Serious job seekers, career switchers
Conversion Target: 3-5% of free users
```

---

### **For Recruiters**

#### **Pay Per Post**
```
Price: Rs. 499/post (~$1.75 USD)
Duration: 30 days

Features:
✓ Single job posting (30 days)
✓ Up to 100 candidate views
✓ Basic AI matching
✓ 10 AI interview screenings
✓ Email support
✓ Basic analytics

Best For: Occasional hiring, testing the platform
```

#### **STARTER Plan**
```
Price: Rs. 999/month (~$3.50 USD)

Features:
✓ 5 active job postings
✓ Up to 50 candidate contacts/month
✓ Basic AI matching
✓ 20 AI interview screenings/month
✓ Email support (48h response)
✓ Basic analytics dashboard
✓ Single user account

Best For: Small businesses, startups
```

#### **PROFESSIONAL Plan** ⭐ MOST POPULAR
```
Price: Rs. 2,999/month (~$10 USD)

Features:
✓ UNLIMITED job postings
✓ UNLIMITED candidate views
✓ Advanced AI matching with insights
✓ 50 AI interview screenings/month
✓ Candidate ranking & scoring
✓ Priority support (24h response)
✓ Advanced analytics & reporting
✓ Team collaboration (3 users)
✓ ATS integration ready
✓ Custom company branding

Best For: Growing companies, recruitment agencies
Target: 60-70% of paid customers
```

#### **ENTERPRISE Plan** 🚀
```
Price: Rs. 9,999/month (~$35 USD)

Features:
✓ Everything in Professional
✓ UNLIMITED AI interviews
✓ Dedicated account manager
✓ Custom branding & white-label
✓ API access
✓ Advanced security features
✓ Unlimited team members
✓ Custom integrations
✓ Priority phone support
✓ Onboarding & training
✓ Custom SLA agreement

Best For: Large enterprises, corporations
```

---

## 📊 **Revenue Projections**

### **Test Phase (First 3 Months)**
```
Candidates:
- 1,000 free users
- 30 premium users (3% conversion) × Rs. 299
  = Rs. 8,970/month

Recruiters:
- 10 Starter × Rs. 999 = Rs. 9,990
- 20 Professional × Rs. 2,999 = Rs. 59,980
- 2 Enterprise × Rs. 9,999 = Rs. 19,998

Total Monthly: Rs. 98,938 (~$350 USD)
Total Annually: Rs. 11,87,256 (~$4,200 USD)
```

### **Growth Phase (6-12 Months)**
```
Candidates:
- 10,000 free users
- 400 premium users (4% conversion) × Rs. 299
  = Rs. 1,19,600/month

Recruiters:
- 30 Starter × Rs. 999 = Rs. 29,970
- 80 Professional × Rs. 2,999 = Rs. 2,39,920
- 10 Enterprise × Rs. 9,999 = Rs. 99,990

Total Monthly: Rs. 4,89,480 (~$1,750 USD)
Total Annually: Rs. 58,73,760 (~$21,000 USD)
```

---

## 🛠️ **Technical Implementation**

### **Files Created/Modified**

1. **`src/lib/pricing.js`** - Central pricing configuration
   ```javascript
   - CANDIDATE_PRICING
   - RECRUITER_PRICING
   - formatPrice()
   - CURRENCY support (PKR/USD)
   - TRIAL_PERIODS
   - DISCOUNT_CODES
   ```

2. **`src/pages/CVUpload.jsx`** - Updated candidate pricing
   ```javascript
   - 5 free analyses (down from 10)
   - Premium modal with PKR pricing
   - Generous free tier (unlimited applications)
   - Progress tracking
   ```

3. **`src/pages/RecruiterDashboard.jsx`** - New tiered pricing
   ```javascript
   - 4 plan options
   - Visual plan comparison
   - Selected plan summary
   - Subscription management
   ```

4. **`src/stores/authStore.js`** - Updated state management
   ```javascript
   - subscriptionPlan tracking
   - analysesLeft: 5 (free tier)
   - setSubscriptionPlan()
   - Version 2 migration
   ```

---

## 💳 **Payment Integration (Future)**

### **For Pakistani Market:**

1. **JazzCash** (Recommended)
   - Most popular in Pakistan
   - Mobile wallet integration
   - Easy setup for merchants

2. **EasyPaisa**
   - Second most popular
   - Good for small businesses

3. **Stripe** (International)
   - For USD payments
   - Credit/debit cards
   - Global standard

4. **Bank Transfer**
   - For enterprise clients
   - Manual verification

### **Implementation Steps:**
```javascript
// 1. Install payment SDK
npm install jazzcash-sdk

// 2. Create payment handler
const handlePayment = async (planId, amount) => {
  const payment = await JazzCash.createPayment({
    amount: amount,
    currency: 'PKR',
    description: `Subscription: ${planId}`,
    callback_url: '/payment/success'
  });
  window.location.href = payment.payment_url;
};

// 3. Verify payment
const verifyPayment = async (transactionId) => {
  const status = await JazzCash.verifyPayment(transactionId);
  if (status.success) {
    // Activate subscription
    upgradeAccount(selectedPlan);
  }
};
```

---

## 📈 **Growth Strategy**

### **Phase 1: Launch (Month 1-3)**
```
Goal: Get first 100 recruiters

Strategy:
✓ Offer 50% discount (LAUNCH50 code)
✓ 14-day free trial for Professional
✓ Focus on small businesses
✓ Free for candidates (build supply)

Target:
- 1,000 candidates
- 100 recruiters
- Rs. 100,000/month revenue
```

### **Phase 2: Scale (Month 4-12)**
```
Goal: Reach profitability

Strategy:
✓ Referral program (Rs. 500 credit)
✓ Annual plans (20% discount)
✓ Corporate partnerships
✓ University partnerships (candidate supply)

Target:
- 10,000 candidates
- 500 recruiters
- Rs. 500,000/month revenue
```

### **Phase 3: Expand (Year 2+)**
```
Goal: Market leadership

Strategy:
✓ Add-on features (featured posts, urgent hiring)
✓ White-label for agencies
✓ API marketplace
✓ International expansion

Target:
- 100,000+ candidates
- 2,000+ recruiters
- Rs. 2,000,000/month revenue
```

---

## 🎯 **Key Metrics to Track**

### **For Candidates:**
- **Sign-up Rate**: Target 100/day
- **Active Users**: MAU > 60%
- **Premium Conversion**: 3-5%
- **Churn Rate**: < 10%/month
- **Time to Application**: < 5 minutes

### **For Recruiters:**
- **Sign-up Rate**: Target 5/day
- **Plan Distribution**: 
  - Starter: 20%
  - Professional: 60% ⭐
  - Enterprise: 20%
- **Churn Rate**: < 5%/month
- **Upgrade Rate**: 15% Starter → Pro
- **LTV/CAC**: > 3:1

### **Business Metrics:**
- **MRR (Monthly Recurring Revenue)**
- **ARR (Annual Recurring Revenue)**
- **CAC (Customer Acquisition Cost)**
- **LTV (Lifetime Value)**
- **Burn Rate**
- **Runway**

---

## 💡 **Pro Tips for Testing**

### **1. Use Small Amounts**
```
Testing prices in PKR:
- Don't use real payment gateway initially
- Use mock payments (localStorage)
- Test with Rs. 10, Rs. 50, Rs. 100
- Friends & family feedback
```

### **2. A/B Testing**
```
Test different price points:
Group A: Rs. 299/month
Group B: Rs. 499/month
Group C: Rs. 199/month

Measure: Conversion rate, revenue per user
```

### **3. Discount Codes**
```javascript
// Already implemented in pricing.js
'LAUNCH50': 50% off first 3 months
'FIRSTHIRE': Rs. 500 off first subscription
```

### **4. Free Trial Periods**
```javascript
// Already configured
Candidate Premium: 7 days
Recruiter Professional: 14 days
Recruiter Enterprise: 30 days
```

---

## 🔒 **Security Considerations**

1. **Never store payment info** - Use payment gateway
2. **Validate subscriptions server-side** - Don't trust client
3. **Use HTTPS** - Required for payment pages
4. **Webhook verification** - Verify payment callbacks
5. **Rate limiting** - Prevent abuse of free tier

---

## 🚀 **Next Steps**

### **Immediate (This Week):**
- [ ] Test the new pricing UI
- [ ] Gather feedback from potential users
- [ ] Adjust prices based on feedback
- [ ] Create test accounts

### **Short-term (This Month):**
- [ ] Integrate JazzCash/EasyPaisa
- [ ] Set up subscription database
- [ ] Create admin panel for subscriptions
- [ ] Implement email notifications

### **Medium-term (Next 3 Months):**
- [ ] Launch beta with 50 users
- [ ] Implement referral system
- [ ] Add billing history
- [ ] Create invoice generation

### **Long-term (6+ Months):**
- [ ] International expansion (USD pricing)
- [ ] Multiple payment methods
- [ ] API access for Enterprise
- [ ] White-label solutions

---

## 📞 **Support**

For questions about pricing implementation:
- Check `src/lib/pricing.js` for all configurations
- Review component implementations in `CVUpload.jsx` and `RecruiterDashboard.jsx`
- Test with localStorage first before payment integration

---

**Status**: ✅ Implemented and Ready for Testing
**Currency**: PKR (test-friendly prices)
**Last Updated**: December 31, 2025


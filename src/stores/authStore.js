import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null, // 'candidate' | 'recruiter' | 'admin'
      isPremium: false,
      analysesLeft: 5, // Free tier: 5 analyses per month
      subscriptionPlan: null, // For candidates: 'FREE' | 'PREMIUM', For recruiters: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
      
      setUser: (user, role) => set({ user, role }),
      
      setAuth: (user, token) => {
        // Store token in localStorage for API requests
        localStorage.setItem('token', token);
        set({ 
          user, 
          token,
          role: user.role,
          isPremium: user.isPremium || false,
        });
      },
      
      setPremium: (status) => set({ isPremium: status }),
      
      upgradeAccount: (plan = 'PREMIUM') => set({ 
        isPremium: true, 
        analysesLeft: -1, // Unlimited
        subscriptionPlan: plan 
      }),
      
      setSubscriptionPlan: (plan) => set({ 
        subscriptionPlan: plan,
        isPremium: plan === 'PREMIUM' || plan === 'PROFESSIONAL' || plan === 'ENTERPRISE'
      }),
      
      decrementAnalyses: () => {
        const { isPremium, analysesLeft } = get();
        if (!isPremium && analysesLeft > 0) {
          set({ analysesLeft: analysesLeft - 1 });
        }
      },
      
      resetAnalyses: () => set({ analysesLeft: 5 }), // Reset to 5 for new month
      
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null,
          role: null, 
          isPremium: false, 
          analysesLeft: 5,
          subscriptionPlan: null,
        });
      },
    }),
    { 
      name: 'auth-storage',
      version: 3, // Increment version for migration
    }
  )
);


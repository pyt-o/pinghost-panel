/**
 * Credit packages available for purchase
 * These map to Stripe products/prices
 */

export const CREDIT_PACKAGES = [
  {
    id: 'credits_100',
    name: '100 Credits',
    credits: 100,
    price: 5.00, // USD
    description: 'Perfect for testing',
  },
  {
    id: 'credits_500',
    name: '500 Credits',
    credits: 500,
    price: 20.00,
    description: 'Great for small projects',
    popular: true,
  },
  {
    id: 'credits_1000',
    name: '1000 Credits',
    credits: 1000,
    price: 35.00,
    description: 'Best value for regular users',
  },
  {
    id: 'credits_5000',
    name: '5000 Credits',
    credits: 5000,
    price: 150.00,
    description: 'For power users',
  },
] as const;

export type CreditPackage = typeof CREDIT_PACKAGES[number];

import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "For Beginners",
    benefits: [
      // "Up to 0 copy trading",
      "Test with virtual money",
      "Basic analytics and reporting",
    ],
    limitations: [
      "No live copy trading",
      "Limited customer support",
      "Limited access to premium resources",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Elevate Your Trading Strategy",
    benefits: [
      "Up to 10 copy trading",
      "Advanced analytics and reporting",
      "Access to pro trader strategies",
      "Priority customer support",
    ],
    limitations: [
      "Limited access to premium resources",
    ],
    prices: {
      monthly: 15,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Premium",
    description: "Unleash Your Trading Potential",
    benefits: [
      "Unlimited copy trading",
      "Real-time analytics and reporting",
      "Access to all top-performing strategies",
      "24/7 premium customer support",
      "Personalized onboarding and account management",
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = [
  "starter",
  "pro",
  "premium",
  "enterprise",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    starter: true,
    pro: true,
    premium: true,
    enterprise: "Custom",
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  // {
  //   feature: "Custom Branding",
  //   starter: null,
  //   pro: "500/mo",
  //   premium: "1,500/mo",
  //   enterprise: "Unlimited",
  //   tooltip: "Custom branding is available from the Pro plan onwards.",
  // },
  {
    feature: "Paper Trading",
    starter: true,
    pro: true,
    premium: true,
    enterprise: true,
    // link: "/",
  },
  {
    feature: "Maximum Copy Trading",
    starter: "0",
    pro: "10",
    premium: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "Priority Support",
    starter: null,
    pro: "Email",
    premium: "Email & Chat",
    enterprise: "24/7 Support",
  },
  {
    feature: "Advanced Reporting",
    starter: null,
    pro: null,
    premium: true,
    enterprise: "Custom",
    tooltip:
      "Advanced reporting is available in Premium and Enterprise plans.",
  },
  // {
  //   feature: "Dedicated Manager",
  //   starter: null,
  //   pro: null,
  //   premium: null,
  //   enterprise: true,
  //   tooltip: "Enterprise plan includes a dedicated account manager.",
  // },
  // {
  //   feature: "API Access",
  //   starter: "Limited",
  //   pro: "Standard",
  //   premium: "Enhanced",
  //   enterprise: "Full",
  // },
  // {
  //   feature: "Monthly Webinars",
  //   starter: false,
  //   pro: true,
  //   premium: true,
  //   enterprise: "Custom",
  //   tooltip: "Pro and higher plans include access to monthly webinars.",
  // },
  {
    feature: "Custom Integrations",
    starter: false,
    pro: false,
    premium: "Available",
    enterprise: "Available",
    tooltip:
      "Custom integrations are available in Premium and Enterprise plans.",
  },
  // {
  //   feature: "Roles and Permissions",
  //   starter: null,
  //   pro: "Basic",
  //   premium: "Advanced",
  //   enterprise: "Advanced",
  //   tooltip:
  //     "User roles and permissions management improves with higher plans.",
  // },
  {
    feature: "Onboarding Assistance",
    starter: false,
    pro: "Self-service",
    premium: "Assisted",
    enterprise: "Full Service",
    tooltip: "Higher plans include more comprehensive onboarding assistance.",
  },
  // Add more rows as needed
];

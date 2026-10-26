import { TaskItem, ChatMessage, PricingPlan, CompetitorComparison, Testimonial } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    key: 'CLK-10',
    title: 'Launch Mobile App in Core',
    status: 'IN PROGRESS',
    priority: 'Urgent',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Staff Product Designer'
    },
    dueDate: 'May 15, 2026',
    timeEstimate: '8d',
    tags: ['Design', 'Product', 'iOS'],
    commentsCount: 16
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    key: 'CLK-14',
    title: 'Figma token synchronization pipeline',
    status: 'IN PROGRESS',
    priority: 'High',
    assignee: {
      name: 'Ivan Villa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Head of Creative Tech'
    },
    dueDate: 'May 18, 2026',
    timeEstimate: '4d',
    tags: ['Design System', 'API'],
    commentsCount: 8
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    key: 'CLK-08',
    title: 'Executive dashboard & real-time velocity metrics',
    status: 'TODO',
    priority: 'Normal',
    assignee: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      role: 'VP Product'
    },
    dueDate: 'May 24, 2026',
    timeEstimate: '12d',
    tags: ['Analytics', 'BI'],
    commentsCount: 3
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    key: 'CLK-22',
    title: 'Multi-workspace permissions audit & SOC2 review',
    status: 'REVIEW',
    priority: 'Urgent',
    assignee: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      role: 'Security Engineer'
    },
    dueDate: 'May 12, 2026',
    timeEstimate: '5d',
    tags: ['Security', 'Compliance'],
    commentsCount: 12
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    key: 'CLK-04',
    title: 'ClickUp AI document summary & action item extraction',
    status: 'COMPLETE',
    priority: 'High',
    assignee: {
      name: 'Brendan Wolfe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      role: 'AI Engineer'
    },
    dueDate: 'May 02, 2026',
    timeEstimate: '6d',
    tags: ['AI', 'Docs'],
    commentsCount: 24
  }
];

export const FIGMA_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    author: 'Ivan Villa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    time: 'May 11 at 4:00 PM',
    content: 'Show more meta data on collapse sections so designers do not need to expand full drawers.'
  },
  {
    id: 'c2',
    author: 'Brendan Wolfe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    time: '10:00 AM',
    content: 'Ivan\'s comment: Show more meta data on collapse sections.',
    replyTo: 'c1'
  },
  {
    id: 'c3',
    author: 'Zeb Evans',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    time: 'May 11 at 4:05 PM',
    content: 'Hey this is looking 10x better! Let us ship this build to the internal dogfooding workspace today.',
    reactions: [{ emoji: '👍', count: 4 }, { emoji: '🚀', count: 7 }]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Forever',
    badge: 'Best for personal use',
    description: 'Everything you need to organize your personal projects and get work done.',
    priceMonthly: 0,
    priceYearly: 0,
    buttonText: 'Get Started Free',
    features: [
      '100MB Storage',
      'Unlimited Tasks & Spaces',
      'Unlimited Free Plan Members',
      'Two-Factor Authentication',
      'Collaborative Docs',
      'Whiteboards & Canvas',
      'Real-time Chat with Context',
      'Kanban Board & List Views'
    ]
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    badge: 'Most Popular',
    description: 'Perfect for fast-growing small teams needing unlimited storage and integrations.',
    priceMonthly: 10,
    priceYearly: 7,
    highlighted: true,
    buttonText: 'Try Unlimited Free',
    features: [
      'Everything in Free Forever, plus:',
      'Unlimited Storage',
      'Unlimited Integrations (GitHub, Slack, Drive)',
      'Unlimited Dashboards & Reporting',
      'Guests with Permissions',
      'Unlimited Gantt Charts & Mind Maps',
      'Custom Fields (Unlimited)',
      'Column Calculations & Portfolios'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    badge: 'Best for mid-sized teams',
    description: 'Advanced automations, workloads, custom permissions, and sprint management.',
    priceMonthly: 19,
    priceYearly: 12,
    buttonText: 'Upgrade to Business',
    features: [
      'Everything in Unlimited, plus:',
      'Google SSO & SAML Ready',
      'Unlimited Teams & Workloads',
      'Custom Exporting & Timesheets',
      'Advanced Public Sharing',
      'Advanced Automations (10,000/mo)',
      'Granular Permission Settings',
      'Goal Folders & Target Tracking'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'For large organizations',
    description: 'White-labeling, dedicated success manager, custom enterprise security & SLA.',
    priceMonthly: 35,
    priceYearly: 24,
    buttonText: 'Contact Enterprise Sales',
    features: [
      'Everything in Business, plus:',
      'Enterprise SSO & SCIM Provisioning',
      'HIPAA & SOC 2 Type II Compliance',
      'Dedicated Customer Success Manager',
      'Custom Roles & White Labeling',
      'Enterprise API Rate Limits',
      'Universal Search Across All Apps',
      '99.99% Guaranteed SLA Uptime'
    ]
  }
];

export const COMPETITOR_COMPARISONS: CompetitorComparison[] = [
  {
    feature: 'All-in-One App (Tasks, Docs, Chat, Goals, Whiteboards)',
    clickup: true,
    monday: false,
    asana: false,
    jira: false
  },
  {
    feature: 'Side-by-side Conversations with Context',
    clickup: true,
    monday: false,
    asana: false,
    jira: false
  },
  {
    feature: 'Generous Free Forever Plan',
    clickup: 'Unlimited members',
    monday: 'Max 2 seats',
    asana: 'Limited 10 seats',
    jira: 'Max 10 users'
  },
  {
    feature: 'Native Real-Time Docs & Whiteboards',
    clickup: true,
    monday: 'Basic workdocs',
    asana: false,
    jira: 'Requires Confluence'
  },
  {
    feature: 'Native Time Tracking & Billable Rates',
    clickup: true,
    monday: 'High-tier only',
    asana: 'Add-on app required',
    jira: 'Third-party plugins'
  },
  {
    feature: 'Average Cost per User / month',
    clickup: '$7 / mo',
    monday: '$12 / mo',
    asana: '$13.49 / mo',
    jira: '$8.15 / mo'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'ClickUp 3.0 has replaced Slack threads, Asana boards, and Google Docs for our entire engineering and design org. The speed difference is night and day.',
    author: 'Ivan Villa',
    role: 'Head of Creative Engineering',
    company: 'Fintech Scaleup',
    logo: '⚡',
    metric: '1 day/week',
    metricLabel: 'saved per team member'
  },
  {
    id: 't2',
    quote: 'Having our task context, pull requests, and customer feedback side-by-side in one view completely eliminated missed deadlines. We will never go back.',
    author: 'Elena Rostova',
    role: 'Director of Product',
    company: 'CloudFlow Tech',
    logo: '☁️',
    metric: '45%',
    metricLabel: 'faster sprint cycles'
  },
  {
    id: 't3',
    quote: 'We consolidated 4 expensive SaaS subscriptions into ClickUp and cut our software bill by $84,000 annually while our team actually loves using it.',
    author: 'Marcus Vance',
    role: 'VP Operations',
    company: 'Global Media Labs',
    logo: '🌐',
    metric: '$84,000',
    metricLabel: 'annual software savings'
  }
];

export const FAQS = [
  {
    q: 'Can ClickUp really replace all our other work tools?',
    a: 'Yes! ClickUp is designed as the everything app for work. By uniting Tasks, Docs, Real-time Chat, Whiteboards, Dashboards, and Automations under one intuitive roof, your team eliminates tool fatigue and context switching.'
  },
  {
    q: 'How does ClickUp 3.0 differ from ClickUp 2.0?',
    a: 'ClickUp 3.0 brings a completely re-engineered architecture: sub-second page loads, a revamped universal search, modern side-by-side work & context trays, customizable task layouts, and deep ClickUp AI integration.'
  },
  {
    q: 'Can I import my data from Asana, Trello, Monday, or Jira?',
    a: 'Absolutely. ClickUp includes 1-click automatic importers for Asana, Monday.com, Trello, Jira, Basecamp, Todoist, and CSV files. Your custom fields, assignees, and attachments transfer smoothly.'
  },
  {
    q: 'Is there a credit card required for the Free Forever plan?',
    a: 'No credit card is required. You can sign up with your work email and immediately invite unlimited team members.'
  }
];

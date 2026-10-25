export interface TaskItem {
  id: string;
  key: string;
  title: string;
  status: 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'COMPLETE';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  timeEstimate: string;
  tags: string[];
  commentsCount: number;
}

export interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  reactions?: { emoji: string; count: number }[];
  replyTo?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  highlighted?: boolean;
  buttonText: string;
  features: string[];
}

export interface CompetitorComparison {
  feature: string;
  clickup: boolean | string;
  monday: boolean | string;
  asana: boolean | string;
  jira: boolean | string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  logo: string;
  metric: string;
  metricLabel: string;
}

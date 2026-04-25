export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  category: string;
  year: number;
  featured: boolean;
  liveUrl?: string | null;
  repoUrl?: string | null;
  cover?: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  windowDays: number;
  total: number;
  byType: Array<{ type: string; count: number }>;
  byDay: Array<{ day: string; count: number }>;
}

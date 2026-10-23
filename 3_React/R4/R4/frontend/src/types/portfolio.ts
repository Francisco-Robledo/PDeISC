export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  available_for_hire: number;
  years_experience: string;
  projects_completed: number;
  satisfaction_rate: string;
  code_commits: string;
}

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'database';
  level: number;
  icon: string;
  description: string;
  color: string;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  long_description?: string;
  category: string;
  tags: string[];
  demo_url?: string;
  repo_url?: string;
  image_gradient?: string;
  likes: number;
  featured: number;
  metrics?: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  type: 'work' | 'education';
  badge_color: string;
}

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
  credential_url?: string;
  certificate_image?: string;
  pdf_url?: string;
}

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  role_or_company?: string;
  avatar_color?: string;
  created_at?: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  achievements: Achievement[];
  guestbook: GuestbookEntry[];
  congratulations?: number;
}

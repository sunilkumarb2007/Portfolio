export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: 'CodSoft',
    role: 'Web Development Intern',
    period: 'Jun 2025 — Jul 2025',
    location: 'Remote',
    bullets: [
      'Completed a structured 4-week internship building responsive web projects end-to-end.',
      'Developed interactive UI components and integrated REST APIs into a working flow.',
      'Practiced production habits: error handling, async data flow, and clean component decomposition.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'React', 'REST'],
  },
  {
    company: 'Panimalar Engineering College',
    role: 'BE — Electrical & Electronics Engineering',
    period: 'Oct 2024 — Present',
    location: 'Chennai, India',
    bullets: [
      'CGPA 7.8. Coursework spans data structures, algorithms, OOP, async programming, and database systems.',
      'Building a parallel software portfolio: full-stack apps in JS/Python/Go and cloud projects on AWS.',
      'Earning AWS and Oracle Cloud Infrastructure certifications alongside the core curriculum.',
    ],
    stack: ['Java', 'Python', 'C', 'DSA', 'OOP'],
  },
  {
    company: 'Vailankanni Matriculation HSS',
    role: 'Higher Secondary — Computer Science',
    period: 'Jun 2023 — Mar 2024',
    location: 'Krishnagiri, India',
    bullets: [
      'Higher School Education with Computer Science specialisation; graduated at 70.43%.',
      'First exposure to programming, problem solving, and computer science fundamentals.',
    ],
    stack: ['C', 'C++', 'Python (intro)'],
  },
];

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  status: 'completed' | 'in-progress';
}

export const certifications: Certification[] = [
  {
    name: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services',
    date: 'Jul 2025',
    status: 'completed',
  },
  {
    name: 'Oracle Cloud Infrastructure Architect Associate',
    issuer: 'Oracle',
    date: 'Jun 2025',
    status: 'completed',
  },
  {
    name: 'Introduction to NoSQL Databases',
    issuer: 'Infosys',
    date: 'Mar 2026',
    status: 'in-progress',
  },
  {
    name: 'Data Structures and Algorithms using Java',
    issuer: 'Infosys',
    date: 'Mar 2026',
    status: 'in-progress',
  },
];

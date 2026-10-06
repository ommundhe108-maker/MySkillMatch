export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  experience: string;
  salary: string;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  matchScore: number;
  breakdown: {
    skills: number;
    education: number;
    experience: number;
    role: number;
    location: number;
  };
  description: string;
  status: 'Open' | 'Closed' | 'Draft';
  applicantsCount: number;
  createdDate: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  education: {
    degree: string;
    branch: string;
    college: string;
    graduationYear: number;
    cgpa: number;
  };
  skills: string[];
  experience: {
    type: 'Fresher' | 'Experienced';
    years: number;
    previousRole: string;
    previousCompany: string;
  };
  preferences: {
    desiredRole: string;
    preferredLocation: string;
    workMode: string;
  };
  stats: {
    profileCompletion: number;
    applications: number;
    savedJobs: number;
    recommendedJobs: number;
  };
}

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  industry: string;
  description: string;
  location: string;
  website: string;
  contactPerson: string;
  phone: string;
  stats: {
    activeJobs: number;
    applicants: number;
    shortlisted: number;
    interviews: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedOn: string;
  matchScore: number;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
}

export interface Applicant {
  id: string;
  name: string;
  education: string;
  skills: string[];
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  appliedDate: string;
  explanation: string;
}

export const initialStudent: StudentProfile = {
  id: 'std_101',
  name: 'Rahul Patil',
  email: 'student@test.com',
  phone: '+91 98765 43210',
  location: 'Pune, Maharashtra',
  education: {
    degree: 'B.Tech',
    branch: 'Artificial Intelligence & Data Science',
    college: 'Pune Institute of Computer Technology (PICT)',
    graduationYear: 2026,
    cgpa: 8.7,
  },
  skills: ['Python', 'SQL', 'Machine Learning', 'Git', 'HTML', 'CSS'],
  experience: {
    type: 'Fresher',
    years: 0,
    previousRole: 'Data Science Intern (2 Months)',
    previousCompany: 'Apex Analytics',
  },
  preferences: {
    desiredRole: 'Python Developer / Data Analyst',
    preferredLocation: 'Pune / Mumbai / Bengaluru',
    workMode: 'Hybrid / On-site',
  },
  stats: {
    profileCompletion: 75,
    applications: 4,
    savedJobs: 6,
    recommendedJobs: 5,
  },
};

export const initialCompany: CompanyProfile = {
  id: 'comp_201',
  name: 'TechNova Solutions',
  email: 'company@test.com',
  industry: 'Software Development & Cloud Engineering',
  description:
    'TechNova Solutions delivers enterprise-grade software products and AI-enabled data pipelines for global fintech and logistics clients.',
  location: 'Pune, Maharashtra',
  website: 'https://technova.example.com',
  contactPerson: 'Priya Sharma',
  phone: '+91 98220 11223',
  stats: {
    activeJobs: 4,
    applicants: 32,
    shortlisted: 8,
    interviews: 3,
  },
};

export const initialJobs: Job[] = [
  {
    id: 'job_01',
    title: 'Python Developer',
    company: 'TechNova Solutions',
    location: 'Pune',
    workMode: 'Hybrid',
    experience: '0–2 years',
    salary: '₹4–7 LPA',
    requiredSkills: ['Python', 'SQL', 'Git', 'REST API'],
    preferredSkills: ['Docker', 'FastAPI', 'PostgreSQL'],
    education: 'B.E / B.Tech (Computer Science / AI / IT)',
    matchScore: 88,
    breakdown: {
      skills: 85,
      education: 95,
      experience: 90,
      role: 90,
      location: 95,
    },
    description:
      'We are seeking a junior Python Developer with strong core fundamentals in data structures, OOP, and relational databases. You will collaborate with our backend team to build and maintain robust API integrations.',
    status: 'Open',
    applicantsCount: 14,
    createdDate: '2026-09-20',
  },
  {
    id: 'job_02',
    title: 'Data Analyst',
    company: 'DataWorks Analytics',
    location: 'Mumbai',
    workMode: 'On-site',
    experience: '0–1 years',
    salary: '₹3.8–6 LPA',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
    preferredSkills: ['Power BI', 'Tableau', 'Pandas'],
    education: 'B.Tech / B.Sc (Data Science / Math / Stats)',
    matchScore: 81,
    breakdown: {
      skills: 80,
      education: 90,
      experience: 85,
      role: 85,
      location: 70,
    },
    description:
      'Analyze operational metrics, write automated SQL data pipelines, and produce clean reports for business stakeholders. Strong data hygiene and presentation skills are required.',
    status: 'Open',
    applicantsCount: 8,
    createdDate: '2026-09-22',
  },
  {
    id: 'job_03',
    title: 'Machine Learning Intern',
    company: 'CognitiveGrid AI',
    location: 'Bengaluru',
    workMode: 'Remote',
    experience: 'Fresher',
    salary: '₹25,000 / month',
    requiredSkills: ['Python', 'Machine Learning', 'Git', 'NumPy'],
    preferredSkills: ['PyTorch', 'Scikit-Learn', 'HuggingFace'],
    education: 'B.Tech / M.Tech in CS / AI',
    matchScore: 92,
    breakdown: {
      skills: 95,
      education: 95,
      experience: 90,
      role: 95,
      location: 85,
    },
    description:
      'Assist our research and product development team in data cleaning, model benchmarking, and running feature extraction pipelines on NLP datasets.',
    status: 'Open',
    applicantsCount: 21,
    createdDate: '2026-09-24',
  },
  {
    id: 'job_04',
    title: 'Junior Web Developer',
    company: 'InnoStack Labs',
    location: 'Pune',
    workMode: 'On-site',
    experience: '0–2 years',
    salary: '₹3.5–5 LPA',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    preferredSkills: ['React', 'Tailwind CSS', 'TypeScript'],
    education: 'Any Graduate / BCA / B.Tech',
    matchScore: 64,
    breakdown: {
      skills: 60,
      education: 90,
      experience: 80,
      role: 60,
      location: 95,
    },
    description:
      'Develop responsive web interfaces, collaborate with backend engineers, and maintain accessibility across browser platforms.',
    status: 'Open',
    applicantsCount: 11,
    createdDate: '2026-09-25',
  },
];

export const initialApplications: Application[] = [
  {
    id: 'app_01',
    jobId: 'job_01',
    jobTitle: 'Python Developer',
    company: 'TechNova Solutions',
    location: 'Pune',
    appliedOn: '30 Sep 2026',
    matchScore: 88,
    status: 'Shortlisted',
  },
  {
    id: 'app_02',
    jobId: 'job_02',
    jobTitle: 'Data Analyst',
    company: 'DataWorks Analytics',
    location: 'Mumbai',
    appliedOn: '28 Sep 2026',
    matchScore: 81,
    status: 'Applied',
  },
  {
    id: 'app_03',
    jobId: 'job_03',
    jobTitle: 'Machine Learning Intern',
    company: 'CognitiveGrid AI',
    location: 'Bengaluru',
    appliedOn: '25 Sep 2026',
    matchScore: 92,
    status: 'Interview',
  },
  {
    id: 'app_04',
    jobId: 'job_05',
    jobTitle: 'Backend Associate',
    company: 'Zenith Cloud Corp',
    location: 'Hyderabad',
    appliedOn: '18 Sep 2026',
    matchScore: 58,
    status: 'Rejected',
  },
];

export const initialApplicants: Applicant[] = [
  {
    id: 'cand_01',
    name: 'Rahul Patil',
    education: 'B.Tech AI & DS (PICT)',
    skills: ['Python', 'SQL', 'Git', 'Machine Learning'],
    matchScore: 88,
    matchedSkills: ['Python', 'SQL', 'Git'],
    missingSkills: ['REST API', 'Docker'],
    status: 'Shortlisted',
    appliedDate: '30 Sep 2026',
    explanation:
      'Strong foundation in core Python and database queries. Lacks REST API and Docker production exposure, which can be acquired on the job.',
  },
  {
    id: 'cand_02',
    name: 'Amit Sharma',
    education: 'B.Tech CSE (COEP)',
    skills: ['Python', 'SQL', 'Java', 'C++'],
    matchScore: 76,
    matchedSkills: ['Python', 'SQL'],
    missingSkills: ['Git', 'REST API'],
    status: 'Applied',
    appliedDate: '29 Sep 2026',
    explanation:
      'Good programming fundamentals with Python and SQL proficiency. Needs practical experience with Git collaborative workflow and web endpoints.',
  },
  {
    id: 'cand_03',
    name: 'Sneha Kulkarni',
    education: 'B.E Information Tech (MIT)',
    skills: ['Python', 'SQL', 'Git', 'REST API', 'Docker'],
    matchScore: 96,
    matchedSkills: ['Python', 'SQL', 'Git', 'REST API'],
    missingSkills: [],
    status: 'Interview',
    appliedDate: '27 Sep 2026',
    explanation:
      'Direct match across all primary and secondary stack requirements. Project portfolio demonstrates working REST microservices.',
  },
  {
    id: 'cand_04',
    name: 'Rohan Deshmukh',
    education: 'B.Tech Computer Science (VIT)',
    skills: ['Python', 'Django', 'HTML', 'CSS'],
    matchScore: 68,
    matchedSkills: ['Python'],
    missingSkills: ['SQL', 'Git', 'REST API'],
    status: 'Applied',
    appliedDate: '28 Sep 2026',
    explanation:
      'Has web development background in Django, but missing standalone relational SQL and Git workflow requirements.',
  },
];

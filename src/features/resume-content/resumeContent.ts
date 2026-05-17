export type ContactTarget = {
  label: string
  value: string
  href?: string
}

export type Skill = {
  name: string
  summary: string
}

export type ExperienceEntry = {
  employer: string
  role: string
  location: string
  startYear: string
  endYear: string
  summary: string
  highlights: readonly string[]
}

export type ProjectEntry = {
  name: string
  client: string
  stack: readonly string[]
  summary: string
  highlights: readonly string[]
}

export type EducationEntry = {
  school: string
  degree: string
  location: string
  startYear: string
  endYear: string
}

export type ResumeIdentity = {
  name: string
  publicTitle: string
  location: string
  summary: string
}

export type ResumeContent = {
  identity: ResumeIdentity
  highlights: readonly string[]
  softCompetencies: readonly string[]
  skills: readonly Skill[]
  experience: readonly ExperienceEntry[]
  projects: readonly ProjectEntry[]
  education: readonly EducationEntry[]
  activities: readonly string[]
  contactTargets: readonly ContactTarget[]
}

export const resumeContent = {
  identity: {
    name: 'Andrew Smith',
    publicTitle: 'Software Engineer',
    location: 'Indianapolis, Indiana',
    summary:
      'Senior Consultant and software engineer with 10+ years of software design experience.',
  },
  highlights: [
    'Architected and developed an enterprise SaaS React solution supporting 100+ clients.',
    'Led a responsive Angular 15 PEBT site with NgRx state management that served 20K families.',
    'Created Angular mentoring and code review practices for 4 interns delivering production features.',
    'Led front-end work for a product license management platform with Azure AD B2C.',
  ],
  softCompetencies: [
    'Communicates with cross-functional teams and stakeholders.',
    'Debugs, optimizes, and improves code for maintainability.',
    'Learns new technologies and tools as project needs change.',
    'Supports code quality through documentation, peer reviews, and best practices.',
    'Balances multiple projects, deadlines, and priorities.',
  ],
  skills: [
    {
      name: 'React',
      summary:
        'Builds React applications with component libraries, shared patterns, Zustand, TanStack Query, and React Hook Form.',
    },
    {
      name: 'Angular',
      summary:
        'Builds Angular applications with TypeScript, NgRx Component Store, Angular Material, and optimized delivery patterns.',
    },
    {
      name: 'JavaScript',
      summary:
        'Writes modern JavaScript for clean, reusable, and performant front-end applications.',
    },
    {
      name: 'Responsive Web Design',
      summary:
        'Creates adaptive layouts with CSS Grid, Flexbox, media queries, Tailwind, and mobile-first techniques.',
    },
    {
      name: '.NET',
      summary:
        'Builds RESTful APIs with .NET, dependency injection, and database integration.',
    },
    {
      name: 'Azure',
      summary:
        'Uses Azure App Services, Azure DevOps CI/CD, and Azure AD B2C for web application delivery.',
    },
  ],
  experience: [
    {
      employer: 'Moser Consulting',
      role: 'Senior Consultant',
      location: 'Indianapolis, Indiana',
      startYear: '2015',
      endYear: 'Present',
      summary:
        'Consults on front-end, back-end, and delivery work for enterprise and public-sector web applications.',
      highlights: [
        'Led front-end development for React and Angular products.',
        'Implemented responsive interfaces and .NET APIs.',
        'Coordinated with stakeholders and technical staff to plan, build, deploy, and maintain solutions.',
        'Mentored interns on Angular development through learning plans, practice projects, and feedback.',
      ],
    },
    {
      employer: 'Department of Local Government Finance',
      role: 'Application Solutions Developer',
      location: 'Indianapolis, Indiana',
      startYear: '2012',
      endYear: '2015',
      summary:
        'Built and maintained public-sector applications for property tax inquiries, SQL Server workflows, and internal users.',
      highlights: [
        'Analyzed and designed application requirements.',
        'Developed ASP.NET and dynamic SQL web solutions for taxpayer inquiries.',
        'Built Windows Forms tools to move Excel data into SQL Server.',
        'Implemented business logic for county circuit breaker loss calculations.',
        'Tested, implemented, analyzed, fixed bugs, and maintained user accounts.',
      ],
    },
  ],
  projects: [
    {
      name: 'Benesys',
      client: 'Benesys',
      stack: [
        'React',
        'Zustand',
        'TanStack Query',
        'React Hook Form',
        'Tailwind',
        'PrimeReact',
      ],
      summary:
        'Enterprise benefits portal for trade workers, built as a scalable React front end.',
      highlights: [
        'Led front-end development.',
        'Supported 100+ clients.',
        'Implemented responsive web design with Tailwind.',
        'Onboarded client developers for project transition.',
      ],
    },
    {
      name: 'Family and Social Services Administration / PEBT',
      client: 'Family and Social Services Administration',
      stack: ['Angular 15', 'TypeScript', 'NgRx Component Store'],
      summary:
        'Responsive summer PEBT website built under a tight timeline for public-sector users.',
      highlights: [
        'Led front-end development.',
        'Implemented design-team deliverables.',
        'Established state management with NgRx Component Store.',
        'Served 20K families.',
      ],
    },
    {
      name: 'Schwarz Partners',
      client: 'Schwarz Partners',
      stack: [
        'Angular 14',
        'TypeScript',
        'Azure AD B2C',
        '.NET',
        'C#',
        'SQL Server',
        'Compodoc',
      ],
      summary:
        'Product key management system with internal administration and external customer-facing applications.',
      highlights: [
        'Led front-end development.',
        'Built Azure AD B2C administration workflows.',
        'Implemented .NET APIs, SQL Server tables, and stored procedures.',
        'Guided documentation practices with Compodoc.',
      ],
    },
    {
      name: 'Venture Logistics',
      client: 'Venture Logistics',
      stack: ['Angular 13', 'TypeScript', '.NET', 'C#', 'SignalR'],
      summary:
        'Internal logistics management application with real-time user tracking.',
      highlights: [
        'Developed a responsive Angular front end.',
        'Implemented .NET APIs.',
        'Added real-time tracking with SignalR.',
      ],
    },
  ],
  education: [
    {
      school: 'IUPUI',
      degree: 'BS Computer Science',
      location: 'Indianapolis, IN',
      startYear: '2007',
      endYear: '2012',
    },
  ],
  activities: ['Board Games', 'Biking', 'Reading'],
  contactTargets: [
    {
      label: 'Email',
      value: 'andrew.smith.indy@gmail.com',
      href: 'mailto:andrew.smith.indy@gmail.com',
    },
    {
      label: 'LinkedIn',
      value: 'LinkedIn',
    },
    {
      label: 'Website',
      value: 'andrewsmith.bio',
      href: 'https://andrewsmith.bio',
    },
    {
      label: 'Phone',
      value: '(317) 260-8411',
      href: 'tel:+13172608411',
    },
  ],
} satisfies ResumeContent

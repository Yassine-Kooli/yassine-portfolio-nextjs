// Source of truth: Yassine_Kooli_CV_EN_Schneider_BI.docx. Keep this file in sync with the CV.

export const profile = {
  name: "Yassine Kooli",
  handle: "yassine",
  role: "Business Intelligence Analyst & Developer",
  location: "Sousse, Tunisia",
  email: "kooli.yassine0@gmail.com",
  avatar: "/images/profile.png",
  cv: "/CV.pdf",
  yearsOfExperience: "4+",
  tagline: "Turning business data into reliable dashboards, reports and decision-support software.",
  bio: [
    "Business Intelligence graduate and software engineer with experience since 2022 building data-driven business applications. Strong in SQL, PostgreSQL and MySQL, data structuring and query optimisation, and in building dashboards and reporting tools for business users.",
    "Experienced in gathering requirements from non-technical stakeholders and turning them into reliable data solutions. Seeking to apply this combined analytical and technical profile to sales performance analysis and decision support.",
  ],
  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/yassine-kooli/" },
    { name: "GitHub", url: "https://github.com/Yassine-Kooli" },
    { name: "Website", url: "https://yassine-kooli.vercel.app" },
  ],
} as const;

export const experiencesData = [
  {
    slug: "satoripop-software-engineer",
    title: "Software Engineer",
    company: "Satoripop",
    location: "Sousse, Tunisia",
    date: "Aug 2024 – Present",
    highlights: [
      "Develop and maintain production applications for clients across different sectors, with a focus on data reliability and operational needs.",
      "Design and optimise MySQL and PostgreSQL databases: SQL queries, table relationships, data structuring and performance improvements.",
      "Build back-offices and business dashboards with Laravel, Filament and Livewire to support operational monitoring and access to information.",
      "Develop REST APIs and integrate third-party sources and services; transform and validate the data used by applications.",
      "Implement asynchronous and event-driven processing (jobs, queues, WebSockets) to automate operations and improve data flows.",
      "Work with stakeholders to understand requirements, translate business logic into technical solutions, test features and resolve production issues.",
    ],
  },
  {
    slug: "satoripop-software-intern",
    title: "Software Development Intern",
    company: "Satoripop",
    location: "Sousse, Tunisia",
    date: "Jun 2022 – May 2024 (two internship periods)",
    highlights: [
      "Built an administration platform with Laravel and Filament, including CRUD operations, role-based permissions and dynamic dashboards.",
      "Developed backend features and REST APIs with PHP, Laravel, CodeIgniter and MySQL; optimised and debugged SQL queries.",
      "Maintained production applications, performed functional testing and incorporated feedback from code reviews.",
    ],
  },
] as const;

export const educationData = [
  {
    slug: "epi-software-engineering",
    title: "Engineering Diploma in Software Engineering (Cybersecurity orientation)",
    school: "EPI, École Pluridisciplinaire Internationale, Sousse",
    date: "2024 – 2027 (in progress)",
  },
  {
    slug: "isg-business-intelligence",
    title: "Bachelor's Degree in Business Intelligence (Licence en informatique décisionnelle)",
    school: "Institut Supérieur de Gestion de Sousse (ISG Sousse)",
    date: "2020 – 2024",
  },
] as const;

export const projectsData = [
  {
    slug: "weart-exchange",
    title: "WeART Exchange",
    type: "FinTech",
    description: "Fractional art investment platform. Backend, APIs and third-party integrations.",
    features: ["Backend architecture and REST APIs", "Third-party service integrations"],
    tags: ["Laravel", "REST API", "Integrations", "FinTech"],
    link: "https://weart.exchange",
  },
  {
    slug: "gererseul",
    title: "Gererseul",
    type: "SaaS",
    description: "Property management SaaS covering leases, tenants, invoicing and reporting.",
    features: ["Lease and tenant management", "Invoicing", "Reporting for property owners"],
    tags: ["WordPress", "Property management", "Invoicing", "Reporting"],
    link: "https://gererseul.com",
  },
  {
    slug: "fantasy",
    title: "Fantasy",
    type: "Sports & Gaming",
    description: "Fantasy sports and gaming platform. Full-stack development and maintenance.",
    features: ["Full-stack development", "Ongoing production maintenance"],
    tags: ["Laravel", "Full-stack", "Gaming"],
    link: "https://fantasy.tn",
  },
  {
    slug: "mymg",
    title: "MyMG",
    type: "Mobile, Web & BI",
    description: "Mobile app, website and dashboard. Worked on the mobile app, the website and the dashboard, with direct client discussions.",
    features: ["Mobile app (React Native) and website", "Backend API and admin dashboard (Laravel, Filament)", "Business reporting in Power BI"],
    tags: ["React Native", "Laravel", "Filament", "Power BI"],
    link: "",
  },
  {
    slug: "smu",
    title: "SMU",
    type: "Education",
    description: "Website and React application for students of a Tunisian private faculty.",
    features: ["Laravel website", "React application for students"],
    tags: ["Laravel", "React"],
    link: "",
  },
] as const;

export const skillsData = {
  "Analytics & BI": ["SQL", "ETL processes", "Data modelling", "Reporting", "KPI & performance dashboards"],
  Databases: ["PostgreSQL", "MySQL", "Redis", "Query optimisation", "Relational data structuring"],
  "Data integration & automation": ["REST APIs", "Third-party data sources", "Data validation", "Jobs & queues", "Scheduled tasks"],
  Visualisation: ["Interactive dashboards", "Operational reporting", "Filament", "Livewire"],
  "Tools & methods": ["Git", "CI/CD", "Docker", "Linux", "PHPUnit", "Agile / Scrum"],
  Web: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Alpine.js"],
} as const;

export const languagesData = [
  { name: "English", level: "Fluent", note: "TOEIC L&R 870/990" },
  { name: "French", level: "Professional working proficiency" },
  { name: "Arabic", level: "Native" },
] as const;

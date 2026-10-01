export const profile = {
  name: "Yassine Kooli",
  handle: "yassine",
  role: "Laravel Developer",
  location: "Sousse, Tunisia",
  email: "kooli.yassine0@gmail.com",
  avatar: "/images/profile.png",
  cv: "/CV.pdf",
  yearsOfExperience: "4+",
  tagline: "Building scalable web applications with Laravel, Filament, Livewire and modern PHP.",
  bio: [
    "Laravel developer with 4+ years of hands-on experience building scalable web applications — from admin panels and inventory systems to booking tools and SaaS platforms. I've delivered solutions for enterprise clients and local businesses, working across the full lifecycle from requirements to deployment.",
    "My stack centers on the Laravel ecosystem: Filament for powerful admin interfaces, Livewire for reactive frontends, Alpine.js for lightweight interactivity, and Tailwind CSS for clean UI. I'm comfortable with REST API design, MySQL/PostgreSQL, Redis, queue jobs, and real-time features via WebSockets.",
    "I write clean, maintainable code following SOLID principles and Laravel best practices. I thrive in Agile teams, enjoy collaborating with designers and stakeholders, and take ownership from architecture decisions to production performance tuning.",
  ],
  socials: [
    { name: "GitHub", url: "https://github.com/Yassine-Kooli" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/yassine-kooli/" },
    { name: "Upwork", url: "https://www.upwork.com/freelancers/~01e5595c71628fd231?viewMode=1" },
  ],
} as const;

export const experiencesData = [
  {
    slug: "satoripop-laravel-developer",
    title: "Laravel Developer",
    location: "Satoripop, Sousse",
    date: "August 2024 - Present",
    description:
      "Develop and maintain enterprise-grade web applications using Laravel, Filament, Livewire, and Alpine.js. Build internal dashboards in Agile teams, reducing feature delivery time by 20%. Refactor legacy codebases, improving maintainability and test coverage. Collaborate with designers, PMs, and clients to ship user-focused features.",
  },
  {
    slug: "satoripop-intern-2024",
    title: "Web Developer Intern",
    location: "Satoripop, Sousse",
    date: "January 2024 - May 2024",
    description:
      "Built a Laravel-based admin panel for a final-year project using Filament PHP, streamlining backend workflows. Mastered company processes, delivering a scalable application under tight deadlines.",
  },
  {
    slug: "freelance",
    title: "Freelance Web Developer",
    location: "Ksar Hellal, Tunisia",
    date: "2020 - 2024",
    description:
      "Developed and deployed 10+ full-stack Laravel applications, including booking systems, CRMs, and inventory tools, for local businesses. Managed end-to-end project lifecycles, from requirements gathering to QA and support. Optimized performance using MySQL and REST APIs.",
  },
  {
    slug: "satoripop-intern-2022",
    title: "Web Development Intern",
    location: "Satoripop, Sousse",
    date: "Summer 2022",
    description:
      "Contributed to two internal PHP projects using Laravel and CodeIgniter, implementing MVC patterns and REST APIs. Streamlined version control with Git, enhancing team collaboration. Improved debugging efficiency, reducing issue resolution time by 15%.",
  },
  {
    slug: "isg-sousse",
    title: "Bachelor's in Business Intelligence",
    location: "ISG Sousse, Tunisia",
    date: "2020 - 2024",
    description:
      "Graduated with honors, focusing on data-driven solutions. Relevant coursework: Data Analytics, Database Systems. Developed a strong foundation in data analysis, system design, and decision support systems.",
  },
] as const;

export const projectsData = [
  {
    slug: "multi-tenant-saas",
    title: "Multi-Tenant SaaS Platform",
    type: "SaaS",
    image: "/images/saas-platform.svg",
    description:
      "Full multi-tenant architecture with isolated databases per tenant, automated provisioning, custom domain routing, and dynamic feature flags. Built for scale from day one.",
    features: [
      "Per-tenant DB isolation with automatic provisioning",
      "Stripe subscription billing + plan upgrades/downgrades",
      "Custom domain mapping with SSL per tenant",
    ],
    tags: ["Laravel", "Multi-Tenancy", "Livewire", "Stripe", "Redis", "Queue Jobs"],
    link: "",
  },
  {
    slug: "ecommerce-platform",
    title: "Enterprise E-Commerce Platform",
    type: "E-Commerce",
    image: "/images/ecommerce-platform.svg",
    description:
      "Multi-vendor marketplace with advanced inventory management, real-time stock tracking, and integrated payment gateways. Handles complex discount logic, order lifecycle, and automated email campaigns.",
    features: [
      "Multi-vendor support with vendor dashboards",
      "Elasticsearch-powered product search with filters",
      "Stripe + PayPal with webhook-based order fulfillment",
    ],
    tags: ["Laravel", "Livewire", "Alpine.js", "Stripe", "Elasticsearch", "Redis"],
    link: "",
  },
  {
    slug: "admin-panel-cms",
    title: "Advanced Admin Panel & CMS",
    type: "Admin Panel",
    image: "/images/admin-panel-cms.svg",
    description:
      "Full-featured CMS built on Laravel Filament with granular RBAC, content scheduling, media management, and SEO tooling. Includes audit logs, automated backups, and multi-language content.",
    features: [
      "Spatie Permissions — role + permission matrix",
      "Media Library with image transformations",
      "Audit trail: who changed what and when",
    ],
    tags: ["Laravel", "Filament", "Spatie", "Media Library", "SEO"],
    link: "",
  },
  {
    slug: "project-management",
    title: "Real-Time Project Management Tool",
    type: "SaaS",
    image: "/images/project-management.svg",
    description:
      "Team collaboration tool with live Kanban boards, time tracking, and file sharing. WebSockets push updates instantly across all connected clients — no polling.",
    features: [
      "Live Kanban & Gantt views via Laravel Echo + Pusher",
      "Time logging with exportable reports",
      "In-app notifications + file attachment storage",
    ],
    tags: ["Laravel", "Livewire", "WebSockets", "Laravel Echo", "Pusher"],
    link: "",
  },
  {
    slug: "financial-system",
    title: "Financial Management System",
    type: "Internal Tool",
    image: "/images/financial-system.svg",
    description:
      "Invoice generation, expense tracking, tax calculation, and recurring billing in one place. Integrated with external accounting APIs and automated payment reminder sequences.",
    features: [
      "PDF invoice generation with custom branding",
      "Recurring billing with automatic retry logic",
      "Chart-based financial dashboards (monthly P&L)",
    ],
    tags: ["Laravel", "Filament", "PDF Generation", "Charts", "Scheduling"],
    link: "",
  },
  {
    slug: "learning-management",
    title: "Learning Management System",
    type: "EdTech",
    image: "/images/learning-management.svg",
    description:
      "Course platform with video streaming, progress tracking, interactive quizzes, and automated certificate generation. Students get real-time notifications for new content and discussion replies.",
    features: [
      "Video processing pipeline with adaptive streaming",
      "Auto-generated PDF certificates on course completion",
      "Discussion forums with real-time reply notifications",
    ],
    tags: ["Laravel", "Livewire", "Video Processing", "Certificates", "Notifications"],
    link: "",
  },
] as const;

export const skillsData = {
  Backend: ["PHP", "Laravel", "Eloquent ORM", "REST API", "GraphQL", "Queue Jobs", "Task Scheduling", "WebSockets", "Multi-Tenancy", "Microservices"],
  "Laravel ecosystem": ["Filament", "Livewire", "Nova", "Jetstream", "Breeze", "Fortify", "Sanctum", "Passport", "Horizon", "Echo", "Telescope", "Octane", "Spatie Packages"],
  Frontend: ["HTML", "CSS", "JavaScript", "Alpine.js", "Tailwind CSS", "Blade", "Inertia.js", "Vue.js", "React"],
  Data: ["MySQL", "PostgreSQL", "Redis", "Elasticsearch"],
  "DevOps & tooling": ["Git", "CI/CD", "Docker", "AWS", "DigitalOcean"],
  Payments: ["Stripe", "PayPal"],
  Practices: ["TDD", "PHPUnit", "Pest PHP", "Design Patterns", "SOLID", "Agile"],
} as const;

import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaCode } from "react-icons/fa";
import { SiLaravel } from "react-icons/si";
import { LuGraduationCap } from "react-icons/lu";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },

  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    titleKey: "experience.currentJob.title",
    locationKey: "experience.currentJob.location",
    descriptionKey: "experience.currentJob.description",
    icon: React.createElement(SiLaravel),
    dateKey: "experience.currentJob.date",
  },
  {
    titleKey: "experience.internship2024.title",
    locationKey: "experience.internship2024.location",
    descriptionKey: "experience.internship2024.description",
    icon: React.createElement(CgWorkAlt),
    dateKey: "experience.internship2024.date",
  },
  {
    titleKey: "experience.freelance.title",
    locationKey: "experience.freelance.location",
    descriptionKey: "experience.freelance.description",
    icon: React.createElement(FaCode),
    dateKey: "experience.freelance.date",
  },
  {
    titleKey: "experience.firstIntern.title",
    locationKey: "experience.firstIntern.location",
    descriptionKey: "experience.firstIntern.description",
    icon: React.createElement(CgWorkAlt),
    dateKey: "experience.firstIntern.date",
  },
  {
    titleKey: "experience.education.title",
    locationKey: "experience.education.location",
    descriptionKey: "experience.education.description",
    icon: React.createElement(LuGraduationCap),
    dateKey: "experience.education.date",
  },
] as const;

export const projectsData = [
  {
    title: "Multi-Tenant SaaS Platform",
    description:
      "A sophisticated multi-tenant SaaS application with tenant isolation, subscription management, and dynamic feature toggling. Built with Laravel's multi-tenancy package, featuring automated tenant provisioning, custom domains, and scalable architecture.",
    tags: ["Laravel", "Multi-Tenancy", "Livewire", "Stripe", "Redis", "Queue Jobs", "API"],
    images: [
      "/images/saas-platform.svg",
    ],
    link: "https://github.com/yourusername/laravel-saas-platform",
  },
  {
    title: "Enterprise E-Commerce Solution",
    description:
      "A comprehensive e-commerce platform with advanced inventory management, multi-vendor support, payment gateway integration, and real-time analytics. Features include product variants, discount systems, order tracking, and automated email marketing.",
    tags: ["Laravel", "Livewire", "Alpine.js", "Stripe", "PayPal", "Elasticsearch", "Redis"],
    images: [
      "/images/ecommerce-platform.svg",
    ],
    link: "https://github.com/yourusername/enterprise-ecommerce",
  },
  {
    title: "Advanced Admin Panel & CMS",
    description:
      "A powerful content management system with Laravel Filament featuring role-based permissions, content scheduling, media management, SEO optimization, and custom form builders. Includes audit trails, backup systems, and multi-language support.",
    tags: ["Laravel", "Filament", "Spatie Permissions", "Media Library", "SEO", "Backup"],
    images: [
      "/images/admin-panel-cms.svg",
    ],
    link: "https://github.com/yourusername/advanced-cms",
  },
  {
    title: "Real-Time Project Management Tool",
    description:
      "A collaborative project management application with real-time updates, task tracking, team collaboration, and time logging. Features include Kanban boards, Gantt charts, file sharing, and integrated communication tools using Laravel Echo and WebSockets.",
    tags: ["Laravel", "Livewire", "WebSockets", "Laravel Echo", "Pusher", "File Storage"],
    images: [
      "/images/project-management.svg",
    ],
    link: "https://github.com/yourusername/project-management",
  },
  {
    title: "Financial Management System",
    description:
      "A comprehensive financial application with invoice generation, expense tracking, financial reporting, and tax calculations. Includes automated recurring billing, payment reminders, and integration with accounting software APIs.",
    tags: ["Laravel", "Filament", "PDF Generation", "Charts", "API Integration", "Scheduling"],
    images: [
      "/images/financial-system.svg",
    ],
    link: "https://github.com/yourusername/financial-management",
  },
  {
    title: "Learning Management System (LMS)",
    description:
      "An educational platform with course creation, student enrollment, progress tracking, and assessment tools. Features include video streaming, interactive quizzes, certificates generation, and discussion forums with real-time notifications.",
    tags: ["Laravel", "Livewire", "Video Processing", "Certificates", "Forums", "Notifications"],
    images: [
      "/images/learning-management.svg",
    ],
    link: "https://github.com/yourusername/learning-management",
  },
] as const;

export const skillsData = [
  "PHP",
  "Laravel",
  "Livewire",
  "Filament",
  "Alpine.js",
  "Tailwind CSS",
  "MySQL",
  "PostgreSQL",
  "Redis",
  "Elasticsearch",
  "HTML",
  "CSS",
  "JavaScript",
  "Blade Templates",
  "Eloquent ORM",
  "Laravel Nova",
  "Laravel Jetstream",
  "Laravel Breeze",
  "Laravel Fortify",
  "Laravel Sanctum",
  "Laravel Passport",
  "Laravel Horizon",
  "Laravel Echo",
  "Laravel Telescope",
  "Laravel Octane",
  "Multi-Tenancy",
  "Spatie Packages",
  "PHPUnit",
  "Pest PHP",
  "Git",
  "CI/CD",
  "Docker",
  "AWS",
  "DigitalOcean",
  "REST API",
  "Redis",
  "GraphQL",
  "WebSockets",
  "Queue Jobs",
  "Task Scheduling",
  "Payment Gateways",
  "Stripe",
  "PayPal",
  "Inertia.js",
  "Vue.js",
  "React",
  "TALL Stack",
  "TDD",
  "Design Patterns",
  "Microservices",
] as const;

export const testimonialData = [
  {
    name: "Sarah Johnson",
    title: "CTO at FinanceFlow SaaS",
    text: "Yassine built our multi-tenant financial platform from the ground up. His expertise in Laravel's multi-tenancy architecture and payment integrations was exceptional. The platform handles thousands of users seamlessly.",
    image: "/images/testimonial1.jpg",
  },
  {
    name: "Ahmed Hassan",
    title: "Founder at EduTech Solutions",
    text: "Our learning management system required complex video processing and real-time features. Yassine delivered a robust solution using Laravel Echo and WebSockets that exceeded our performance expectations.",
    image: "/images/testimonial2.jpg",
  },
  {
    name: "Maria Garcia",
    title: "VP of Engineering at RetailMax",
    text: "Yassine transformed our e-commerce infrastructure with advanced inventory management and multi-vendor capabilities. His Laravel Filament admin panels are incredibly powerful yet user-friendly.",
    image: "/images/testimonial3.jpg",
  },
] as const;

export const blogData = [
  {
    title: "Building Multi-Tenant SaaS Applications with Laravel",
    excerpt: "A comprehensive guide to implementing multi-tenancy in Laravel, covering tenant isolation, database strategies, and scaling considerations.",
    date: "2024-01-15",
    slug: "multi-tenant-saas-laravel",
  },
  {
    title: "Advanced Laravel Filament: Custom Components & Workflows",
    excerpt: "Explore advanced Filament techniques including custom form components, complex relationships, and automated workflows for enterprise applications.",
    date: "2024-01-02",
    slug: "advanced-laravel-filament",
  },
  {
    title: "Real-Time Features with Laravel Echo & WebSockets",
    excerpt: "Learn how to implement real-time notifications, live updates, and collaborative features using Laravel Echo, Pusher, and WebSockets.",
    date: "2023-12-20",
    slug: "laravel-echo-websockets",
  },
  {
    title: "Laravel Performance Optimization: From Queries to Caching",
    excerpt: "Master Laravel performance optimization techniques including query optimization, Redis caching, queue management, and Laravel Octane.",
    date: "2023-12-05",
    slug: "laravel-performance-optimization",
  },
  {
    title: "Building Scalable APIs with Laravel Sanctum & Passport",
    excerpt: "A deep dive into Laravel's authentication systems for APIs, comparing Sanctum and Passport for different use cases and scaling strategies.",
    date: "2023-11-18",
    slug: "laravel-api-authentication",
  },
  {
    title: "The Modern Laravel Stack: TALL + Inertia.js",
    excerpt: "Comparing and combining the TALL stack with Inertia.js for building modern, reactive web applications with Laravel backends.",
    date: "2023-11-01",
    slug: "modern-laravel-stack",
  },
] as const;

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
    type: "SaaS",
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
    title: "Enterprise E-Commerce Platform",
    type: "E-Commerce",
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
    title: "Advanced Admin Panel & CMS",
    type: "Admin Panel",
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
    title: "Real-Time Project Management Tool",
    type: "SaaS",
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
    title: "Financial Management System",
    type: "Internal Tool",
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
    title: "Learning Management System",
    type: "EdTech",
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

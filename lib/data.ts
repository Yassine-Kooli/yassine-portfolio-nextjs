import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact, FaCode } from "react-icons/fa";
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
    title: "Computer Science Degree",
    location: "Casablanca, Morocco",
    description:
      "I graduated with a Bachelor's degree in Computer Science, focusing on software engineering and web development with a strong foundation in PHP.",
    icon: React.createElement(LuGraduationCap),
    date: "2018",
  },
  {
    title: "Junior Laravel Developer",
    location: "Rabat, Morocco",
    description:
      "I started my career as a Laravel developer, building custom web applications and content management systems for various clients using Laravel and MySQL.",
    icon: React.createElement(FaCode),
    date: "2018 - 2020",
  },
  {
    title: "Laravel Developer",
    location: "Casablanca, Morocco",
    description:
      "I advanced to a mid-level Laravel developer role, working with Laravel, Livewire, and Alpine.js to build dynamic web applications with responsive interfaces.",
    icon: React.createElement(CgWorkAlt),
    date: "2020 - 2022",
  },
  {
    title: "Senior Laravel Developer",
    location: "Remote",
    description:
      "I'm now working as a senior Laravel developer specializing in Livewire, Filament, Alpine.js, and Tailwind CSS. I focus on building scalable, maintainable, and user-friendly web applications.",
    icon: React.createElement(FaReact),
    date: "2022 - present",
  },
] as const;

export const projectsData = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with product management, user authentication, cart functionality, and payment processing built with Laravel and Livewire.",
    tags: ["Laravel", "Livewire", "Alpine.js", "Tailwind CSS", "MySQL", "Stripe"],
    images: [
      "/images/project1.jpg",
      "/images/project1-2.jpg",
      "/images/project1-3.jpg",
      "/images/project1-4.jpg",
      "/images/project1-5.jpg",
    ],
    link: "https://github.com/yourusername/laravel-ecommerce",
  },
  {
    title: "Admin Dashboard System",
    description:
      "A comprehensive admin dashboard system built with Laravel Filament, featuring role-based access control, activity logging, and a beautiful UI for managing application data.",
    tags: ["Laravel", "Filament", "Tailwind CSS", "MySQL", "TALL Stack"],
    images: [
      "/images/project2.jpg",
      "/images/project2-2.jpg",
      "/images/project2-3.jpg",
      "/images/project2-4.jpg",
      "/images/project2-5.jpg",
    ],
    link: "https://github.com/yourusername/filament-admin",
  },
  {
    title: "Real Estate Management System",
    description:
      "A platform for real estate agencies to manage properties, clients, and transactions with a dynamic frontend built using Laravel, Livewire, and Alpine.js.",
    tags: ["Laravel", "Livewire", "Alpine.js", "Tailwind CSS", "MySQL"],
    images: [
      "/images/project3.jpg",
      "/images/project3-2.jpg",
      "/images/project3-3.jpg",
      "/images/project3-4.jpg",
      "/images/project3-5.jpg",
    ],
    link: "https://github.com/yourusername/laravel-real-estate",
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
  "Laravel Horizon",
  "Laravel Echo",
  "Laravel Telescope",
  "PHPUnit",
  "Pest PHP",
  "Git",
  "CI/CD",
  "Docker",
  "Redis",
  "REST API",
  "Inertia.js",
  "Vue.js",
  "TALL Stack",
] as const;

export const testimonialData = [
  {
    name: "Sarah Johnson",
    title: "CEO at TechStart",
    text: "Yassine delivered an exceptional website that perfectly captured our brand. His attention to detail and technical expertise are outstanding.",
    image: "/images/testimonial1.jpg",
  },
  {
    name: "Ahmed Hassan",
    title: "Marketing Director",
    text: "Working with Yassine was a pleasure. He understood our requirements quickly and delivered a solution that exceeded our expectations.",
    image: "/images/testimonial2.jpg",
  },
  {
    name: "Maria Garcia",
    title: "Product Manager",
    text: "Yassine's technical skills and creativity make him a valuable asset to any project. He built our platform with scalability and performance in mind.",
    image: "/images/testimonial3.jpg",
  },
] as const;

export const blogData = [
  {
    title: "Building Dynamic UIs with Laravel Livewire",
    excerpt: "Learn how to create reactive interfaces without writing a single line of JavaScript using Laravel Livewire.",
    date: "2023-12-01",
    slug: "building-dynamic-uis-with-laravel-livewire",
  },
  {
    title: "Admin Panels Made Easy with Filament",
    excerpt: "Discover how Laravel Filament can help you build beautiful admin panels and CRUD interfaces in minutes.",
    date: "2023-11-15",
    slug: "admin-panels-made-easy-with-filament",
  },
  {
    title: "The TALL Stack: Laravel's Modern Frontend",
    excerpt: "A comprehensive guide to the TALL stack: Tailwind CSS, Alpine.js, Laravel, and Livewire for modern web applications.",
    date: "2023-10-20",
    slug: "tall-stack-laravels-modern-frontend",
  },
] as const;

"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import {
  SiPhp, SiLaravel, SiAlpinedotjs, SiTailwindcss, SiMysql,
  SiPostgresql, SiRedis, SiElasticsearch, SiHtml5, SiCss3,
  SiJavascript, SiGit, SiDocker, SiAmazonaws, SiGraphql,
  SiVuedotjs, SiReact, SiStripe, SiDigitalocean, SiTypescript,
  SiInertia, SiComposer,
} from "react-icons/si";
import { FaCode, FaDatabase, FaServer, FaCloud, FaTools } from "react-icons/fa";

const skillCategories = [
  {
    name: "Backend",
    icon: FaServer,
    color: "from-violet-500 to-purple-600",
    skills: [
      { name: "PHP", icon: SiPhp },
      { name: "Laravel", icon: SiLaravel },
      { name: "Livewire", icon: FaCode },
      { name: "Filament", icon: FaTools },
      { name: "REST API", icon: FaCode },
      { name: "WebSockets", icon: FaCode },
      { name: "Queue Jobs", icon: FaCode },
    ],
  },
  {
    name: "Frontend",
    icon: FaCode,
    color: "from-teal-500 to-cyan-600",
    skills: [
      { name: "Alpine.js", icon: SiAlpinedotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss3 },
      { name: "Vue.js", icon: SiVuedotjs },
      { name: "Inertia.js", icon: SiInertia },
    ],
  },
  {
    name: "Database",
    icon: FaDatabase,
    color: "from-blue-500 to-indigo-600",
    skills: [
      { name: "MySQL", icon: SiMysql },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Redis", icon: SiRedis },
      { name: "Elasticsearch", icon: SiElasticsearch },
      { name: "Eloquent ORM", icon: FaDatabase },
    ],
  },
  {
    name: "DevOps & Cloud",
    icon: FaCloud,
    color: "from-orange-500 to-amber-600",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "Docker", icon: SiDocker },
      { name: "AWS", icon: SiAmazonaws },
      { name: "DigitalOcean", icon: SiDigitalocean },
      { name: "CI/CD", icon: FaTools },
    ],
  },
  {
    name: "Integrations",
    icon: FaTools,
    color: "from-pink-500 to-rose-600",
    skills: [
      { name: "Stripe", icon: SiStripe },
      { name: "GraphQL", icon: SiGraphql },
      { name: "Spatie Pkgs", icon: SiComposer },
      { name: "Microservices", icon: FaServer },
      { name: "TDD / Pest", icon: FaCode },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const skillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView("Skills");

  return (
    <section id="skills" ref={ref} className="mb-28 max-w-[60rem] w-full scroll-mt-28 text-center sm:mb-40 px-4">
      <SectionHeading translationKey="skills.title" />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {skillCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.name}
              variants={cardVariants}
              className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-2xl p-5 text-left hover:shadow-lg hover:shadow-primary-100/40 dark:hover:shadow-primary-900/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}>
                  <CategoryIcon className="text-white text-base" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90 text-sm">{category.name}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => {
                  const SkillIcon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      custom={i}
                      variants={skillVariants}
                      className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 border border-black/5 dark:border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-white/80 hover:border-primary-300 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 cursor-default"
                    >
                      <SkillIcon className="text-sm flex-shrink-0" />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

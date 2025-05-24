"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>Featured Projects</SectionHeading>
      <p className="text-center text-gray-700 dark:text-white/70 mb-8 max-w-[42rem] mx-auto">
        Explore a diverse portfolio of Laravel applications I've built, from multi-tenant SaaS platforms
        to enterprise e-commerce solutions. Each project demonstrates advanced Laravel techniques,
        scalable architecture, and modern development practices.
      </p>
      <div>
        {projectsData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

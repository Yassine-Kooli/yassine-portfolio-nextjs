import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("@/components/three-background"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/custom-cursor"), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <ThreeBackground />
      <CustomCursor />
      <Intro />
      <SectionDivider />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}

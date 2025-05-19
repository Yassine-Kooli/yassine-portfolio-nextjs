import About from "@/components/about";
import Contact from "@/components/contact";
import CustomCursor from "@/components/custom-cursor";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import ThreeBackground from "@/components/three-background";

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

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import {
  getHomepageProjects,
  getLatestPublishedProjectId,
} from "@/lib/projects/queries";
import { getSiteSettings } from "@/lib/site-settings";
import { PricingSection } from "@/components/sections/pricing-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  const [projects, latestProjectId] = await Promise.all([
    getHomepageProjects(settings.homepageProjectLimit),

    getLatestPublishedProjectId(),
  ]);

  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <ProjectsSection
          projects={projects}
          latestProjectId={latestProjectId}
        />

        <PricingSection />

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}

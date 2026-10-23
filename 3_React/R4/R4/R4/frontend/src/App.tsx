import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScrollSpy } from './hooks/useScrollSpy';
import { usePortfolioData } from './hooks/usePortfolioData';
import { useSpotlight } from './hooks/useSpotlight';
import type { Project } from './types/portfolio';

// Components
import { Navbar } from './components/Navbar';
import { SpotlightSearch } from './components/SpotlightSearch';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AchievementsSection } from './components/AchievementsSection';
import { GuestbookSection } from './components/GuestbookSection';
import { ContactSection } from './components/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { Footer } from './components/Footer';

const sectionIds = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'achievements',
  'guestbook',
  'contact'
];

export function App() {
  const { isDark, toggleTheme } = useTheme();
  const { activeSection, scrollProgress, scrollToSection } = useScrollSpy(sectionIds);
  const { data, likeProject, addGuestbookEntry, submitContact } = usePortfolioData();
  const { isOpen: isSpotlightOpen, openSpotlight, closeSpotlight } = useSpotlight();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111315] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-500/20 selection:text-[#4285F4]">
      {/* Google-Styled Navbar */}
      <Navbar
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        scrollToSection={scrollToSection}
        isDark={isDark}
        toggleTheme={toggleTheme}
        openSpotlight={openSpotlight}
      />

      {/* Main Single Page Content */}
      <main className="relative">
        <HeroSection
          profile={data.profile}
          scrollToSection={scrollToSection}
        />

        <AboutSection
          profile={data.profile}
          scrollToSection={scrollToSection}
        />

        <SkillsSection
          skills={data.skills}
        />

        <ProjectsSection
          projects={data.projects}
          onSelectProject={(project) => setSelectedProject(project)}
          onLikeProject={likeProject}
        />

        <ExperienceTimeline
          experience={data.experience}
        />

        <AchievementsSection
          achievements={data.achievements}
        />

        <GuestbookSection
          entries={data.guestbook}
          onAddEntry={addGuestbookEntry}
        />

        <ContactSection
          profile={data.profile}
          onSubmitContact={submitContact}
        />
      </main>

      {/* Footer */}
      <Footer
        scrollToSection={scrollToSection}
        openSpotlight={openSpotlight}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onLike={likeProject}
      />

      {/* Google Spotlight Command Palette (Ctrl + K) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={closeSpotlight}
        data={data}
        scrollToSection={scrollToSection}
        onSelectProject={(project) => setSelectedProject(project)}
      />
    </div>
  );
}

export default App;

import React from 'react';
import { Hero } from '../components/home/Hero';
import { Stats } from '../components/home/Stats';
import { ServicesSection } from '../components/home/ServicesSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { ProcessSection } from '../components/home/ProcessSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LatestBlogSection } from '../components/home/LatestBlogSection';
import { QuoteCTA } from '../components/home/QuoteCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <WhyChooseUs />
      <QuoteCTA />
      <TestimonialsSection />
      <LatestBlogSection />
    </div>
  );
};

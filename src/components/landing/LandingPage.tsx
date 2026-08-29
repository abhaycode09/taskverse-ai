import React from 'react';
import { HeroSection } from './HeroSection';
import { FeatureGrid } from './FeatureGrid';
import { InteractivePreview } from './InteractivePreview';
import { TimelineSection } from './TimelineSection';
import { Testimonials } from './Testimonials';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { Footer } from './Footer';
import { useTaskStore } from '../../store/useTaskStore';

export const LandingPage: React.FC = () => {
  const { setActivePage, setIsAuthModalOpen } = useTaskStore();

  const handleGetStarted = () => {
    setActivePage('dashboard');
  };

  const handleExploreDemo = () => {
    setActivePage('dashboard');
  };

  const handleSelectPlan = (plan: string) => {
    setActivePage('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} onExploreDemo={handleExploreDemo} />
      <FeatureGrid />
      <InteractivePreview onGoToApp={handleGetStarted} />
      <TimelineSection />
      <Testimonials />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <FAQSection />
      <Footer />
    </div>
  );
};

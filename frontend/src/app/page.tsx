import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { DataFlowSection } from '@/components/landing/DataFlowSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { MapPreviewSection } from '@/components/landing/MapPreviewSection';
import { TechnologySection } from '@/components/landing/TechnologySection';
import { TechImpactSection } from '@/components/landing/TechImpactSection';
import { CTASection } from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <HeroSection />

      {/* Visual Storytelling */}
      <ProblemSection />
      <DataFlowSection />

      {/* Core Product */}
      <FeaturesSection />
      <MapPreviewSection />

      {/* Proof & Impact */}
      <TechnologySection />
      <TechImpactSection />

      {/* Final Action */}
      <CTASection />

      <footer className="py-12 bg-[#020617] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8"></div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} AirLens AQI Intelligence. All rights reserved. Built for smarter cities.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Header from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { AdminOverview } from "@/components/landing/AdminOverview";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-pink-100">
      <Header title="Nailify" />

      <main>
        <Hero />
        <ProcessSection />
        <BentoFeatures />
        <AdminOverview />
      </main>
      <Footer />
    </div>
  );
}

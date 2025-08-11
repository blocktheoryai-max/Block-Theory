import Header from "@/components/header";
import Hero from "@/components/hero";
import LearnSection from "@/components/learn-section";
import SimulateSection from "@/components/simulate-section";
import AnalyzeSection from "@/components/analyze-section";
import CommunitySection from "@/components/community-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <LearnSection />
      <SimulateSection />
      <AnalyzeSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}

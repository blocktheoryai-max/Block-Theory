import Header from "@/components/header";
import Hero from "@/components/hero";
import LearnSection from "@/components/learn-section";
import SimulateSection from "@/components/simulate-section";
import NftSection from "@/components/nft-section";
import AnalyzeSection from "@/components/analyze-section";
import CommunitySection from "@/components/community-section";
import CryptocurrencySection from "@/components/cryptocurrency-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <LearnSection />
      <SimulateSection />
      <NftSection />
      <CryptocurrencySection />
      <AnalyzeSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}

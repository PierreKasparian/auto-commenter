import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";

export default async function Home() {
  // if(process.env.NEXT_ENV === "development"){
  //   await fetch("https://auto-commenter.vercel.app/api/kw", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       account_id: "HYRdNXu7QpK1eBVPxT2Qlg"
  //     }),
  //   });}
    
  return(
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
)}
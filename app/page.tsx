import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  if(process.env.NEXT_ENV === "development"){
    // await fetch("http://localhost:3000/api/kw", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     account_id: "XSa0OZUISp-XvvZCmdCpog"
    //   }),
    // });
  // }
    // await fetch("http://localhost:3000/api/cron", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${process.env.CRON_SECRET}`,
    //   },
    //   // body: JSON.stringify({
    //   //   account_id: "XSa0OZUISp-XvvZCmdCpog"
    //   // }),
    // });
  }
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  return(
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar isDashboard={user.user !== null}/>
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
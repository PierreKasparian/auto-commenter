import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  if(process.env.NEXT_ENV === "development"){
//     await fetch("http://localhost:3000/api/post-comment", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
//       },
//       body: JSON.stringify({
//         id: 356,
//         post_id: "urn:li:activity:7337746528612077570",
//         unipile_id: "xH9knahXS82M36FODsMr7Q",
//         comment: "Merci pour ce partage, c’est exactement ce dont beaucoup de freelances ont besoin pour se démarquer ! La visibilité, c’est vraiment la clé aujourd’hui.",
//         post_text: `🚨 Le problème, ce n’est pas ton offre.
// C’est que personne ne la voit.

// Tu es freelance, tu bosses bien, tu délivres…
// Mais les clients ne viennent pas.

// 📉 Tu postes sur LinkedIn = peu d'engagement
// 📉 Tu es sur Google = invisible en 5e page
// 📉 Tu es sur Malt = noyé dans la masse

// 🎙️ Dans cette vidéo, Emmanuel Bismuth – ceinture noire du SEO Malt & LinkedIn – te donne les clés pour enfin attirer des clients.
// Pas avec des hacks bidons.
// Avec une vraie compréhension de ce que veulent tes prospects.

// 💡 Tu vas apprendre :

// Pourquoi 90 % des freelances parlent à côté de leur cible

// Ce que les clients cherchent vraiment avant de signer

// Comment te rendre visible au bon endroit, au bon moment (LinkedIn + Google = combo magique)

// 🔥 Et bien sûr, ses deux ressources incontournables :
// ➡️ La Bible Malt : https://lnkd.in/gHRPUhy2
// ➡️ La Bible LinkedIn : https://lnkd.in/gW5XAva5

// 📎 Vidéo ici : https://lnkd.in/gU-TccaN

// 🧠 Être bon ne suffit plus.
// Il faut être visible, crédible, et mémorable.

// #freelance #client #prospection #linkedin #google #seo #visibilité #biblemalt #biblelinkedin #consultant #missionfreelance`,
//       }),
//     });
  
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
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Audience from "@/components/Audience";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paraflow-black">
      <Header />
      <Hero />
      <Features />
      <Workflow />
      <Audience />
      <CTA />
      <Footer />
    </main>
  );
}

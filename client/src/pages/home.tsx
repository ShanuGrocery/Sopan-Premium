import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import BookingSection from "@/components/booking-section";
import ReportsSection from "@/components/reports-section";
import AccreditationsSection from "@/components/accreditations-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <BookingSection />
      <ReportsSection />
      <AccreditationsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

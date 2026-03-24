import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import ReservationsSection from "@/components/ReservationsSection";
import ContactSection from "@/components/ContactSection";
import PaymentsSection from "@/components/PaymentsSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <MenuSection />
    <AboutSection />
    <GallerySection />
    <ReviewsSection />
    <ReservationsSection />
    <ContactSection />
    <PaymentsSection />
    <Footer />
    <Chatbot />
  </div>
);

export default Index;

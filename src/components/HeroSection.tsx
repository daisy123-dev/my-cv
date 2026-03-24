import { motion } from "framer-motion";
import { Clock, Flame, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Clock, label: "Open 24 Hours" },
  { icon: Flame, label: "Bar & Grill" },
  { icon: Car, label: "Car Wash & Parking" },
];

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Elparaiso Garden Kisii bar and grill" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Welcome to</p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold gold-text mb-6">
            Elparaiso Garden
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 font-body mb-2">Kisii, Kenya</p>
          <p className="text-xl md:text-2xl text-foreground/80 font-heading italic mb-10">
            "Where great food meets unforgettable vibes"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="gold" size="lg" onClick={() => scrollTo("#menu")} className="text-base px-8">
              View Menu
            </Button>
            <Button variant="goldOutline" size="lg" onClick={() => scrollTo("#reservations")} className="text-base px-8">
              Book a Table
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3 glass-card px-6 py-3 rounded-full">
              <f.icon className="text-primary" size={20} />
              <span className="text-sm font-body text-foreground/80">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

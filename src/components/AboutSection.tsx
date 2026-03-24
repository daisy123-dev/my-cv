import { motion } from "framer-motion";
import { Clock, Car, Music, Users } from "lucide-react";
import ambianceImg from "@/assets/ambiance-1.jpg";

const highlights = [
  { icon: Clock, title: "24-Hour Service", desc: "We never close. Day or night, Elparaiso is ready for you." },
  { icon: Car, title: "Car Wash & Parking", desc: "Get your car washed while you dine. Secure parking available." },
  { icon: Music, title: "Live Music & DJs", desc: "Enjoy curated playlists, live bands, and DJ sets every weekend." },
  { icon: Users, title: "Events & Parties", desc: "Perfect venue for birthdays, corporate events, and group hangs." },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">About Us</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold gold-text mb-6">
            More Than Just a Restaurant
          </h2>
          <p className="text-foreground/70 mb-4 leading-relaxed">
            Elparaiso Garden Kisii is the ultimate social destination in Kisii, Kenya. We blend great food,
            cold drinks, and unforgettable vibes into one seamless experience. Whether you're here for a
            casual lunch, an evening out with friends, or a late-night party, we've got you covered — 24 hours a day.
          </p>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            Our garden setting provides the perfect ambiance for every occasion. Enjoy our premium nyama choma
            fresh off the grill, sip on expertly crafted cocktails, and let the music set the mood.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-primary/10">
                  <h.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-1">{h.title}</h4>
                  <p className="text-xs text-muted-foreground">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src={ambianceImg}
            alt="Elparaiso Garden ambiance"
            className="rounded-2xl w-full object-cover aspect-[4/5] gold-glow"
            loading="lazy"
            width={800}
            height={800}
          />
          <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-5 gold-border border">
            <p className="text-3xl font-heading font-bold gold-text">24/7</p>
            <p className="text-xs text-muted-foreground">Always Open</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;

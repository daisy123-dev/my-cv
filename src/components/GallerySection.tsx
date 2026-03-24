import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import drinks1 from "@/assets/drinks-1.jpg";
import ambiance1 from "@/assets/ambiance-1.jpg";
import nightlife1 from "@/assets/nightlife-1.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const images = [
  { src: food1, alt: "Grilled meat platter", category: "Food" },
  { src: drinks1, alt: "Craft cocktails", category: "Drinks" },
  { src: ambiance1, alt: "Garden ambiance", category: "Environment" },
  { src: nightlife1, alt: "Nightlife party", category: "Nightlife" },
  { src: food2, alt: "Chicken wings", category: "Food" },
  { src: heroBg, alt: "Bar and grill counter", category: "Environment" },
];

const GallerySection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Gallery</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold gold-text mb-4">Experience the Vibe</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
              onClick={() => setSelected(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/50 transition-colors duration-300 flex items-end p-4">
                <span className="text-foreground font-body text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  {img.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors" onClick={() => setSelected(null)}>
                <X size={32} />
              </button>
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={images[selected].src}
                alt={images[selected].alt}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;

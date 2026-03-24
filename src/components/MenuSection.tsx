import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type MenuItem = {
  name: string;
  description: string;
  price: number;
  popular?: boolean;
};

type Category = {
  name: string;
  items: MenuItem[];
};

const menuData: Category[] = [
  {
    name: "Grills",
    items: [
      { name: "Nyama Choma (500g)", description: "Premium charcoal-grilled goat meat served with ugali and kachumbari", price: 800, popular: true },
      { name: "Beef Ribs", description: "Slow-smoked beef ribs with our signature BBQ glaze", price: 950 },
      { name: "Grilled Tilapia", description: "Whole tilapia grilled to perfection with lemon herb butter", price: 700, popular: true },
      { name: "Chicken Quarter", description: "Flame-grilled chicken quarter with pilau rice", price: 600 },
      { name: "Mixed Grill Platter", description: "Assorted grilled meats for sharing, serves 2-3", price: 2500 },
      { name: "Pork Chops", description: "Juicy pork chops with mushroom sauce and mashed potatoes", price: 750 },
    ],
  },
  {
    name: "Drinks",
    items: [
      { name: "Tusker Lager", description: "Kenya's finest premium lager, ice cold", price: 250 },
      { name: "Dawa Cocktail", description: "Kenyan classic with vodka, lime, and honey", price: 450, popular: true },
      { name: "Passion Fruit Mojito", description: "Fresh passion fruit with rum, mint and lime", price: 500 },
      { name: "House Wine (Glass)", description: "Red or white, selected premium varietals", price: 400 },
      { name: "Whiskey (Double)", description: "Jameson, Jack Daniels, or Johnnie Walker", price: 600 },
      { name: "Fresh Juice", description: "Mango, passion, watermelon or mixed", price: 200 },
    ],
  },
  {
    name: "Quick Bites",
    items: [
      { name: "Loaded Fries", description: "Crispy fries topped with cheese, bacon and jalapeños", price: 350 },
      { name: "Chicken Wings (6pc)", description: "Spicy or BBQ glazed wings with dipping sauce", price: 500, popular: true },
      { name: "Samosas (4pc)", description: "Crispy pastries filled with spiced beef", price: 200 },
      { name: "Fish Fingers", description: "Golden fried fish strips with tartar sauce", price: 400 },
      { name: "Smokies & Kachumbari", description: "Grilled smokies with fresh tomato salsa", price: 250 },
      { name: "Chips Masala", description: "Seasoned fries tossed in masala spices", price: 300 },
    ],
  },
];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="menu" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Menu</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold gold-text mb-4">Taste the Best</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From sizzling nyama choma to refreshing cocktails, every dish is crafted with passion.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {menuData.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`px-6 py-2 rounded-full font-body text-sm transition-all ${
                activeCategory === i
                  ? "gold-gradient text-primary-foreground font-semibold"
                  : "glass-card text-foreground/70 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
        >
          {menuData[activeCategory].items.map((item) => (
            <div
              key={item.name}
              className="glass-card rounded-lg p-5 flex justify-between items-start gap-4 hover:gold-glow transition-shadow duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                  {item.popular && (
                    <span className="text-[10px] uppercase tracking-wider gold-gradient text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-primary font-heading text-lg font-semibold">KES {item.price}</span>
                <Button variant="goldOutline" size="sm" className="text-xs">
                  Order Now
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;

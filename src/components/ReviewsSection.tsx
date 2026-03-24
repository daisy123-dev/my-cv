import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  { name: "Brian K.", rating: 5, comment: "Best nyama choma in Kisii! The ambiance is incredible — perfect for a night out with friends.", date: "2 weeks ago" },
  { name: "Mary W.", rating: 4, comment: "Love the 24-hour service. Great cocktails and the garden setting is beautiful. Will definitely come back!", date: "1 month ago" },
  { name: "James O.", rating: 4, comment: "The mixed grill platter is amazing. Music was a bit loud but overall a fantastic experience.", date: "3 weeks ago" },
  { name: "Sarah N.", rating: 5, comment: "Had my birthday party here and it was incredible! The staff went above and beyond. Highly recommend.", date: "1 month ago" },
  { name: "David M.", rating: 4, comment: "Good food, great drinks, excellent vibes. The car wash while dining is a nice touch!", date: "2 months ago" },
  { name: "Angela T.", rating: 3, comment: "Food was delicious but service could be a bit faster during peak hours. The Dawa cocktail is a must-try though!", date: "1 month ago" },
];

const overallRating = 4.1;

const ReviewsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 5, comment: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ name: "", rating: 5, comment: "" });
  };

  return (
    <section id="reviews" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Reviews</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold gold-text mb-4">What Our Guests Say</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={24} className={s <= Math.round(overallRating) ? "text-primary fill-primary" : "text-muted-foreground"} />
            ))}
            <span className="text-foreground font-heading text-2xl ml-2">{overallRating}</span>
          </div>
          <p className="text-muted-foreground text-sm">Based on {reviews.length} reviews</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= r.rating ? "text-primary fill-primary" : "text-muted-foreground"} />
                ))}
              </div>
              <p className="text-foreground/80 text-sm mb-4 leading-relaxed">"{r.comment}"</p>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-semibold text-sm">{r.name}</span>
                <span className="text-muted-foreground text-xs">{r.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="goldOutline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Leave a Review"}
          </Button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-6 max-w-md mx-auto mt-8 space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: s })}
                >
                  <Star size={24} className={s <= formData.rating ? "text-primary fill-primary" : "text-muted-foreground"} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              required
            />
            <Button type="submit" variant="gold" className="w-full">Submit Review</Button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;

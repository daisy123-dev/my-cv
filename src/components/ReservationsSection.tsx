import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Clock, Phone, User } from "lucide-react";

const ReservationsSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="reservations" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Reservations</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold gold-text mb-4">Book a Table</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Reserve your spot and enjoy a seamless dining experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          {submitted ? (
            <div className="glass-card rounded-xl p-8 text-center gold-glow">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="text-primary-foreground" size={28} />
              </div>
              <h3 className="font-heading text-2xl font-bold gold-text mb-2">Reservation Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you, {form.name}. We've reserved a table for {form.guests} guests on {form.date} at {form.time}.
              </p>
              <p className="text-sm text-muted-foreground mb-6">We'll send a confirmation to your phone.</p>
              <Button variant="goldOutline" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", date: "", time: "", guests: "2" }); }}>
                Make Another Reservation
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full">
                Reserve Table
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationsSection;

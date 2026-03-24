import { motion } from "framer-motion";
import { CreditCard, Smartphone } from "lucide-react";

const PaymentsSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-8 md:p-12 text-center gold-glow"
      >
        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Payments</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold gold-text mb-4">Easy Payment Options</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We accept multiple payment methods for your convenience.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="glass-card rounded-xl px-8 py-6 flex flex-col items-center gap-3 min-w-[160px]">
            <Smartphone className="text-primary" size={32} />
            <span className="font-heading text-lg font-semibold text-foreground">M-Pesa</span>
            <span className="text-xs text-muted-foreground">Instant mobile payments</span>
          </div>
          <div className="glass-card rounded-xl px-8 py-6 flex flex-col items-center gap-3 min-w-[160px]">
            <CreditCard className="text-primary" size={32} />
            <span className="font-heading text-lg font-semibold text-foreground">Card</span>
            <span className="text-xs text-muted-foreground">Visa, Mastercard accepted</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PaymentsSection;

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-heading text-xl gold-text font-bold mb-1">Elparaiso Garden Kisii</h3>
          <p className="text-sm text-muted-foreground">Where great food meets unforgettable vibes</p>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="tel:+254700000000" className="hover:text-primary transition-colors">Call Us</a>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Elparaiso Garden Kisii. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'About Us', to: '/about' },
  ];

  const categoryLinks = [
    { label: 'Vegetables', to: '/marketplace' },
    { label: 'Grains', to: '/marketplace' },
    { label: 'Fruits', to: '/marketplace' },
    { label: 'Leafy Greens', to: '/marketplace' },
    { label: 'Pulses', to: '/marketplace' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold">AgriLink</span>
                <p className="text-xs text-primary-foreground/70">From Soil to Sale</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Connecting farmers to markets with fair prices and quality assurance.
              Building a sustainable agricultural ecosystem.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-secondary" />
                <span className="text-sm text-primary-foreground/80">
                  123 Krishi Road, Farmgate, Dhaka - 1215, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-secondary" />
                <span className="text-sm text-primary-foreground/80">+880 1800-123-456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-secondary" />
                <span className="text-sm text-primary-foreground/80">support@agrilink.com.bd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} AgriLink. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-primary-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-serif font-bold text-foreground">Terms of Service</h1>
        </div>
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using AgriLink, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">2. User Accounts</h2>
          <p>Users must register with accurate information. Farmers must provide valid farm details. You are responsible for maintaining the security of your account credentials.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">3. Marketplace Rules</h2>
          <p>Farmers must list products accurately including quality grade, pricing, and availability. Buyers agree to pay for products they order. All transactions are processed securely through our payment system.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">4. Pricing & Payments</h2>
          <p>Prices are listed in Bangladeshi Taka (৳). Wholesale pricing is available for orders meeting minimum quantity requirements. Delivery charges apply for orders below ৳2,000.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">5. Delivery & Returns</h2>
          <p>AgriLink facilitates delivery between farmers and buyers. Fresh produce is perishable; returns are handled on a case-by-case basis. Contact our support team within 24 hours of delivery for quality issues.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>AgriLink serves as a marketplace platform. We are not responsible for the quality of individual products but work to maintain standards through our quality grading system.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">7. Contact</h2>
          <p>For questions about these terms, contact support@agrilink.com.bd.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

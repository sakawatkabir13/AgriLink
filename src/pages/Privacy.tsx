import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-serif font-bold text-foreground">Privacy Policy</h1>
        </div>
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2 className="text-xl font-serif font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, including your name, email, phone number, and for farmers, farm-related details such as location, farm size, and crops grown.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>Your information is used to facilitate transactions between farmers and buyers, provide market insights, send demand alerts, and improve our platform services.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your personal data. All data is encrypted in transit and at rest. We use row-level security policies to ensure users can only access their own data.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">4. Sharing of Information</h2>
          <p>We do not sell your personal data. Product listings are publicly visible to enable marketplace functionality. Order information is shared only between the relevant buyer and farmer.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at support@agrilink.com.bd.</p>

          <h2 className="text-xl font-serif font-semibold text-foreground">6. Contact</h2>
          <p>For privacy-related inquiries, contact us at support@agrilink.com.bd or call +880 1800-123-456.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

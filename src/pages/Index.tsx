import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products as staticProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import heroImage from '@/assets/hero-farm.jpg';

const features = [
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Every product undergoes strict quality checks before reaching you.',
  },
  {
    icon: TrendingUp,
    title: 'Fair Pricing',
    description: 'We ensure farmers get fair prices while offering competitive rates.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Region-based delivery ensures freshness reaches your doorstep.',
  },
  {
    icon: Users,
    title: 'Direct Sourcing',
    description: 'We procure directly from farmers, eliminating middlemen.',
  },
];

const stats = [
  { value: '500+', label: 'Farmers Connected' },
  { value: '10K+', label: 'Orders Delivered' },
  { value: '50+', label: 'Crop Varieties' },
  { value: '15+', label: 'Regions Covered' },
];

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(staticProducts.slice(0, 3));

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('approval_status', 'approved')
        .limit(3);
      if (data && data.length > 0) {
        setFeaturedProducts(data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image_url || '/placeholder.svg',
          retailPrice: Number(p.retail_price),
          wholesalePrice: Number(p.wholesale_price),
          minWholesaleQty: p.min_wholesale_qty,
          unit: p.unit,
          quantityAvailable: p.quantity_available,
          qualityGrade: p.quality_grade as 'A' | 'B' | 'C',
          region: p.region,
          freshnessdays: p.freshness_days,
          description: p.description || '',
        })));
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-2 animate-fade-in">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur-sm">
                🌱 Fresh from the farm
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              From Soil to Sale,{' '}
              <span className="text-secondary">Quality</span> at Every Step
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              AgriLink connects quality farm produce directly to your business. 
              Fair prices for farmers, fresh products for you.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/marketplace">
                <Button variant="accent" size="xl" className="gap-2">
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline-light" size="xl">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-card/95 backdrop-blur-md border-t border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <p className="text-3xl md:text-4xl font-serif font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background pattern-dots">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Building Trust from Farm to Table
            </h2>
            <p className="text-muted-foreground mt-4">
              We bridge the gap between farmers and buyers with transparency, 
              quality assurance, and fair trade practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 warm-gradient">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                Fresh Picks
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked selection of our finest farm produce
              </p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline" className="gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground">
              Ready to Source Fresh Produce?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of buyers who trust AgriLink for quality agricultural products. 
              Whether you need retail quantities or wholesale bulk orders, we've got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/register">
                <Button variant="accent" size="xl" className="gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline-light" size="xl">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Leaf, Users, Truck, Shield, TrendingUp, Heart } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Farmer First',
    description: 'We prioritize fair compensation for farmers, ensuring they receive the value their hard work deserves.',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Every product undergoes rigorous quality checks before reaching our marketplace.',
  },
  {
    icon: TrendingUp,
    title: 'Transparent Pricing',
    description: 'Clear pricing without hidden fees. What you see is what you pay.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    description: 'Region-optimized logistics ensure your produce arrives fresh and on time.',
  },
];

const timeline = [
  { year: '2020', title: 'Founded', description: 'AgriLink was born with a mission to connect farmers directly to buyers.' },
  { year: '2021', title: 'First 100 Farmers', description: 'Onboarded farmers from 5 states, building our procurement network.' },
  { year: '2022', title: 'Marketplace Launch', description: 'Launched our digital marketplace for seamless buyer experience.' },
  { year: '2023', title: '10K Orders', description: 'Crossed 10,000 successful orders, serving buyers across India.' },
  { year: '2024', title: 'Growing Strong', description: '500+ farmers, 50+ crop varieties, and counting.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="hero-gradient py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
              From Soil to Sale
            </h1>
            <p className="text-xl text-primary-foreground/80 mt-6 leading-relaxed">
              AgriLink bridges the gap between hardworking farmers and discerning buyers, 
              creating a sustainable agricultural ecosystem built on trust and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
                Empowering Agriculture Through Technology
              </h2>
              <p className="text-muted-foreground mt-6 leading-relaxed">
                AgriLink is not just a marketplace—it's a movement to transform how 
                agricultural products reach consumers. We work directly with farmers, 
                eliminating middlemen to ensure fair prices and fresh produce.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Our platform handles everything from procurement to quality control, 
                inventory management to logistics, creating a seamless experience 
                for both farmers and buyers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-4xl font-serif font-bold text-primary">500+</p>
                <p className="text-muted-foreground mt-1">Farmers Connected</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                <p className="text-4xl font-serif font-bold text-secondary">50+</p>
                <p className="text-muted-foreground mt-1">Crop Varieties</p>
              </div>
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20">
                <p className="text-4xl font-serif font-bold text-accent">15+</p>
                <p className="text-muted-foreground mt-1">Regions Covered</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-4xl font-serif font-bold text-primary">10K+</p>
                <p className="text-muted-foreground mt-1">Orders Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 warm-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              >
                <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Building AgriLink
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-sm text-primary font-medium">{item.year}</p>
                  <h3 className="text-xl font-serif font-semibold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

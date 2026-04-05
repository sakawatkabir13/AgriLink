import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AIChatbot } from '@/components/AIChatbot';
import { categories } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('approval_status', 'approved');

      if (!error && data) {
        setProducts(data.map((p) => ({
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
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = product.retailPrice < 40;
    else if (priceRange === 'mid') matchesPrice = product.retailPrice >= 40 && product.retailPrice < 80;
    else if (priceRange === 'high') matchesPrice = product.retailPrice >= 80;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || priceRange !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground">
              Fresh Farm Produce
            </h1>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              Browse our selection of quality-assured crops sourced directly from local farmers.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11" />
            </div>
            <Button variant="outline" className="md:hidden gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
            </Button>
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <Button key={category} variant={selectedCategory === category ? 'default' : 'ghost'} size="sm" onClick={() => setSelectedCategory(category)} className="whitespace-nowrap">
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {showFilters && (
            <div className="md:hidden mt-4 p-4 rounded-xl bg-muted animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Filters</span>
                {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} variant={selectedCategory === category ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setSelectedCategory(category)}>{category}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ value: 'all', label: 'All' }, { value: 'low', label: 'Under ৳40' }, { value: 'mid', label: '৳40 - ৳80' }, { value: 'high', label: 'Above ৳80' }].map((range) => (
                      <Badge key={range.value} variant={priceRange === range.value ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setPriceRange(range.value as typeof priceRange)}>{range.label}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory !== 'All' && (
                <Badge variant="secondary" className="gap-1">{selectedCategory}<X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} /></Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">{priceRange === 'low' ? 'Under ৳40' : priceRange === 'mid' ? '৳40-৳80' : 'Above ৳80'}<X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('all')} /></Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-serif text-foreground mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <AIChatbot />
      <Footer />
    </div>
  );
}

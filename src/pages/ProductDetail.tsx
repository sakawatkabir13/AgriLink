import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, MapPin, Clock, Minus, Plus, Check, Star, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProduct({
          id: data.id,
          name: data.name,
          category: data.category,
          image: data.image_url || '/placeholder.svg',
          retailPrice: Number(data.retail_price),
          wholesalePrice: Number(data.wholesale_price),
          minWholesaleQty: data.min_wholesale_qty,
          unit: data.unit,
          quantityAvailable: data.quantity_available,
          qualityGrade: data.quality_grade as 'A' | 'B' | 'C',
          region: data.region,
          freshnessdays: data.freshness_days,
          description: data.description || '',
        });
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">Product not found</h1>
          <Link to="/marketplace"><Button>Back to Marketplace</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const canUseWholesale = quantity >= product.minWholesaleQty;

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(product.quantityAvailable, quantity + delta));
    setQuantity(newQty);
    if (newQty < product.minWholesaleQty && isWholesale) setIsWholesale(false);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, isWholesale && canUseWholesale);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge variant="success" className="text-sm">Grade {product.qualityGrade}</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{product.category}</span><span>•</span><span>{product.region}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'text-accent fill-accent' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.0) • 128 reviews</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Package className="w-5 h-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Stock</p><p className="font-semibold">{product.quantityAvailable} {product.unit}</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Clock className="w-5 h-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Fresh for</p><p className="font-semibold">{product.freshnessdays} days</p></div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 col-span-2">
                <MapPin className="w-5 h-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Sourced from</p><p className="font-semibold">{product.region} Farms</p></div>
              </div>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-3">
                  <button onClick={() => setIsWholesale(false)} className={`flex-1 p-4 rounded-xl border-2 transition-all ${!isWholesale ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                    <p className="text-sm text-muted-foreground">Retail Price</p>
                    <p className="text-2xl font-bold text-foreground">৳{product.retailPrice}<span className="text-sm font-normal text-muted-foreground">/{product.unit}</span></p>
                  </button>
                  <button onClick={() => canUseWholesale && setIsWholesale(true)} disabled={!canUseWholesale} className={`flex-1 p-4 rounded-xl border-2 transition-all ${isWholesale ? 'border-primary bg-primary/5' : canUseWholesale ? 'border-border hover:border-primary/30' : 'border-border opacity-50 cursor-not-allowed'}`}>
                    <p className="text-sm text-muted-foreground">Wholesale Price</p>
                    <p className="text-2xl font-bold text-primary">৳{product.wholesalePrice}<span className="text-sm font-normal text-muted-foreground">/{product.unit}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Min: {product.minWholesaleQty} {product.unit}</p>
                  </button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quantity ({product.unit})</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                      <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 hover:bg-muted disabled:opacity-50 transition-colors"><Minus className="w-5 h-5" /></button>
                      <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                      <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantityAvailable} className="p-3 hover:bg-muted disabled:opacity-50 transition-colors"><Plus className="w-5 h-5" /></button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-xl font-bold">৳{(currentPrice * quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  {!canUseWholesale && quantity > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">Add {product.minWholesaleQty - quantity} more for wholesale pricing</p>
                  )}
                </div>

                <Button variant={addedToCart ? 'default' : 'hero'} size="xl" className="w-full gap-2" onClick={handleAddToCart} disabled={addedToCart}>
                  {addedToCart ? (<><Check className="w-5 h-5" /> Added to Cart!</>) : (<><ShoppingCart className="w-5 h-5" /> Add to Cart</>)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

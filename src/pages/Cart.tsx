import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Truck, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const deliveryCharge = subtotal > 2000 ? 0 : 150;
  const total = subtotal + deliveryCharge;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      return;
    }
    setCheckoutLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          unitPrice: item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice,
          quantity: item.quantity,
          isWholesale: item.isWholesale,
          unit: item.product.unit,
          region: item.product.region,
        })),
        deliveryCharge,
        region: items[0]?.product.region || 'Dhaka',
      };

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: payload,
      });

      if (error) throw error;
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e: any) {
      toast.error(e.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products yet. Browse our marketplace to find fresh farm produce.
            </p>
            <Link to="/marketplace">
              <Button variant="hero" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue shopping
            </Link>
            <h1 className="text-3xl font-serif font-bold">Shopping Cart</h1>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.isWholesale
                ? item.product.wholesalePrice
                : item.product.retailPrice;

              return (
                <Card key={item.product.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link to={`/product/${item.product.id}`} className="shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${item.product.id}`}
                              className="font-serif font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.product.region}
                            </p>
                            {item.isWholesale && (
                              <Badge variant="wholesale" className="mt-1">
                                Wholesale
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.quantityAvailable}
                              className="p-2 hover:bg-muted disabled:opacity-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              ৳{price} × {item.quantity} {item.product.unit}
                            </p>
                            <p className="text-lg font-bold">
                              ৳{(price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-serif font-semibold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Delivery
                    </span>
                    <span className="font-medium">
                      {deliveryCharge === 0 ? (
                        <span className="text-primary">FREE</span>
                      ) : (
                        `৳${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders above ৳2,000
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by AgriLink
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

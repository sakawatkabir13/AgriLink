import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const statusVariant = (s: string) => {
  const map: Record<string, 'default' | 'secondary' | 'success' | 'destructive' | 'accent' | 'wholesale'> = {
    pending: 'secondary', paid: 'accent', dispatched: 'wholesale', delivered: 'success', cancelled: 'destructive',
  };
  return map[s] || 'default';
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/marketplace" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping to see your orders here.</p>
            <Link to="/marketplace"><Button variant="hero" size="lg">Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusVariant(order.status)} className="capitalize">{order.status}</Badge>
                      <span className="text-lg font-bold">৳{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                          <img src={item.products?.image_url || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.products?.name || 'Product'}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ৳{Number(item.unit_price)}</p>
                        </div>
                        <p className="text-sm font-semibold">৳{(item.quantity * Number(item.unit_price)).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

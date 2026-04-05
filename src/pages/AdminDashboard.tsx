import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, Warehouse, Leaf, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'success' | 'destructive' | 'accent' | 'wholesale'> = {
    pending: 'secondary', paid: 'accent', dispatched: 'wholesale', delivered: 'success', cancelled: 'destructive',
  };
  return variants[status] || 'default';
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingProductId, setReviewingProductId] = useState<string | null>(null);
  const [reviewingFarmerId, setReviewingFarmerId] = useState<string | null>(null);

  const fetchData = async () => {
    const [ordersRes, productsRes, profilesRes, rolesRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('user_id, role'),
    ]);
    setOrders(ordersRes.data || []);
    setProducts(productsRes.data || []);
    setProfiles(profilesRes.data || []);
    setRoles(rolesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductReview = async (productId: string, status: 'approved' | 'rejected') => {
    setReviewingProductId(productId);
    const { error } = await supabase
      .from('products')
      .update({
        approval_status: status,
        is_active: status === 'approved',
      })
      .eq('id', productId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(status === 'approved' ? 'Product approved and published.' : 'Product rejected.');
      await fetchData();
    }
    setReviewingProductId(null);
  };

  const handleFarmerApproval = async (userId: string) => {
    setReviewingFarmerId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified_supplier: true })
      .eq('user_id', userId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Farmer approved successfully.');
      await fetchData();
    }
    setReviewingFarmerId(null);
  };

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
  const approvedProducts = products.filter((p) => p.approval_status === 'approved' && p.is_active);
  const pendingProducts = products.filter((p) => p.approval_status === 'pending');
  const farmerUserIds = new Set(roles.filter((r) => r.role === 'farmer').map((r) => r.user_id));
  const pendingFarmers = profiles.filter((p) => farmerUserIds.has(p.user_id) && !p.is_verified_supplier);

  const stats = [
    { title: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: TrendingUp },
    { title: 'Active Orders', value: String(activeOrders), icon: ShoppingCart },
    { title: 'Products Listed', value: String(approvedProducts.length), icon: Warehouse },
    { title: 'Registered Users', value: String(profiles.length), icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center"><Leaf className="w-6 h-6 text-primary-foreground" /></div>
                <span className="text-xl font-serif font-bold">Agri<span className="text-primary">Link</span></span>
              </Link>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <Link to="/"><Button variant="outline" size="sm">Exit Admin</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of AgriLink operations.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-serif">Pending Product Approvals</CardTitle>
                <Badge variant="secondary">{pendingProducts.length} pending</Badge>
              </CardHeader>
              <CardContent>
                {pendingProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No products are waiting for approval</p>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl bg-muted/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {p.category} • {p.region} • {p.quantity_available} {p.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">৳{Number(p.retail_price)}/{p.unit}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewingProductId === p.id}
                            onClick={() => handleProductReview(p.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            disabled={reviewingProductId === p.id}
                            onClick={() => handleProductReview(p.id, 'approved')}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-serif">Pending Farmer Approvals</CardTitle>
                <Badge variant="secondary">{pendingFarmers.length} pending</Badge>
              </CardHeader>
              <CardContent>
                {pendingFarmers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No farmer accounts are waiting for approval</p>
                ) : (
                  <div className="space-y-4">
                    {pendingFarmers.map((p) => (
                      <div key={p.user_id} className="p-4 rounded-xl bg-muted/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-medium">{p.full_name}</p>
                          <p className="text-sm text-muted-foreground">{p.email} • {p.region || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{p.farm_name || 'No farm name'} • {p.farm_size || 'No farm size'}</p>
                        </div>
                        <Button
                          size="sm"
                          disabled={reviewingFarmerId === p.user_id}
                          onClick={() => handleFarmerApproval(p.user_id)}
                        >
                          Approve Farmer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No orders yet</p>
                    ) : orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{Number(order.total_amount).toLocaleString()}</p>
                          <Badge variant={getStatusBadge(order.status)} className="capitalize">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-xl font-serif">Recent Products</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No products listed</p>
                    ) : approvedProducts.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Package className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">{p.category} • {p.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{Number(p.retail_price)}/{p.unit}</p>
                          <p className="text-xs text-muted-foreground">{p.quantity_available} available</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

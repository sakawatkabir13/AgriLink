import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Bell, Package, Wallet, Truck, BarChart3, ShieldCheck,
  MapPin, Leaf, Users, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Plus, Loader2, Trash2, ImagePlus, Sprout,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { regions } from '@/data/products';
import { AIChatbot } from '@/components/AIChatbot';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function FarmerDashboard() {
  const { user, profile, userRole, loading: authLoading } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [livePrices, setLivePrices] = useState<any[]>([]);
  const [demandAlerts, setDemandAlerts] = useState<any[]>([]);
  const [supplyHistory, setSupplyHistory] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [pickupOpen, setPickupOpen] = useState(false);
  const [pickupDetails, setPickupDetails] = useState({ address: '', date: '', notes: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Vegetables', retail_price: '', wholesale_price: '',
    min_wholesale_qty: '10', unit: 'kg', quantity_available: '', quality_grade: 'A',
    region: profile?.region || 'Dhaka', freshness_days: '7', description: '',
  });

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [pricesRes, alertsRes, historyRes, productsRes] = await Promise.all([
      supabase.from('market_prices').select('*').order('recorded_at', { ascending: false }),
      supabase.from('demand_alerts').select('*').eq('is_active', true),
      user ? supabase.from('supply_history').select('*').eq('farmer_id', user.id).order('delivered_at', { ascending: false }) : Promise.resolve({ data: [] }),
      user ? supabase.from('products').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    setLivePrices(pricesRes.data || []);
    setDemandAlerts(alertsRes.data || []);
    setSupplyHistory(historyRes.data || []);
    setMyProducts(productsRes.data || []);
    setLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    const ext = imageFile.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile);
    if (error) { toast.error('Image upload failed'); return null; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAddProduct = async () => {
    if (!user) return;
    setUploading(true);
    const imageUrl = await uploadImage();
    const { error } = await supabase.from('products').insert({
      farmer_id: user.id,
      name: newProduct.name,
      category: newProduct.category,
      retail_price: Number(newProduct.retail_price),
      wholesale_price: Number(newProduct.wholesale_price),
      min_wholesale_qty: Number(newProduct.min_wholesale_qty),
      unit: newProduct.unit,
      quantity_available: Number(newProduct.quantity_available),
      quality_grade: newProduct.quality_grade,
      region: newProduct.region,
      freshness_days: Number(newProduct.freshness_days),
      description: newProduct.description,
      image_url: imageUrl,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Product added!');
      setAddProductOpen(false);
      resetForm();
      fetchData();
    }
    setUploading(false);
  };

  const resetForm = () => {
    setNewProduct({ name: '', category: 'Vegetables', retail_price: '', wholesale_price: '', min_wholesale_qty: '10', unit: 'kg', quantity_available: '', quality_grade: 'A', region: profile?.region || 'Dhaka', freshness_days: '7', description: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Product removed'); fetchData(); }
  };

  const handleFulfillDemand = (alert: any) => {
    setNewProduct(p => ({ ...p, name: alert.crop_name, region: alert.region, quantity_available: String(alert.quantity_needed) }));
    setAddProductOpen(true);
    toast.info(`Pre-filled with ${alert.crop_name} demand for ${alert.region}`);
  };

  const handleRequestPickup = () => {
    toast.success('Pickup request submitted! Our logistics team will contact you shortly.');
    setPickupOpen(false);
    setPickupDetails({ address: '', date: '', notes: '' });
  };

  const filteredPrices = selectedRegion === 'All Regions' ? livePrices : livePrices.filter(p => p.region === selectedRegion);
  const totalEarned = supplyHistory.reduce((s, h) => s + Number(h.total_amount), 0);
  const pendingPayment = supplyHistory.filter(h => h.payment_status === 'pending').reduce((s, h) => s + Number(h.total_amount), 0);
  const paidAmount = supplyHistory.filter(h => h.payment_status === 'paid').reduce((s, h) => s + Number(h.total_amount), 0);

  // If user is not a farmer, show upgrade prompt
  if (!authLoading && userRole !== 'farmer') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl hero-gradient flex items-center justify-center mx-auto">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Want to Supply?</h1>
          <p className="text-muted-foreground text-lg">
            KrishokHub is exclusively for farmers. Upgrade your account to start selling your produce directly to buyers.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/upgrade-to-farmer">
              <Button variant="hero" size="lg" className="w-full gap-2">
                <Sprout className="w-5 h-5" /> Upgrade to Farmer Account
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg" className="w-full">Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold">Krishok<span className="text-accent">Hub</span></span>
                <span className="text-[10px] text-primary-foreground/70 -mt-1">by AgriLink</span>
              </div>
            </Link>
            <Badge className="bg-accent text-accent-foreground"><ShieldCheck className="w-3 h-3 mr-1" />Verified Farmer</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Welcome{profile?.full_name ? `, ${profile.full_name}` : ' to KrishokHub'}
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-6">Your all-in-one platform for live prices, instant buyer access, demand alerts, and logistics support.</p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2" onClick={() => setAddProductOpen(true)}><Plus className="w-4 h-4" />Add Product</Button>
                <Dialog open={pickupOpen} onOpenChange={setPickupOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"><Truck className="w-4 h-4" />Request Pickup</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Request Pickup</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div><label className="text-sm font-medium">Pickup Address</label><Input value={pickupDetails.address} onChange={e => setPickupDetails(p => ({ ...p, address: e.target.value }))} placeholder="Your farm address" /></div>
                      <div><label className="text-sm font-medium">Preferred Date</label><Input type="date" value={pickupDetails.date} onChange={e => setPickupDetails(p => ({ ...p, date: e.target.value }))} /></div>
                      <div><label className="text-sm font-medium">Notes</label><Input value={pickupDetails.notes} onChange={e => setPickupDetails(p => ({ ...p, notes: e.target.value }))} placeholder="Any special instructions..." /></div>
                      <Button onClick={handleRequestPickup} className="w-full" disabled={!pickupDetails.address}>Submit Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wallet, label: 'Total Earned', value: `৳${totalEarned.toLocaleString()}` },
                { icon: CheckCircle2, label: 'Supplies Done', value: supplyHistory.length },
                { icon: Package, label: 'My Products', value: myProducts.length },
                { icon: Users, label: 'Region', value: profile?.region || 'N/A' },
              ].map((s, i) => (
                <Card key={i} className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"><s.icon className="w-5 h-5 text-accent" /></div>
                      <div><p className="text-xs text-primary-foreground/70">{s.label}</p><p className="text-xl font-bold text-primary-foreground">{s.value}</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={(open) => { setAddProductOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium">Product Image</label>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageSelect} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </>
                )}
              </div>
            </div>
            <div><label className="text-sm font-medium">Product Name</label><Input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Fresh Tomatoes" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Category</label>
                <select className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                  {['Vegetables', 'Leafy Greens', 'Grains', 'Fruits', 'Pulses'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium">Region</label>
                <select className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm" value={newProduct.region} onChange={e => setNewProduct(p => ({ ...p, region: e.target.value }))}>
                  {regions.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Retail Price (৳)</label><Input type="number" value={newProduct.retail_price} onChange={e => setNewProduct(p => ({ ...p, retail_price: e.target.value }))} /></div>
              <div><label className="text-sm font-medium">Wholesale Price (৳)</label><Input type="number" value={newProduct.wholesale_price} onChange={e => setNewProduct(p => ({ ...p, wholesale_price: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium">Quantity</label><Input type="number" value={newProduct.quantity_available} onChange={e => setNewProduct(p => ({ ...p, quantity_available: e.target.value }))} /></div>
              <div><label className="text-sm font-medium">Unit</label>
                <select className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm" value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))}>
                  {['kg', 'ton', 'piece', 'dozen'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium">Grade</label>
                <select className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm" value={newProduct.quality_grade} onChange={e => setNewProduct(p => ({ ...p, quality_grade: e.target.value }))}>
                  {['A', 'B', 'C'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-sm font-medium">Description</label><Input value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." /></div>
            <Button onClick={handleAddProduct} className="w-full gap-2" disabled={!newProduct.name || !newProduct.retail_price || !newProduct.wholesale_price || uploading}>
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Add Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products" className="gap-2"><Package className="w-4 h-4" /><span className="hidden sm:inline">My Products</span></TabsTrigger>
            <TabsTrigger value="prices" className="gap-2"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Live Prices</span></TabsTrigger>
            <TabsTrigger value="demand" className="gap-2"><Bell className="w-4 h-4" /><span className="hidden sm:inline">Demand Alerts</span></TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><Truck className="w-4 h-4" /><span className="hidden sm:inline">Supply History</span></TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-serif font-bold">My Products</h2><p className="text-muted-foreground">Manage your product listings</p></div>
              <Button onClick={() => setAddProductOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : myProducts.length === 0 ? (
              <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground mb-4">You haven't listed any products yet.</p><Button onClick={() => setAddProductOpen(true)}>Add Your First Product</Button></CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    {p.image_url && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          <p className="text-sm text-muted-foreground">{p.category} • {p.region}</p>
                        </div>
                        <Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
                      </div>
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-primary">৳{Number(p.retail_price)}</span>
                        <span className="text-sm text-muted-foreground">/{p.unit}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{p.quantity_available} {p.unit} available • Grade {p.quality_grade}</p>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-3 h-3" /> Remove</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prices" className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-serif font-bold">Live Market Prices</h2><p className="text-muted-foreground">Real-time prices across all regions</p></div>
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="px-4 py-2 rounded-lg border border-border bg-card text-foreground">
                <option>All Regions</option>
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filteredPrices.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No price data available</CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrices.map((item) => (
                  <Card key={item.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div><h3 className="font-semibold text-foreground">{item.crop_name}</h3><p className="text-sm text-muted-foreground">{item.region} • per {item.unit}</p></div>
                        <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'} className="gap-1">
                          {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                          {Number(item.change_percent) > 0 ? '+' : ''}{Number(item.change_percent)}%
                        </Badge>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-serif font-bold text-primary">৳{Number(item.price_per_unit)}</span>
                        <span className="text-sm text-muted-foreground mb-1">/{item.unit}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="demand" className="space-y-6">
            <div><h2 className="text-2xl font-serif font-bold">Demand Alerts</h2><p className="text-muted-foreground">Know exactly what to supply, where, and when</p></div>
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : demandAlerts.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No active demand alerts</CardContent></Card>
            ) : (
              <div className="grid gap-4">
                {demandAlerts.map((alert) => (
                  <Card key={alert.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.urgency === 'high' ? 'bg-destructive/10' : alert.urgency === 'medium' ? 'bg-accent/20' : 'bg-muted'}`}>
                            <AlertCircle className={`w-6 h-6 ${alert.urgency === 'high' ? 'text-destructive' : alert.urgency === 'medium' ? 'text-accent' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{alert.crop_name}</h3>
                              <Badge variant={alert.urgency === 'high' ? 'destructive' : alert.urgency === 'medium' ? 'default' : 'secondary'}>{alert.urgency} demand</Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.region}</span>
                              <span className="flex items-center gap-1"><Package className="w-3 h-3" />{alert.quantity_needed} {alert.unit}</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{alert.buyer_count} buyers</span>
                            </div>
                            {alert.message && <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>}
                          </div>
                        </div>
                        <Button className="gap-2 shrink-0" onClick={() => handleFulfillDemand(alert)}>Fulfill Demand<ChevronRight className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div><h2 className="text-2xl font-serif font-bold">Supply History</h2><p className="text-muted-foreground">Track your supplies, payments, and performance</p></div>
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : supplyHistory.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No supply history yet</CardContent></Card>
            ) : (
              <>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="border-b border-border">
                          <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Crop</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Quantity</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Buyer</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Payment</th>
                        </tr></thead>
                        <tbody>
                          {supplyHistory.map((s) => (
                            <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                              <td className="p-4 text-muted-foreground">{new Date(s.delivered_at).toLocaleDateString()}</td>
                              <td className="p-4 font-medium">{s.crop_name}</td>
                              <td className="p-4">{s.quantity} {s.unit}</td>
                              <td className="p-4">{s.buyer_name || 'N/A'}</td>
                              <td className="p-4 font-semibold text-primary">৳{Number(s.total_amount).toLocaleString()}</td>
                              <td className="p-4"><Badge variant={s.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">{s.payment_status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-primary" /></div><span className="text-muted-foreground">Total Earned</span></div><p className="text-2xl font-serif font-bold text-foreground">৳{totalEarned.toLocaleString()}</p></CardContent></Card>
                  <Card><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"><Clock className="w-5 h-5 text-accent" /></div><span className="text-muted-foreground">Pending</span></div><p className="text-2xl font-serif font-bold text-foreground">৳{pendingPayment.toLocaleString()}</p></CardContent></Card>
                  <Card><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-secondary" /></div><span className="text-muted-foreground">Paid</span></div><p className="text-2xl font-serif font-bold text-foreground">৳{paidAmount.toLocaleString()}</p></CardContent></Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-foreground">Need logistics support?</h3>
              <p className="text-muted-foreground">We'll pick up from your farm and deliver to buyers</p>
            </div>
            <Button variant="hero" size="lg" className="gap-2" onClick={() => setPickupOpen(true)}><Truck className="w-5 h-5" />Request Transport</Button>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}

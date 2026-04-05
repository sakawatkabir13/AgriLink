import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Sprout, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { regions } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function UpgradeToFarmer() {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ farmName: '', farmSize: '', region: '', cropsGrown: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    // Update profile with farmer details
    const { error: profileError } = await supabase.from('profiles').update({
      farm_name: form.farmName,
      farm_size: form.farmSize,
      region: form.region,
      crops_grown: form.cropsGrown.split(',').map(c => c.trim()).filter(Boolean),
      is_verified_supplier: false,
    }).eq('user_id', user.id);

    if (profileError) {
      toast({ title: 'Upgrade failed', description: profileError.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Add farmer role
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: user.id,
      role: 'farmer' as any,
    });

    if (roleError) {
      toast({ title: 'Upgrade failed', description: roleError.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      toast({ title: 'Request submitted', description: 'Your farmer account is pending admin approval.' });
      navigate('/farmer');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Leaf className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-foreground">Agri<span className="text-primary">Link</span></span>
            <span className="text-xs text-muted-foreground -mt-1">From Soil to Sale</span>
          </div>
        </Link>

        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" /> Upgrade to Farmer
          </h1>
          <p className="text-muted-foreground mt-2">Fill in your farm details to start selling on AgriLink</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Farm Name</label>
                <Input placeholder="e.g. Green Valley Farm" value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} className="h-12 mt-1.5" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Region</label>
                  <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                    <SelectTrigger className="h-12 mt-1.5"><SelectValue placeholder="Region" /></SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Farm Size</label>
                  <Select value={form.farmSize} onValueChange={(v) => setForm({ ...form, farmSize: v })}>
                    <SelectTrigger className="h-12 mt-1.5"><SelectValue placeholder="Size" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt;2 acres)</SelectItem>
                      <SelectItem value="medium">Medium (2-10 acres)</SelectItem>
                      <SelectItem value="large">Large (10+ acres)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Crops You Grow</label>
                <Input placeholder="e.g. Rice, Tomatoes, Potatoes" value={form.cropsGrown} onChange={(e) => setForm({ ...form, cropsGrown: e.target.value })} className="h-12 mt-1.5" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isLoading || !form.farmName || !form.region}>
                {isLoading ? 'Upgrading...' : 'Upgrade to Farmer'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground">
          <Link to="/marketplace" className="text-primary font-medium hover:underline">← Back to Marketplace</Link>
        </p>
      </div>
    </div>
  );
}

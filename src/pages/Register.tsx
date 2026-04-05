import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, User, Sprout, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { regions } from '@/data/products';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buyer');
  const [emailSent, setEmailSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [buyerForm, setBuyerForm] = useState({ name: '', email: '', password: '', region: '' });
  const [farmerForm, setFarmerForm] = useState({ name: '', email: '', password: '', region: '', farmName: '', farmSize: '', cropsGrown: '' });

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(buyerForm.email, buyerForm.password, {
      full_name: buyerForm.name,
      region: buyerForm.region,
    }, 'buyer');

    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      setPendingEmail(buyerForm.email);
      setEmailSent(true);
      toast({ title: 'Verification email sent!', description: 'Check your email to verify your account.' });
    }
    setIsLoading(false);
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(farmerForm.email, farmerForm.password, {
      full_name: farmerForm.name,
      region: farmerForm.region,
      farm_name: farmerForm.farmName,
      farm_size: farmerForm.farmSize,
      crops_grown: farmerForm.cropsGrown.split(',').map(c => c.trim()).filter(Boolean),
    }, 'farmer');

    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      setPendingEmail(farmerForm.email); 
      setEmailSent(true); 
      toast({ title: 'Verification email sent!', description: 'Check your email to verify your account.' }); 
    }
    setIsLoading(false); 
  };
 
  // Email Sent Confirmation Screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <Link to="/" className="flex items-center gap-2 group justify-center">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-serif font-bold text-foreground">Agri<span className="text-primary">Link</span></span>
              <span className="text-xs text-muted-foreground -mt-1">From Soil to Sale</span>
            </div>
          </Link>

          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We sent a verification link to <span className="font-medium text-foreground">{pendingEmail}</span>
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account and get started. After verifying, you can sign in.
              </p>
              {activeTab === 'farmer' && (
                <p className="text-sm text-muted-foreground">
                  Farmer accounts also require admin approval before access to KrishokHub.
                </p>
              )}
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-2"
                onClick={() => navigate('/login')}
              >
                Go to Sign In
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground space-y-6">
          <h2 className="text-3xl font-serif font-bold">Start Your Journey with AgriLink</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Create an account as a buyer or farmer to access our full marketplace ecosystem.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              'Buy or sell farm produce directly',
              'Get wholesale pricing on bulk orders',
              'AI-powered smart pricing & demand alerts',
              'Track orders and payments in real-time',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">✓</div>
                <span className="text-primary-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
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
            <h1 className="text-3xl font-serif font-bold text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-2">Choose your role to get started</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Buyer
              </TabsTrigger>
              <TabsTrigger value="farmer" className="gap-2">
                <Sprout className="w-4 h-4" />
                Farmer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyer">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleBuyerSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="John Doe" value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })} className="pl-10 h-12" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" value={buyerForm.email} onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })} className="pl-10 h-12" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={buyerForm.password} onChange={(e) => setBuyerForm({ ...buyerForm, password: e.target.value })} className="pl-10 pr-10 h-12" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Region</label>
                      <Select value={buyerForm.region} onValueChange={(v) => setBuyerForm({ ...buyerForm, region: v })}>
                        <SelectTrigger className="h-12 mt-1.5"><SelectValue placeholder="Select region" /></SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Buyer Account'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="farmer">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleFarmerSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Farmer name" value={farmerForm.name} onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })} className="pl-10 h-12" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" value={farmerForm.email} onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })} className="pl-10 h-12" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={farmerForm.password} onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })} className="pl-10 pr-10 h-12" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Farm Name</label>
                      <Input placeholder="e.g. Green Valley Farm" value={farmerForm.farmName} onChange={(e) => setFarmerForm({ ...farmerForm, farmName: e.target.value })} className="h-12 mt-1.5" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Region</label>
                        <Select value={farmerForm.region} onValueChange={(v) => setFarmerForm({ ...farmerForm, region: v })}>
                          <SelectTrigger className="h-12 mt-1.5"><SelectValue placeholder="Region" /></SelectTrigger>
                          <SelectContent>
                            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Farm Size</label>
                        <Select value={farmerForm.farmSize} onValueChange={(v) => setFarmerForm({ ...farmerForm, farmSize: v })}>
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
                      <Input placeholder="e.g. Rice, Tomatoes, Potatoes" value={farmerForm.cropsGrown} onChange={(e) => setFarmerForm({ ...farmerForm, cropsGrown: e.target.value })} className="h-12 mt-1.5" />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Farmer Account'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

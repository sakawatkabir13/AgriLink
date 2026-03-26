import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!', description: 'You have been signed in.' });
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-foreground">
                Agri<span className="text-primary">Link</span>
              </span>
              <span className="text-xs text-muted-foreground -mt-1">From Soil to Sale</span>
            </div>
          </Link>

          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
            </p>
            <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground space-y-6">
          <h2 className="text-3xl font-serif font-bold">Fresh Produce, Fair Prices</h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Join thousands of buyers sourcing quality agricultural products directly from local farms.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-serif font-bold">500+</p>
              <p className="text-sm text-primary-foreground/70">Farmers</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-serif font-bold">10K+</p>
              <p className="text-sm text-primary-foreground/70">Orders</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div>
              <p className="text-3xl font-serif font-bold">50+</p>
              <p className="text-sm text-primary-foreground/70">Crops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

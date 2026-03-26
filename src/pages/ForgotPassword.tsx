import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-soft">
            <Leaf className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground">Agri<span className="text-primary">Link</span></span>
        </Link>

        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-muted-foreground text-sm">We sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Login</Button></Link>
            </CardContent>
          </Card>
        ) : (
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
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Leaf, Menu, X, LogOut, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { totalItems } = useCart();
  const { user, profile, userRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/marketplace', label: 'Marketplace' },
    ...(userRole === 'farmer' ? [{ to: '/farmer', label: 'KrishokHub' }] : []),
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-foreground">
                Agri<span className="text-primary">Link</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">From Soil to Sale</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {isActive(link.to) && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                    {userRole === 'farmer' ? '🌾 Farmer' : userRole === 'admin' ? '🛡️ Admin' : '🛒 Buyer'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {userRole === 'buyer' && (
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <ShoppingCart className="w-4 h-4 mr-2" /> My Orders
                    </DropdownMenuItem>
                  )}
                  {userRole === 'farmer' && (
                    <DropdownMenuItem onClick={() => navigate('/farmer')}>
                      <Sprout className="w-4 h-4 mr-2" /> KrishokHub
                    </DropdownMenuItem>
                  )}
                  {userRole === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
                  Sign In
                </Link>
              )}
              {user && (
                <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted text-left">
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, false);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="success" className="text-xs">
              Grade {product.qualityGrade}
            </Badge>
            {product.quantityAvailable > 0 && product.quantityAvailable <= 100 && (
              <Badge variant="wholesale" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="hero"
              onClick={handleQuickAdd}
              className="rounded-full shadow-elevated"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Category & Region */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.category}</span>
            <span>{product.region}</span>
          </div>

          {/* Name */}
          <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="w-3.5 h-3.5" />
            <span>{product.quantityAvailable} {product.unit} available</span>
          </div>

          {/* Pricing */}
          <div className="flex items-end justify-between pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Retail</p>
              <p className="text-xl font-bold text-foreground">
                ৳{product.retailPrice}
                <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Wholesale</p>
              <p className="text-sm font-semibold text-primary">
                ৳{product.wholesalePrice}/{product.unit}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Min: {product.minWholesaleQty} {product.unit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

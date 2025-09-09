import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Heart, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items,
    savedItems,
    summary,
    appliedPromoCode,
    isLoading,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyPromoCode,
    removePromoCode,
    clearCart,
    validateCart
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);

  // Validate cart on component mount
  useEffect(() => {
    validateCart();
  }, []);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const success = await updateQuantity(itemId, newQuantity);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const success = await removeFromCart(itemId);
    if (success) {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart"
      });
    }
  };

  const handleSaveForLater = async (itemId: string) => {
    const success = await saveForLater(itemId);
    if (success) {
      toast({
        title: "Saved for later",
        description: "Item has been moved to saved items"
      });
    }
  };

  const handleMoveToCart = async (itemId: string) => {
    const success = await moveToCart(itemId);
    if (success) {
      toast({
        title: "Added to cart",
        description: "Item has been moved to your cart"
      });
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    
    setIsApplyingPromo(true);
    const success = await applyPromoCode(promoCodeInput.trim());
    
    if (success) {
      toast({
        title: "Promo code applied",
        description: "Discount applied successfully!"
      });
      setPromoCodeInput('');
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive"
      });
    }
    setIsApplyingPromo(false);
  };

  const handleCheckout = async () => {
    const isValid = await validateCart();
    if (isValid && (items?.length || 0) > 0) {
      // Navigate to checkout page (to be implemented)
      navigate('/checkout');
    } else {
      toast({
        title: "Cart validation failed",
        description: "Please review your cart and try again",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  if ((items?.length || 0) === 0 && (savedItems?.length || 0) === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Button asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({summary?.itemCount || 0})
              </h2>
              {(items?.length || 0) > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg overflow-hidden">
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.description}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {item.product.description}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Code: {item.product.productCode}
                            </p>
                            {item.product.category && (
                              <Badge variant="secondary" className="mt-2">
                                {item.product.category}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              {formatPrice(item.product.price)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.product.price * item.quantity)} total
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isLoading}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isLoading || (item.product.maxQuantity && item.quantity >= item.product.maxQuantity)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveForLater(item.id)}
                              disabled={isLoading}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Saved Items Section */}
            {(savedItems?.length || 0) > 0 && (
              <div className="mt-8">
                <Button
                  variant="ghost"
                  onClick={() => setShowSavedItems(!showSavedItems)}
                  className="mb-4"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Items ({savedItems?.length || 0})
                </Button>
                
                {showSavedItems && (
                  <div className="space-y-4">
                    {savedItems?.map((item) => (
                      <Card key={item.id} className="overflow-hidden border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.product.imageUrl ? (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.description}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {item.product.description}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {item.product.productCode}
                              </p>
                              <p className="font-semibold text-gray-900 mt-1">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleMoveToCart(item.id)}
                                disabled={isLoading}
                              >
                                Move to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSavedItem(item.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      disabled={isApplyingPromo}
                    />
                    <Button
                      onClick={handleApplyPromoCode}
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      size="sm"
                    >
                      {isApplyingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Tag className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {appliedPromoCode && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">
                        {appliedPromoCode.code} applied
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-green-800 hover:text-green-900 h-auto p-1"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({summary?.itemCount || 0} items)</span>
                <span>{formatPrice(summary?.subtotal || 0)}</span>
                  </div>
                  
                  {(summary?.discount || 0) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(summary?.discount || 0)}</span>
                      </div>
                    )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {(summary?.shipping || 0) === 0 ? 'Free' : formatPrice(summary?.shipping || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (VAT)</span>
                    <span>{formatPrice(summary?.tax || 0)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(summary?.total || 0)}</span>
                  </div>
                </div>

                {/* Free Shipping Alert */}
                {(summary?.shipping || 0) > 0 && (summary?.subtotal || 0) < 1000 && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      Add {formatPrice(1000 - (summary?.subtotal || 0))} more for free shipping!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Checkout Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={(items?.length || 0) === 0 || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Proceed to Checkout
                </Button>

                {/* Security Badge */}
                <div className="text-center text-xs text-gray-500 mt-4">
                  🔒 Secure checkout with SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
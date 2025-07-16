import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Copy, Phone, Loader2, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Description {
  uid: string;
  text: string;
}

interface Package {
  uid: string;
  name: string;
  price: string;
  period: string;
  package_expiry_date: string;
  descriptions: Description[];
  created_at: string;
}

interface PromoCodeResponse {
  success: boolean;
  message: string;
  pricing_details: {
    original_price: number;
    discounted_price: number;
    discount_amount: number;
    promo_code: string;
  };
  package: {
    uid: string;
    name: string;
    price: string;
    period: string;
    package_expiry_date: string;
    descriptions: Array<{
      uid: string;
      text: string;
    }>;
    created_at: string;
  };
}

const PricingCards: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeResponse | null>(null);

  const bkashNumber = "01712345678";
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/packages`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPackages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCardStyle = (index: number) => {
    const styles = [
      'bg-purple-50 border-purple-200',
      'bg-blue-50 border-blue-200',
      'bg-orange-50 border-orange-200',
      'bg-green-50 border-green-200',
      'bg-pink-50 border-pink-200'
    ];
    return styles[index % styles.length];
  };

  const getButtonStyle = (index: number) => {
    const styles = [
      'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
    ];
    return styles[index % styles.length];
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `৳ ${numPrice.toLocaleString()}`;
  };

  const formatPeriod = (period: string) => {
    // Convert "1 Months" to "/month", "12 Months" to "/year", etc.
    const months = parseInt(period.split(' ')[0]);
    if (months === 1) return '/month';
    if (months === 12) return '/year';
    if (months === 36) return '/3 years';
    return `/${period.toLowerCase()}`;
  };

  const getFeatureIcon = (index: number) => {
    const icons = ['✔'];
    return icons[index % icons.length];
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !selectedTier) {
      toast({
        title: "Missing Information",
        description: "Please enter a promo code and select a package.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingPromo(true);
    
    try {
      const response = await fetch(`${baseUrl}/api/packages/apply-promo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: selectedTier.uid,
          promo_code: promoCode.trim(),
        }),
      });

      const data: PromoCodeResponse = await response.json();

      if (response.ok && data.success) {
        setAppliedPromo(data);
        toast({
          title: "Promo Code Applied!",
          description: data.message,
        });
      } else {
        toast({
          title: "Failed to Apply Promo Code",
          description: data.message || "Please check your promo code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Error",
        description: "Failed to apply promo code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const clearPromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
  };

  const handleSubscribeClick = (pkg: Package) => {
    setSelectedTier(pkg);
    setIsModalOpen(true);
    // Clear previous promo code data when selecting a new package
    setPromoCode('');
    setAppliedPromo(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
    setCopySuccess(false);
    setPromoCode('');
    setAppliedPromo(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const isCurrentPlan = (packageName: string) => {
    return userProfile?.package?.name === packageName;
  };

  if (loading) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Packages</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchPackages} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600">No packages available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card key={pkg.uid} className={`relative ${getCardStyle(index)} h-full flex flex-col`}>
              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>              
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                  <span className="text-gray-600">{formatPeriod(pkg.period)}</span>
                </div>
                
                <p className="text-sm text-gray-500">bKash Payment Method</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Package Includes:</h4>
                  <div className="">
                    {pkg.descriptions.map((description, descIndex) => (
                      <div key={description.uid} className="flex items-start space-x-3">
                        <span className="text-lg flex-shrink-0">
                          {getFeatureIcon(descIndex)}
                        </span>
                        <div>
                          <p className="text-sm text-gray-900">{description.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button  
                    disabled={isCurrentPlan(pkg.name)}
                    onClick={() => handleSubscribeClick(pkg)}
                    className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${getButtonStyle(index)}`}
                    variant="default"
                  >
                    {isCurrentPlan(pkg.name) ? 'Current Plan' : 'Subscribe Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Subscribe to {selectedTier.name} Plan
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Promo Code Section */}
              <Card className="border-blue-200 mb-6">
                <CardHeader className="pb-3">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                    <Tag className="h-4 w-4" />
                    Have a Promo Code?
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="promo-code" className="text-sm font-medium">
                      Promo Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo-code"
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo || !promoCode.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {isApplyingPromo ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  </div>

                  {appliedPromo && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-green-800 text-sm">
                          Promo Code Applied!
                        </h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearPromoCode}
                          className="text-green-700 h-auto p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-700">Original Price:</span>
                          <span className="text-green-800">৳{appliedPromo.pricing_details.original_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Discount:</span>
                          <span className="text-green-800">-৳{appliedPromo.pricing_details.discount_amount}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-green-700">Final Price:</span>
                          <span className="text-green-800">৳{appliedPromo.pricing_details.discounted_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Code:</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                            {appliedPromo.pricing_details.promo_code}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Plan Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedTier.name} Plan</h3>
                <div className="flex items-baseline mb-2">
                  {appliedPromo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg line-through text-gray-500">
                        {formatPrice(selectedTier.price)}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ৳{appliedPromo.pricing_details.discounted_price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(selectedTier.price)}</span>
                  )}
                  <span className="text-gray-600 ml-1">{formatPeriod(selectedTier.period)}</span>
                </div>
                <div className="space-y-2">
                  {selectedTier.descriptions.map((description, index) => (
                    <div key={description.uid} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="text-sm text-gray-900">{description.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Instructions</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                      <Phone size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">bKash Number</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-mono text-gray-900">{bkashNumber}</span>
                        <button
                          onClick={() => copyToClipboard(bkashNumber)}
                          className="text-pink-600 hover:text-pink-700 transition-colors"
                          title="Copy number"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      {copySuccess && (
                        <p className="text-xs text-green-600 mt-1">Number copied!</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">How to pay:</h5>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Open your bKash app</li>
                      <li>2. Select "Send Money"</li>
                      <li>3. Enter the number: {bkashNumber}</li>
                      <li>4. Enter amount: {appliedPromo ? `৳${appliedPromo.pricing_details.discounted_price}` : selectedTier.price}</li>
                      <li>5. Complete the transaction</li>
                      <li>6. Send us the transaction ID</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-900 mb-2">After Payment</h5>
                <p className="text-sm text-yellow-800">
                  Please send your transaction ID to us via WhatsApp or Email for verification. 
                  Your subscription will be activated within 24 hours.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => copyToClipboard(bkashNumber)}
                  variant="outline"
                  className="flex-1"
                >
                  Copy bKash Number
                </Button>
                <Button
                  onClick={closeModal}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingCards;

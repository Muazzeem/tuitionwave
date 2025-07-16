import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Package, AlertCircle, Tag, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import PricingCards from './PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './DashboardHeader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';

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

const PackageSettings = () => {
  const { userProfile, reloadProfile } = useAuth();
  const { toast } = useToast();
  const [packageData] = useState(userProfile.package);
  const [promoCode, setPromoCode] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeResponse | null>(null);

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
  });

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!packageData?.package_expiry_date) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const expiryDate = new Date(packageData.package_expiry_date);

      const totalSeconds = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / 1000));

      if (totalSeconds <= 0) {
        setTimeRemaining({ days: 0, hours: 0 });
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));

      setTimeRemaining({ days, hours });
    };
    updateCountdown();
  }, [packageData?.package_expiry_date]);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !selectedPackageId) {
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
          package_id: selectedPackageId,
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
    setSelectedPackageId('');
    setAppliedPromo(null);
  };

  // Check if user has an active package
  const hasActivePackage = packageData && packageData.name;
  const isExpired = hasActivePackage && new Date(packageData.package_expiry_date) <= new Date();
  const createdDate = hasActivePackage ? new Date(packageData.created_at) : null;
  const expiryDate = hasActivePackage ? new Date(packageData.package_expiry_date) : null;
  const totalDays = hasActivePackage ? differenceInDays(expiryDate, createdDate) : 0;

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <DashboardHeader userName="Settings" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 sm:p-6 max-w-full lg:max-w-[1211px] mx-auto">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-0">
              <div className="p-6 space-y-6 dark:bg-gray-900">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Package Information</h2>
                  <p className="text-gray-500 mt-1 dark:text-gray-300">View your current package details and subscription status</p>
                </div>

                {/* Promo Code Section */}
                <Card className="dark:bg-gray-800 dark:border-gray-700 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Tag className="h-5 w-5" />
                      Apply Promo Code
                    </CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Enter a promo code to get discounts on packages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="package-select" className="dark:text-gray-300">
                        Package ID
                      </Label>
                      <Input
                        id="package-select"
                        type="text"
                        placeholder="Enter package ID (e.g., f7d2c6f4-156f-4b35-8e18-562aa936376a)"
                        value={selectedPackageId}
                        onChange={(e) => setSelectedPackageId(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="promo-code" className="dark:text-gray-300">
                        Promo Code
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="promo-code"
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <Button 
                          onClick={handleApplyPromoCode}
                          disabled={isApplyingPromo || !promoCode.trim() || !selectedPackageId}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isApplyingPromo ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                    </div>

                    {appliedPromo && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-green-800 dark:text-green-200">
                            Promo Code Applied Successfully!
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearPromoCode}
                            className="text-green-700 dark:text-green-300"
                          >
                            Clear
                          </Button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Package:</span>
                            <span className="font-medium text-green-800 dark:text-green-200">
                              {appliedPromo.package.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Original Price:</span>
                            <span className="text-green-800 dark:text-green-200">
                              ৳{appliedPromo.pricing_details.original_price}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Discount:</span>
                            <span className="text-green-800 dark:text-green-200">
                              -৳{appliedPromo.pricing_details.discount_amount}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-green-700 dark:text-green-300">Final Price:</span>
                            <span className="text-green-800 dark:text-green-200">
                              ৳{appliedPromo.pricing_details.discounted_price}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">Promo Code:</span>
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200">
                              {appliedPromo.pricing_details.promo_code}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {!hasActivePackage ? (
                  <Card className="dark:bg-gray-800 dark:border-gray-700 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                          <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                            <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No Active Package
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          You don't have an active package subscription. Choose a package below to get started and unlock all features.
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Select a package that best fits your needs
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                          <Package className="h-5 w-5" />
                          Package Details
                        </CardTitle>
                        <CardDescription className="dark:text-gray-300">
                          Current subscription information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Package Name:</span>
                          <Badge variant="outline" className="dark:text-white">
                            {packageData.name}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price:</span>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ৳{packageData.price}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {packageData.period}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Started:</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {format(createdDate, 'MMM dd, yyyy')}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expires:</span>
                          <span className={`text-sm font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                            {format(expiryDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                          <Clock className="h-5 w-5" />
                          Time Remaining
                        </CardTitle>
                        <CardDescription className="dark:text-gray-300">
                          {isExpired ? 'Package has expired' : 'Time until package expires'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isExpired ? (
                          <div className="text-center py-6">
                            <div className="text-red-600 dark:text-red-400 font-semibold text-lg">
                              Package Expired
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Please renew your package to continue using the service
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {timeRemaining.days}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {timeRemaining.hours}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Total package duration: {totalDays} days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <PricingCards />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PackageSettings;

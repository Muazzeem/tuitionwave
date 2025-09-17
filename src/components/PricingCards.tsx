import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, Tag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAccessToken } from "@/utils/auth";
import { Package, PromoCodeResponse } from "@/types/tutor";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type PricingCardsProps = {
  category?: "STUDENT" | "TUTOR";
};

const PricingCards: React.FC<PricingCardsProps> = ({ category = "STUDENT" }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTier, setSelectedTier] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeResponse | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL as string | undefined;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!baseUrl) {
          throw new Error("Missing VITE_API_URL");
        }

        const res = await fetch(
          `${baseUrl}/api/packages?category=${encodeURIComponent(category)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Package[] = await res.json();
        if (isMounted) setPackages(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Error fetching packages:", e);
        if (isMounted) setError("Failed to load packages. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPackages();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [category, baseUrl]);

  const getCardStyle = (index: number) => {
    const styles = [
      "bg-purple-50 border-purple-200",
      "bg-blue-50 border-blue-200",
      "bg-orange-50 border-orange-200",
      "bg-green-50 border-green-200",
      "bg-pink-50 border-pink-200",
    ];
    return styles[index % styles.length];
  };

  const getButtonStyle = (index: number) => {
    const styles = [
      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    ];
    return styles[index % styles.length];
  };

  const formatPrice = (price: string | number | null | undefined) => {
    const n = Number(price);
    if (!isFinite(n)) return "৳ 0";
    return `৳ ${n.toLocaleString("en-BD")}`;
  };

  const isCurrentPlan = (packageName: string) =>
    userProfile?.package?.name === packageName;

  const handleSubscribeClick = (pkg: Package) => {
    setSelectedTier(pkg);
    setIsModalOpen(true);
    // reset promo state for fresh selection
    setPromoCode("");
    setAppliedPromo(null);
  };

  const clearPromoCode = () => {
    setPromoCode("");
    setAppliedPromo(null);
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !selectedTier) {
      toast({
        title: "Missing information",
        description: "Please enter a promo code and select a package.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingPromo(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${baseUrl}/api/packages/apply-promo/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          package_id: selectedTier.uid,
          promo_code: promoCode.trim(),
        }),
      });

      const data: PromoCodeResponse = await res.json();

      if (res.ok && (data as any)?.success) {
        setAppliedPromo(data);
        toast({ title: "Promo code applied!", description: data.message });
      } else {
        const errs =
          (data as any)?.error ??
          (Array.isArray((data as any)?.errors) ? (data as any).errors : []) ??
          [];
        if (Array.isArray(errs) && errs.length) {
          errs.forEach((msg: string) =>
            toast({ title: "Error", description: msg, variant: "destructive" })
          );
        } else {
          toast({
            title: "Invalid promo",
            description: (data as any)?.message ?? "Please check the code and try again.",
            variant: "destructive",
          });
        }
        setAppliedPromo(null);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Network error",
        description: "Failed to apply promo code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
    setPromoCode("");
    setAppliedPromo(null);
  };

  const handlePayNow = async () => {
    const token = getAccessToken();
    if (!selectedTier) {
      toast({
        title: "No package selected",
        description: "Please select a package first.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      package_uid: selectedTier.uid,
      promo_code: appliedPromo?.pricing_details?.promo_code ?? null,
    };

    try {
      const res = await fetch(`${baseUrl}/api/packages/purchase/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.error[0]) {
        data.message = data.error[0];
      }
      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      toast({
        title: "Proceeding to payment",
        description: "Redirecting to the payment gateway…",
        duration: 2000,
      });


      console.log("Pay now response:", data);
    } catch (e: any) {
      console.error("Pay now error:", e);
      toast({
        title: "Error",
        description: e?.message ?? "Unable to start payment.",
        variant: "destructive",
      });
    }
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Packages
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
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
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card key={pkg.uid} className={`relative ${getCardStyle(index)} h-full flex flex-col`}>
              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>              
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                  <span className="text-gray-600">/{pkg.duration_months} Months</span>
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
      {selectedTier && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-xl sm:p-3 md:p-5 border-0 bg-gray-900 rounded-lg shadow-lg text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white text-md">
                {selectedTier.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-grow overflow-y-auto pt-6">
              <div className="">
                <Card className="border-0 mb-6 bg-background">
                  <CardHeader className="pb-3">
                    <h4 className="flex items-center gap-2 font-semibold text-white">
                      <Tag className="h-4 w-4" />
                      Have a Promo Code?
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="promo-code" className="text-sm font-medium text-white">
                        Promo Code
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="promo-code"
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
                        />
                        <Button
                          onClick={handleApplyPromoCode}
                          disabled={isApplyingPromo || !promoCode.trim()}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
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
                      <div className="mt-3 p-3 bg-transparent border border-green-200 rounded-lg">
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

                <div className="mb-6 p-4 rounded-lg bg-gray-700">
                  <h3 className="font-semibold text-gray-300 mb-2">{selectedTier.name} Plan</h3>
                  <div className="flex items-baseline mb-2">
                    {appliedPromo ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg line-through text-white">
                          {formatPrice(selectedTier.price)}
                        </span>
                        <span className="text-2xl font-bold text-white">
                          ৳{appliedPromo.pricing_details.discounted_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-white">{formatPrice(selectedTier.price)}</span>
                    )}
                    <span className="text-gray-300 ml-1">/{selectedTier.duration_months} Months</span>
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

                <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-900 mb-2">After Payment</h5>
                  <p className="text-sm text-yellow-800">
                    Please send your transaction ID to us via WhatsApp or Email for verification.
                    Your subscription will be activated within 24 hours.
                  </p>
                </div>
              </div>
            </div>


            <DialogFooter>
              <Button variant="ghost" onClick={closeModal} className='border-0 text-white
                        hover:bg-red-900 hover:text-white mt-2 md:mt-0'>
                Cancel
              </Button>
              <Button onClick={handlePayNow} className='text-white bg-blue-700 hover:bg-blue-900'>
                Active Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PricingCards;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Package, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import PricingCards from './PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './DashboardHeader';
import { ScrollArea } from "@/components/ui/scroll-area";

const PackageSettings = () => {
  const { userProfile } = useAuth();
  const [packageData] = useState(userProfile.package);

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
  });

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
          <Card className="bg-white dark:bg-background border border-primary-200 dark:border-primary-700">
            <CardContent className="p-0">
              <div className="p-6 space-y-6 dark:bg-background">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Package Information</h2>
                  <p className="text-gray-500 mt-1 dark:text-gray-300">View your current package details and subscription status</p>
                </div>
                
                {!hasActivePackage ? (
                  <Card className="dark:bg-gray-900 dark:border-gray-700 border-orange-200 dark:border-red-800 shadow-md">
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                          <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-red-900 dark:text-red-500 mb-2">
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

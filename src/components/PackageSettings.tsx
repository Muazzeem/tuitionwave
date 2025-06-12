
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Package } from 'lucide-react';
import { format, differenceInDays} from 'date-fns';
import PricingCards from './PricingCards';

interface PackageData {
  id: number;
  name: string;
  price: string;
  period: string;
  package_expiry_date: string;
  created_at: string;
}

const PackageSettings = () => {
  const [packageData] = useState<PackageData>({
    id: 1,
    name: "ABC",
    price: "100.00",
    period: "4 Months",
    package_expiry_date: "2025-10-10",
    created_at: "2025-06-01T11:26:29.812177+06:00"
  });

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const expiryDate = new Date(packageData.package_expiry_date);
      
      const totalSeconds = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / 1000));
      
      if (totalSeconds <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [packageData.package_expiry_date]);

  const isExpired = new Date(packageData.package_expiry_date) <= new Date();
  const createdDate = new Date(packageData.created_at);
  const expiryDate = new Date(packageData.package_expiry_date);
  const totalDays = differenceInDays(expiryDate, createdDate);

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Package Information</h2>
        <p className="text-gray-500 mt-1 dark:text-gray-300">View your current package details and subscription status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Package Details Card */}
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

        {/* Countdown Timer Card */}
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
      <PricingCards />
    </div>
  );
};

export default PackageSettings;

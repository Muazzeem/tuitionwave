import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Package, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { format, differenceInDays, isValid } from 'date-fns';
import PricingCards from '../components/PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const safeDate = (value?: string | Date | null) => {
  const d = value ? new Date(value) : null;
  return d && isValid(d) ? d : null;
};

const humanDate = (d: Date | null) => (d ? format(d, 'MMM dd, yyyy') : '—');

const formatMoney = (amount?: string | number | null, currency?: string | null) => {
  const value = typeof amount === 'string' ? Number(amount) : Number(amount ?? 0);
  if (!Number.isFinite(value)) return '—';
  try {
    // You can tweak the locale if you want user-specific formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback if currency code is invalid/unknown to the runtime
    return `${value} ${currency ?? ''}`.trim();
  }
};

const PackageSettings: React.FC = () => {
  const { userProfile } = useAuth();

  // Find an ACTIVE package for the student role/target
  const activeEntry =
    userProfile?.packages?.find((p: any) => {
      const status = p?.status?.toUpperCase?.();
      const role = p?.role_applied?.toUpperCase?.();
      const target = p?.package?.target?.toUpperCase?.();
      return status === 'ACTIVE' && (role === 'STUDENT' || target === 'STUDENT' || target === 'BOTH');
    }) ?? null;

  const packageData = activeEntry
    ? {
      // Flatten a few fields we use a lot
      name: activeEntry.package?.name ?? '—',
      currency: activeEntry.package?.currency ?? 'USD',
      price: activeEntry.package?.price ?? '0',
      duration_days: activeEntry.package?.duration_days ?? null,
      activated_at: activeEntry.activated_at ?? null,
      expires_at: activeEntry.expires_at ?? null,
      status: activeEntry.status ?? '—',
      target: activeEntry.package?.target ?? activeEntry.role_applied ?? '—',
    }
    : null;

  const createdDate = useMemo(() => safeDate(packageData?.activated_at), [packageData?.activated_at]);
  const expiryDate = useMemo(() => safeDate(packageData?.expires_at), [packageData?.expires_at]);

  const hasActivePackage = Boolean(packageData && createdDate && expiryDate);
  const isExpired = hasActivePackage ? expiryDate! <= new Date() : false;

  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  // Prefer server-provided duration_days; fall back to date diff
  const totalDays = useMemo(() => {
    if (packageData?.duration_days != null) return packageData.duration_days;
    if (!createdDate || !expiryDate) return 0;
    const days = Math.max(0, differenceInDays(expiryDate, createdDate));
    return days || 0;
  }, [packageData?.duration_days, createdDate, expiryDate]);

  const daysLeft = useMemo(() => {
    if (!expiryDate) return 0;
    return Math.max(0, differenceInDays(expiryDate, new Date()));
  }, [expiryDate]);

  const progressPercent = useMemo(() => {
    if (!createdDate || !expiryDate) return 0;
    const totalMs = Math.max(1, expiryDate.getTime() - createdDate.getTime());
    const elapsedMs = Math.min(Math.max(0, Date.now() - createdDate.getTime()), totalMs);
    return Math.round((elapsedMs / totalMs) * 100);
  }, [createdDate, expiryDate]);

  const updateCountdown = useCallback(() => {
    if (!expiryDate) return;
    const now = new Date().getTime();
    const end = expiryDate.getTime();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    setTimeRemaining({ days, hours, minutes });
  }, [expiryDate]);

  useEffect(() => {
    updateCountdown(); // initial tick
    if (!expiryDate) return;
    const id = setInterval(updateCountdown, 60 * 1000); // update every minute
    return () => clearInterval(id);
  }, [expiryDate, updateCountdown]);

  return (
    <div className="flex-1 bg-gray-900 min-h-screen">
      <DashboardHeader userName="Settings" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 sm:p-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Page title + quick actions */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Billing Information
                </h1>
                <p className="text-sm text-gray-400 mt-1">Manage your subscription and plan details.</p>
              </div>

              {hasActivePackage ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white">
                    Manage Billing
                  </Button>
                </div>
              ) : null}
            </div>

            {/* Summary Header */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800">
              <CardContent className="p-4 sm:p-6">
                {!hasActivePackage ? (
                  <div className="flex flex-col items-center text-center py-8">
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-red-400 mb-2">No Active Package</h3>
                    <p className="text-gray-400 max-w-md">
                      You don’t have an active subscription. Choose a plan below to unlock all features.
                    </p>
                    <div className="flex items-center gap-3 mt-6">
                      <a href="#pricing">
                        <Button className="bg-blue-600 hover:bg-blue-500">View Plans</Button>
                      </a>
                      <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Plan + status */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="border-blue-500/40 text-blue-300">
                          <Package className="h-3.5 w-3.5 mr-1" />
                          {packageData?.name}
                        </Badge>

                        <Badge
                          className={`${isExpired ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          {isExpired ? 'Expired' : 'Active'}
                        </Badge>

                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {isExpired ? '0 days left' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="rounded-lg border border-gray-800 p-3">
                          <div className="text-xs text-gray-400">Price</div>
                          <div className="text-lg font-semibold text-gray-100">
                            {formatMoney(packageData?.price, packageData?.currency)}
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-800 p-3">
                          <div className="text-xs text-gray-400">Currency</div>
                          <div className="text-lg font-semibold text-gray-100">
                            {(packageData?.currency || 'USD').toUpperCase()}
                          </div>
                        </div>
                        <div className="rounded-lg border border-gray-800 p-3">
                          <div className="text-xs text-gray-400">Duration</div>
                          <div className="text-lg font-semibold text-gray-100">{totalDays} days</div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Usage Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <Progress value={isExpired ? 100 : progressPercent} className="h-2 bg-gray-800" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Started: {humanDate(createdDate)}</span>
                          <span>
                            Expires:{' '}
                            <span className={`${isExpired ? 'text-red-400' : 'text-gray-300'}`}>
                              {humanDate(expiryDate)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Countdown */}
                    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-gray-300" />
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            {isExpired ? 'Package has expired' : 'Time until expiry'}
                          </div>
                          <div className="text-xs text-gray-500">updates every minute</div>
                        </div>
                      </div>

                      {isExpired ? (
                        <div className="text-center py-4">
                          <div className="text-red-400 font-semibold text-lg">Package Expired</div>
                          <p className="text-sm text-gray-500 mt-2">Renew to continue using the service.</p>
                          <div className="mt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-500">Renew Now</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-blue-900/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-300">{timeRemaining.days}</div>
                              <div className="text-xs text-gray-400">Days</div>
                            </div>
                            <div className="bg-green-900/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-300">{timeRemaining.hours}</div>
                              <div className="text-xs text-gray-400">Hours</div>
                            </div>
                            <div className="bg-purple-900/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-purple-300">{timeRemaining.minutes}</div>
                              <div className="text-xs text-gray-400">Minutes</div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Billing period: <span className="text-gray-300">{humanDate(createdDate)}</span> →{' '}
                                <span className={`${isExpired ? 'text-red-400' : 'text-gray-300'}`}>
                                  {humanDate(expiryDate)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing section anchor for smooth jump from CTA */}
            <div id="pricing" className="scroll-mt-24">
              <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight pt-2 pb-3">Our Pricing</h1>
              <PricingCards />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PackageSettings;

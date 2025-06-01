import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { X, Copy, Phone } from 'lucide-react';

const PricingCards: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // bKash number - you can change this to your actual number
  const bkashNumber = "01712345678";

  const pricingTiers = [
    {
      name: 'Basic',
      price: '৳ 500',
      period: '/month',
      note: 'bKash Payment Method',
      features: [
        {
          title: 'Speaking Sessions',
          description: '1 Free Personalized Speaking Sessions (15 minutes)'
        },
        {
          title: 'Premium Support',
          description: 'Assistance via email or call'
        }
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'default' as const,
      cardStyle: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'Standard',
      price: '৳ 1500',
      period: '/1 year',
      note: 'bKash Payment Method',
      features: [
        {
          title: 'Speaking Sessions',
          description: '30 Personalized Speaking Sessions Monthly (15 minutes each)'
        },
        {
          title: 'Premium Support',
          description: 'Assistance via email or call'
        }
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'default' as const,
      cardStyle: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'Premium',
      price: '৳ 3,000',
      period: '/3 years',
      note: 'bKash Payment Method',
      features: [
        {
          title: 'Speaking Sessions',
          description: '60 Personalized Speaking Sessions Monthly (15 minutes each)'
        },
        {
          title: 'Premium Support',
          description: 'Assistance via email or call'
        }
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'default' as const,
      cardStyle: 'bg-orange-50 border-orange-200'
    }
  ];

  const getFeatureIcon = (title: string) => {
    const iconMap: { [key: string]: string } = {
      'Speaking Sessions': '🎤',
      'Basic Feedback': '📝',
      'Live Translation': '🌍',
      'Premium Support': '💎',
    };
    return iconMap[title] || '✓';
  };

  const handleSubscribeClick = (tier: any) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
    setCopySuccess(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <Card key={tier.name} className={`relative ${tier.cardStyle} h-full flex flex-col`}>
              <CardHeader className="text-center pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>              
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600">{tier.period}</span>
                </div>
                
                <p className="text-sm text-gray-500">{tier.note}</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Package Includes:</h4>
                  <div className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">
                          {getFeatureIcon(feature.title)}
                        </span>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{feature.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button 
                    onClick={() => handleSubscribeClick(tier)}
                    className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                      tier.name === 'Basic' 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                        : tier.name === 'Standard'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    }`}
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
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
              {/* Plan Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedTier.name} Plan</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold text-gray-900">{selectedTier.price}</span>
                  <span className="text-gray-600 ml-1">{selectedTier.period}</span>
                </div>
                <div className="space-y-2">
                  {selectedTier.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                        <p className="text-xs text-gray-600">{feature.description}</p>
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
                      <li>4. Enter amount: {selectedTier.price.replace('৳ ', '')}</li>
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


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';

const PricingCards: React.FC = () => {
  const pricingTiers = [
    {
      name: 'Free',
      tagline: 'Get to know the platform',
      price: '$0',
      period: '/month',
      note: 'No Credit Card Required!',
      features: [
        {
          title: 'Speaking Sessions',
          description: '1 Free Personalized Speaking Sessions (15 minutes)'
        },
        {
          title: 'Basic Feedback',
          description: 'Limited analysis of grammar, vocabulary, fluency, and filler words'
        },
        {
          title: 'Live Translation',
          description: 'Real-time conversation translation in 100+ languages'
        },
        {
          title: 'Gamified Learning & Progress Tracking',
          description: 'Engaging game-like elements & tracking of learning progress'
        },
        {
          title: 'Conversation History',
          description: 'Access to complete history of past conversations'
        },
        {
          title: 'Basic Support',
          description: 'Assistance via email'
        }
      ],
      buttonText: 'Try Now For Free',
      buttonVariant: 'default' as const,
      cardStyle: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'Standard',
      tagline: 'Perfect for getting started',
      price: '$15',
      period: '/month',
      note: 'Billed Monthly.',
      features: [
        {
          title: 'Speaking Sessions',
          description: '30 Personalized Speaking Sessions Monthly (15 minutes each)'
        },
        {
          title: 'Everything in free Tier',
          description: 'Plus detailed feedback, smart assessment, dynamic curriculum, and more'
        },
        {
          title: 'Detailed Feedback',
          description: 'In-depth analysis of grammar, vocabulary, fluency, and filler words'
        },
        {
          title: 'Smart Assessment',
          description: 'Personalized quizzes and vocabulary tests based on performance'
        },
        {
          title: 'Custom Curriculum',
          description: 'Tailored learning path designed for each user'
        },
        {
          title: 'Dedicated Support',
          description: 'Assistance via email and discord'
        }
      ],
      buttonText: 'Subscribe Now',
      buttonVariant: 'default' as const,
      cardStyle: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'Premium',
      tagline: 'Best choice for serious learner',
      price: '$25',
      period: '/month',
      note: 'Billed Monthly.',
      features: [
        {
          title: 'Speaking Sessions',
          description: '60 Personalized Speaking Sessions Monthly (15 minutes each)'
        },
        {
          title: 'Everything in starter Tier',
          description: 'Plus premium support, multi-language support, and more'
        },
        {
          title: 'Detailed Feedback',
          description: 'In-depth analysis of grammar, vocabulary, fluency, and filler words'
        },
        {
          title: 'Multiple Language Learning',
          description: 'Support for multiple language learning (coming soon)'
        },
        {
          title: 'Early Access',
          description: 'Priority access to new and upcoming features'
        },
        {
          title: 'premium Support',
          description: 'Assistance via Whatsapp and Direct Call'
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
      'Gamified Learning & Progress Tracking': '🎮',
      'Conversation History': '💬',
      'Basic Support': '🤝',
      'Everything in free Tier': '🔥',
      'Everything in starter Tier': '🔥',
      'Detailed Feedback': '📊',
      'Smart Assessment': '📊',
      'Custom Curriculum': '💸',
      'Dedicated Support': '💰',
      'Multiple Language Learning': '🌐',
      'Early Access': '⭐',
      'premium Support': '💎'
    };
    return iconMap[title] || '✓';
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingTiers.map((tier, index) => (
          <Card key={tier.name} className={`relative ${tier.cardStyle} h-full flex flex-col`}>
            <CardHeader className="text-center pb-4">
              <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{tier.tagline}</p>
              
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
                  className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                    tier.name === 'Free' 
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
  );
};

export default PricingCards;

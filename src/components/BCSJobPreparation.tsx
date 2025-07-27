
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Target, Users, Trophy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BCSJobPreparation: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Questions', value: '38K', icon: BookOpen },
    { label: 'Candidates', value: '72K', icon: Users },
  ];

  const examTypes = [
    { label: 'BCS', active: true },
    { label: 'Bank', active: false },
    { label: 'IELTS', active: false },
    { label: 'Gov Job', active: false },
  ];

  const features = [
    { icon: Target, title: 'Custom Exam Creation', description: 'Create personalized exams for self-assessment' },
    { icon: BookOpen, title: 'Reading Section', description: 'Comprehensive study materials and resources' },
    { icon: FileText, title: 'Practice Section', description: 'Extensive practice questions and mock tests' },
    { icon: Trophy, title: 'Progress Tracking', description: 'Monitor your performance and improvement' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-800 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <img
          src="/lovable-uploads/cover-image.jpg"
          alt="Tutor helping student"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hire • Teach • Succeed
          </h2>
          <p className="text-xl text-gray-200">
            Bangladesh's hub for learning & earning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Become a Tutor Card */}
          <Card className="bg-black/50 border-gray-700 text-white backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Become a Tutor</CardTitle>
              <p className="text-gray-300">
                Teach Online & Offline • Weekly bKash payouts • Set your rates.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-4">৳12,500</div>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/auth/registration')}
              >
                Start Teaching
              </Button>
            </CardContent>
          </Card>

          {/* Job Preparation Card */}
          <Card className="bg-black/50 border-gray-700 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Job Preparation</CardTitle>
              <div className="flex gap-2 flex-wrap mb-4">
                {examTypes.map((type) => (
                  <Badge 
                    key={type.label}
                    variant={type.active ? "default" : "secondary"}
                    className={type.active ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-300 flex items-center justify-center gap-1">
                      <stat.icon className="h-4 w-4" />
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size='lg'
                onClick={() => navigate('/job-preparation/dashboard')}
              >
                Start Preparation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/30 border-gray-700 text-white backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <p className="text-lg text-gray-200 flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Top-rated, verified teachers. 24h match guarantee. Track progress 100%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BCSJobPreparation;

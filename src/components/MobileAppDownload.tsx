
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, QrCode } from 'lucide-react';

const MobileAppDownload: React.FC = () => {
  return (
    <div className="dark:bg-gray-900 py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Download Our Mobile App
          </h2>
          <p className="text-xl opacity-90">
            Learn on the go with our mobile application
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-full">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Mobile Learning</h3>
                  <p className="opacity-90">Study anywhere, anytime with our mobile app</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-full">
                  <Download className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Full Access</h3>
                  <p className="opacity-90">Download our mobile app to get full access</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-full">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Easy Download</h3>
                  <p className="opacity-90">Scan QR code to download instantly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="bg-white/10 border-primary backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {/* QR Code placeholder */}
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-gray-400" />
                  </div>
                </div>
                
                <div className="text-center text-white">
                  <p className="text-sm opacity-90 mb-4">
                    Scan this QR code with your phone to download our app
                  </p>
                  
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      className="bg-primary border-gray-900 text-white hover:bg-primary-700 shadow-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Android
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-white/20 border-primary text-white hover:bg-primary-700 shadow-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      iOS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDownload;

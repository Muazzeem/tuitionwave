import { useEffect, useState } from "react";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath] = useState(window.location.pathname);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      currentPath
    );
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [currentPath]);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-400"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center max-w-md mx-auto transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Error icon with animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-white/30 animate-ping"></div>
        </div>

        {/* 404 Text with glitch effect */}
        <div className="relative mb-6">
          <h1 className="text-8xl font-black text-white mb-2 relative">
            <span className="inline-block animate-pulse">4</span>
            <span className="inline-block animate-bounce animation-delay-200">0</span>
            <span className="inline-block animate-pulse animation-delay-400">4</span>
          </h1>
          <div className="absolute inset-0 text-8xl font-black text-red-400 opacity-30 animate-pulse">
            404
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Lost in Space
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            The page you're looking for has drifted into the digital void.
          </p>
          <p className="text-white/60 text-sm font-mono bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
            {currentPath}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <a
            href="/"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Go Home
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;

import React, { useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ContactTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tutorName: string;
}

const ContactTutorDrawer: React.FC<ContactTutorDrawerProps> = ({ isOpen, onClose, tutorName }) => {
  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-70 w-full md:w-1/2 lg:w-1/3 transform transition-all duration-300 ease-in-out bg-white shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={stopPropagation}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact {tutorName}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <p className="text-gray-700 mb-6">
              Send a message to {tutorName} to inquire about their availability and discuss your learning needs.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Write your message here..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactTutorDrawer;

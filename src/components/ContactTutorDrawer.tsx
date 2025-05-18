
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import CreateContract from "@/components/CreateContract/index";
import { X } from "lucide-react";

interface ContactTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
}

const ContactTutorDrawer: React.FC<ContactTutorDrawerProps> = ({ isOpen, onClose, uid }) => {
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
          "fixed inset-y-0 right-0 z-70 w-full md:w-1/2 lg:w-1/3 transform transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={stopPropagation}
      >
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Create Contract</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        <CreateContract 
            uid={uid}
            drawer={{ isOpen: isOpen }}
        />
      </div>
    </>
  );
};

export default ContactTutorDrawer;

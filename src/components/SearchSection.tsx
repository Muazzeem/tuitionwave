import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

const SearchSection: React.FC = () => {
  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/institutes/");
      if (!response.ok) {
        throw new Error(`Failed to fetch institutions: ${response.status}`);
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching institutions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInstitutionSelect = (value: string) => {
    setSelectedInstitution(value);
    setSearchQuery(""); // Clear search query on selection
    setIsOpen(false); // Close dropdown after selection
  };

  if (loading) {
    return <div className="p-4 text-center">Loading Institutions...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="search-section text-white py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <img
          src="/lovable-uploads/cover-image.jpg"
          alt="Tutor helping student"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            QUICK SEARCH FOR TUTORS
          </h1>
          <p className="text-xl">FIND A RIGHT TUTOR IN YOUR AREA.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-medium text-lg mb-4">
            SEARCH TUTOR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Institution
              </label>
              <Select 
                open={isOpen} 
                onOpenChange={setIsOpen}
                value={selectedInstitution}
                onValueChange={handleInstitutionSelect}
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Institution" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-white z-10">
                    <Input
                      placeholder="Search Institution..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 focus-visible:ring-1 focus-visible:ring-offset-0 text-black"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <ScrollArea className="h-60">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((institution) => (
                        <SelectItem
                          key={institution.id}
                          value={institution.name}
                          className="text-black"
                        >
                          {institution.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No institutions found.
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">City</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-black">
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Sylhet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Subject
              </label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-black">
                <option>English</option>
                <option>Mathematics</option>
                <option>Science</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" className="h-4 w-4" />
                <span className="text-gray-600">Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" className="h-4 w-4" />
                <span className="text-gray-600">Female</span>
              </label>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              SEARCH TUTOR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
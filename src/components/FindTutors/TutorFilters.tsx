
import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TutorFilters = () => {
  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // To control dropdown visibility

  const fetchInstitutions = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/institutes/`);
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

  if (loading) {
    return <div>Loading Institutions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Select open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Institution" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px] overflow-y-auto">
          <div className="p-2">
            <Input
              placeholder="Search Institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-8",
                "focus-visible:ring-0 focus-visible:ring-offset-0" // Remove focus ring/outline
              )}
            />
          </div>
          <ScrollArea className="h-[300px] pr-2">
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((institution) => (
                <SelectItem
                  key={institution.id}
                  value={institution.name}
                  onSelect={() => {
                    setSearchQuery(""); // Clear search query on selection
                    setIsOpen(false); // Close dropdown after selection
                  }}
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

      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dhaka">Dhaka</SelectItem>
          <SelectItem value="chittagong">Chittagong</SelectItem>
          <SelectItem value="sylhet">Sylhet</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="math">Mathematics</SelectItem>
          <SelectItem value="physics">Physics</SelectItem>
          <SelectItem value="chemistry">Chemistry</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Online" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="both">Both</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Amount" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-1000">৳0 - ৳1000</SelectItem>
          <SelectItem value="1000-2000">৳1000 - ৳2000</SelectItem>
          <SelectItem value="2000+">৳2000+</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4+">4+ Stars</SelectItem>
          <SelectItem value="3+">3+ Stars</SelectItem>
          <SelectItem value="2+">2+ Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TutorFilters;

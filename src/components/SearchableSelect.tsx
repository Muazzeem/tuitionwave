
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, X } from 'lucide-react';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

interface Option {
  id: number;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  apiEndpoint: string;
  placeholder: string;
  createEntityName: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onValueChange,
  apiEndpoint,
  placeholder,
  createEntityName
}) => {
  const { toast } = useToast();
  const accessToken = getAccessToken();
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNoResults, setShowNoResults] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newEntityName, setNewEntityName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Fetch initial data
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndpoint}`);
        // Handle paginated response
        const items = response.data.results || response.data;
        setOptions(items);
        setFilteredOptions(items);
      } catch (error) {
        console.error(`Failed to fetch ${label.toLowerCase()} data`, error);
        toast({
          title: "Error",
          description: `Failed to load ${label.toLowerCase()} data.`,
          variant: "destructive"
        });
      }
    };
    
    fetchOptions();
  }, [apiEndpoint, label, toast]);

  // Search with API call
  useEffect(() => {
    const searchEntities = async () => {
      if (searchTerm.trim() === '') {
        setFilteredOptions(options);
        setShowNoResults(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${apiEndpoint}?search=${encodeURIComponent(searchTerm)}`
        );
        
        // Handle paginated response
        const items = response.data.results || response.data;
        setFilteredOptions(items);
        setShowNoResults(items.length === 0);
      } catch (error) {
        console.error(`Failed to search ${label.toLowerCase()}`, error);
        setFilteredOptions([]);
        setShowNoResults(true);
      }
    };

    const timeoutId = setTimeout(searchEntities, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm, options, apiEndpoint, label]);

  const handleCreateEntity = async () => {
    if (!newEntityName.trim()) {
      toast({
        title: "Error",
        description: `Please enter a ${createEntityName} name.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${apiEndpoint}`,
        { name: newEntityName.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newEntity = response.data;
      
      // Update the available options list
      setOptions(prev => [...prev, newEntity]);
      setFilteredOptions(prev => [...prev, newEntity]);
      
      // Select the newly created entity
      onValueChange(newEntity.id.toString());
      
      // Close modal and reset form
      setIsModalOpen(false);
      setNewEntityName('');
      
      toast({
        title: "Success",
        description: `${createEntityName} created successfully!`,
      });
    } catch (error) {
      console.error(`Error creating ${createEntityName.toLowerCase()}:`, error);
      toast({
        title: "Error",
        description: `Failed to create ${createEntityName.toLowerCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger id={label.toLowerCase()}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 mt-1 mb-3"
            />
          </div>
          
          {filteredOptions.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.name}
            </SelectItem>
          ))}
          
          {showNoResults && (
            <div className="p-2 text-center text-gray-500">
              <p className="text-sm mb-2">No {label.toLowerCase()} found</p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New {createEntityName}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New {createEntityName}</DialogTitle>
                    <DialogDescription>
                      Add a new {createEntityName.toLowerCase()} to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="entity-name" className="block text-sm font-medium text-gray-700">
                        {createEntityName} Name
                      </label>
                      <Input
                        id="entity-name"
                        value={newEntityName}
                        onChange={(e) => setNewEntityName(e.target.value)}
                        placeholder={`Enter ${createEntityName.toLowerCase()} name`}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewEntityName('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateEntity}
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : `Create ${createEntityName}`}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchableSelect;

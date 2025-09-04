import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import { getAccessToken } from '@/utils/auth';

interface Option {
  id: number;
  [key: string]: any;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  apiEndpoint: string;
  placeholder: string;
  createEntityName?: string;
  labelKey?: string; // default to 'name'
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onValueChange,
  apiEndpoint,
  placeholder,
  createEntityName,
  labelKey = 'name',
}) => {
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  // Fetch options initially
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndpoint}`);
        const items = response.data.results || response.data;
        setOptions(items);
        setFilteredOptions(items);
      } catch (error) {
        console.error(`Failed to fetch ${label} data`, error);
        toast({
          title: 'Error',
          description: `Failed to load ${label.toLowerCase()}s.`,
          variant: 'destructive',
        });
      }
    };
    fetchOptions();
  }, [apiEndpoint]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.trim() === '') {
        setFilteredOptions(options);
        setShowNoResults(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${apiEndpoint}?search=${encodeURIComponent(searchTerm)}`
        );
        const items = response.data.results || response.data;
        setFilteredOptions(items);
        setShowNoResults(items.length === 0);
      } catch (err) {
        console.error('Search error', err);
        setFilteredOptions([]);
        setShowNoResults(true);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, apiEndpoint, options]);

  const handleCreateEntity = async () => {
    if (!newEntityName.trim()) {
      toast({
        title: 'Validation',
        description: `Please enter a ${createEntityName?.toLowerCase()} name.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${apiEndpoint}`,
        { [labelKey]: newEntityName.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newEntity = response.data;
      setOptions((prev) => [...prev, newEntity]);
      setFilteredOptions((prev) => [...prev, newEntity]);
      onValueChange(newEntity.id.toString());
      setIsModalOpen(false);
      setNewEntityName('');

      toast({
        title: 'Success',
        description: `${createEntityName} created successfully!`,
      });
    } catch (error) {
      console.error('Creation error:', error);
      toast({
        title: 'Error',
        description: `Failed to create ${createEntityName?.toLowerCase()}.`,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={label.toLowerCase()} className="text-sm font-medium text-white">
        {label}
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={label.toLowerCase()}
          className="mt-1 bg-slate-800/50 border-slate-600 text-white hover:border-slate-500 transition-colors rounded-lg h-12"
        >
          <SelectValue placeholder={placeholder} className="text-gray-300" />
        </SelectTrigger>

        <SelectContent className="max-h-80 overflow-y-auto bg-slate-800 border-slate-600 rounded-lg shadow-xl">
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="pl-8 text-white bg-slate-700 border-slate-600 focus:border-slate-500 focus:ring-slate-500 rounded-lg"
              />
            </div>
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id.toString()}
                className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
              >
                {option[labelKey]}
              </SelectItem>
            ))
          ) : (
              <div className="p-4 text-sm text-center text-gray-400">
              <p className="mb-2">No {label.toLowerCase()} found.</p>

              {createEntityName && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mx-auto bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500"
                      >
                      <Plus className="mr-1 h-4 w-4" />
                      Create New {createEntityName}
                    </Button>
                  </DialogTrigger>

                    <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Create {createEntityName}</DialogTitle>
                        <DialogDescription className="text-gray-300">
                        Add a new {createEntityName.toLowerCase()} to the system.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        <label className="block text-sm mb-1 text-gray-300">Name</label>
                      <Input
                        value={newEntityName}
                        onChange={(e) => setNewEntityName(e.target.value)}
                        placeholder={`Enter ${createEntityName.toLowerCase()} name`}
                          className="bg-slate-700 border-slate-600 text-white focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsModalOpen(false);
                          setNewEntityName('');
                        }}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500"
                      >
                        Cancel
                      </Button>
                        <Button
                          onClick={handleCreateEntity}
                          disabled={isCreating}
                          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                        >
                        {isCreating ? 'Creating...' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchableSelect;
// components/SearchableMultiSelect.tsx

import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from './ui/use-toast';
import axios from 'axios';
import { getAccessToken } from '@/utils/auth';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  [key: string]: any;
}

interface Props {
  label: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  apiEndpoint: string;
  placeholder: string;
  labelKey?: string;
  createEntityName?: string;
}

const SearchableMultiSelect: React.FC<Props> = ({
  label,
  selectedValues,
  onChange,
  apiEndpoint,
  placeholder,
  labelKey = 'name',
  createEntityName,
}) => {
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [filtered, setFiltered] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}${apiEndpoint}`);
        const items = res.data.results || res.data;
        setOptions(items);
        setFiltered(items);
      } catch (err) {
        toast({
          title: 'Error',
          description: `Failed to load ${label.toLowerCase()}s.`,
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [apiEndpoint]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(options);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(
        options.filter((opt) =>
          opt[labelKey]?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, options]);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast({
        title: 'Validation',
        description: `Enter a ${createEntityName?.toLowerCase()} name.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${apiEndpoint}`,
        { [labelKey]: newName.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const newItem = res.data;
      setOptions((prev) => [...prev, newItem]);
      setFiltered((prev) => [...prev, newItem]);
      onChange([...selectedValues, newItem.id.toString()]);
      setIsDialogOpen(false);
      setNewName('');
      toast({
        title: 'Success',
        description: `${createEntityName} created successfully!`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to create ${createEntityName?.toLowerCase()}.`,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.id.toString()))
    .map((opt) => opt[labelKey])
    .join(', ');

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedLabels || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-72 overflow-y-auto">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>
              <div className="px-4 py-2 text-sm text-center">
                <p>No {label.toLowerCase()} found.</p>
                {createEntityName && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create New {createEntityName}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create {createEntityName}</DialogTitle>
                        <DialogDescription>
                          Add a new {createEntityName.toLowerCase()}.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={`Enter ${createEntityName.toLowerCase()} name`}
                        className="mt-4"
                      />
                      <DialogFooter className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setNewName('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={isCreating}>
                          {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => {
                const idStr = item.id.toString();
                return (
                  <CommandItem
                    key={idStr}
                    onSelect={() => toggleValue(idStr)}
                  >
                    <Checkbox
                      checked={selectedValues.includes(idStr)}
                      onCheckedChange={() => toggleValue(idStr)}
                      className="mr-2"
                    />
                    {item[labelKey]}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchableMultiSelect;


import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, X } from "lucide-react";

interface MultiSelectOption {
  uid: string;
  label: string;
  count?: number;
}

interface CustomMultiSelectProps {
  placeholder: string;
  options: MultiSelectOption[];
  selectedItems: MultiSelectOption[];
  onToggle: (item: MultiSelectOption) => void;
  onRemove: (uid: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function CustomMultiSelect({
  placeholder,
  options,
  selectedItems,
  onToggle,
  onRemove,
  isLoading,
  disabled = false
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.multi-select-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="multi-select-container relative">
      <div
        className="flex min-h-10 w-full rounded-md border border-input bg-gray-900 px-3 py-2 text-sm shadow-sm  cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between w-full">
          <span className={selectedItems.length === 0 ? "text-muted-foreground" : ""}>
            {selectedItems.length === 0 ? placeholder : `${selectedItems.length} selected`}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Selected Items */}
      {/* {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedItems.map(item => (
            <Badge
              key={item.uid}
              variant="secondary"
              className="flex items-center gap-1 dark:bg-gray-900 dark:border-gray-700"
            >
              {item.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.uid);
                }}
              />
            </Badge>
          ))}
        </div>
      )} */}

      {isOpen && !disabled && (
        <div className="absolute bg-gray-900 z-50 min-w-full mt-1 overflow-hidden rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-9 bg-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1 bg-gray-900">
            {isLoading ? (
              <div className="px-2 py-2 text-sm text-center">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-2 py-2 text-sm text-muted-foreground text-center">No options found</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selectedItems.some(selected => selected.uid === option.uid);
                return (
                  <div
                    key={option.uid}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(option);
                    }}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-2"
                      />
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{option.label}</span>
                        {option.count && (
                          <Badge variant="secondary" className="text-xs">
                            {option.count} Q
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

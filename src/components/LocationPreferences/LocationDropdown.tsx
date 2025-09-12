import React from 'react';
import { ChevronDown, Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationDropdownProps {
  label: string;
  placeholder: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedName: string;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  items: any[];
  onSelect: (item: any) => void;
  loading: boolean;
  hasNext: boolean;
  loadMore: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
}

export const LocationDropdown: React.FC<LocationDropdownProps> = ({
  label,
  placeholder,
  searchValue,
  setSearchValue,
  selectedName,
  showDropdown,
  setShowDropdown,
  items,
  onSelect,
  loading,
  hasNext,
  loadMore,
  scrollRef,
  disabled = false
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

    if (isNearBottom && hasNext && !loading) {
      loadMore();
    }
  };

  return (
    <div className="relative">
      <Label className="text-foreground flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4" />
        {label}
      </Label>
      <div className="relative">
        <div
          className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between bg-card/50 border-border hover:border-border/80 transition-colors backdrop-blur-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
        >
          <span className={selectedName ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedName || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </div>
        {showDropdown && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-ring"
                />
              </div>
            </div>
            <div
              ref={scrollRef}
              className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
              onScroll={handleScroll}
            >
              {items.length === 0 && !loading ? (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No {label.toLowerCase()} found
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors flex items-center gap-3 text-foreground"
                      onClick={() => onSelect(item)}
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {item.name}
                    </div>
                  ))}
                  {loading && (
                    <div className="px-4 py-3 text-center text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
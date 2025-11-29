import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useGeocoding } from '@/hooks/useGeocoding';
import type { SearchResult } from '@/types/map';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  className?: string;
}

export function SearchInput({ onSelectLocation, className }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { search, results, isLoading, clearResults } = useGeocoding();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        search(value);
        setShowResults(true);
      }, 300);
    },
    [search]
  );

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      onSelectLocation(lat, lng, result.display_name);
      setQuery(result.display_name.split(',')[0]);
      setShowResults(false);
      clearResults();
    },
    [onSelectLocation, clearResults]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for a city, town..."
          className="w-full pl-12 pr-4 py-4 bg-search border border-search-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          aria-label="Search for a location"
          data-testid="search-input"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Search hint */}
      <p className="mt-2 text-sm text-muted-foreground">
        or <span className="text-primary font-medium cursor-pointer hover:underline">draw</span> area on map
      </p>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-card overflow-hidden animate-fade-in"
          role="listbox"
          data-testid="search-results"
        >
          {results.map((result, index) => (
            <li key={`${result.lat}-${result.lon}-${index}`}>
              <button
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors text-sm"
                role="option"
              >
                <span className="line-clamp-2">{result.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

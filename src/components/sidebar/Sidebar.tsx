import { ChevronLeft, Trash2 } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { ShapeUpload } from './ShapeUpload';
import { FeatureList } from './FeatureList';
import type { AOIFeature } from '@/types/map';
import { cn } from '@/lib/utils';

interface SidebarProps {
  features: AOIFeature[];
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  onFileUpload?: (file: File) => void;
  onDeleteFeature: (id: string) => void;
  onRenameFeature: (id: string, name: string) => void;
  onZoomToFeature: (feature: AOIFeature) => void;
  onClearAll: () => void;
  className?: string;
}

export function Sidebar({
  features,
  onSelectLocation,
  onFileUpload,
  onDeleteFeature,
  onRenameFeature,
  onZoomToFeature,
  onClearAll,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-[380px] bg-card border-r border-border overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <header className="px-6 py-4 bg-sidebar-header border-b border-search-border">
        <div className="flex items-center gap-3">
          <button
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-primary font-semibold">Define Area of Interest</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Description */}
        <div className="mb-6 animate-slide-in">
          <p className="text-foreground leading-relaxed">
            <span className="font-semibold">Define the area(s)</span> where you will apply your object count &amp; detection model
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-muted-foreground font-medium">Options:</p>
          
          <SearchInput onSelectLocation={onSelectLocation} />

          <ShapeUpload onFileSelect={onFileUpload} />
        </div>

        {/* Divider */}
        {features.length > 0 && (
          <div className="my-6 border-t border-border" />
        )}

        {/* Feature List */}
        <FeatureList
          features={features}
          onDelete={onDeleteFeature}
          onRename={onRenameFeature}
          onZoomTo={onZoomToFeature}
          className="animate-slide-in"
        />

        {/* Clear All Button */}
        {features.length > 1 && (
          <button
            onClick={onClearAll}
            className="mt-4 flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all areas
          </button>
        )}
      </div>
    </aside>
  );
}

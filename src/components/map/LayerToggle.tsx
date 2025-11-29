import { Layers, Satellite } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerToggleProps {
  showWmsLayer: boolean;
  onToggle: () => void;
  className?: string;
}

export function LayerToggle({ showWmsLayer, onToggle, className }: LayerToggleProps) {
  return (
    <div className={cn('absolute bottom-6 right-6 z-10', className)}>
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-lg shadow-soft transition-all',
          showWmsLayer
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-foreground hover:bg-muted'
        )}
        aria-label={showWmsLayer ? 'Hide satellite layer' : 'Show satellite layer'}
        data-testid="layer-toggle"
      >
        {showWmsLayer ? (
          <>
            <Satellite className="w-5 h-5" />
            <span className="text-sm font-medium">Satellite</span>
          </>
        ) : (
          <>
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">Layers</span>
          </>
        )}
      </button>
    </div>
  );
}

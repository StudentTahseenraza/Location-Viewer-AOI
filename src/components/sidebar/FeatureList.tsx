import { useState } from 'react';
import { Trash2, ZoomIn, Pencil, Check, X, Hexagon, Square, Circle, Route } from 'lucide-react';
import type { AOIFeature, FeatureType } from '@/types/map';
import { cn } from '@/lib/utils';

interface FeatureListProps {
  features: AOIFeature[];
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onZoomTo: (feature: AOIFeature) => void;
  className?: string;
}

const featureIcons: Record<FeatureType, React.ReactNode> = {
  polygon: <Hexagon className="w-4 h-4" />,
  rectangle: <Square className="w-4 h-4" />,
  circle: <Circle className="w-4 h-4" />,
  polyline: <Route className="w-4 h-4" />,
};

const featureLabels: Record<FeatureType, string> = {
  polygon: 'Polygon',
  rectangle: 'Rectangle',
  circle: 'Circle',
  polyline: 'Polyline',
};

export function FeatureList({
  features,
  onDelete,
  onRename,
  onZoomTo,
  className,
}: FeatureListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (feature: AOIFeature) => {
    setEditingId(feature.id);
    setEditName(feature.name || `${featureLabels[feature.type]} ${features.indexOf(feature) + 1}`);
  };

  const handleSaveEdit = (id: string) => {
    onRename(id, editName);
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (features.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground text-center py-4', className)}>
        No areas defined yet. Draw on the map to create one.
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">
          Areas of Interest ({features.length})
        </p>
      </div>

      <ul className="space-y-2" role="list" data-testid="feature-list">
        {features.map((feature, index) => {
          const isEditing = editingId === feature.id;
          const displayName = feature.name || `${featureLabels[feature.type]} ${index + 1}`;

          return (
            <li
              key={feature.id}
              className="flex items-center gap-2 p-3 bg-search border border-search-border rounded-lg group hover:border-primary/30 transition-colors"
            >
              {/* Icon */}
              <span className="text-primary flex-shrink-0">
                {featureIcons[feature.type]}
              </span>

              {/* Name */}
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(feature.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
              ) : (
                <span className="flex-1 text-sm text-foreground truncate">
                  {displayName}
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(feature.id)}
                      className="p-1.5 hover:bg-muted rounded-md text-green-600 transition-colors"
                      aria-label="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onZoomTo(feature)}
                      className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Zoom to feature"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(feature)}
                      className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Edit name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(feature.id)}
                      className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

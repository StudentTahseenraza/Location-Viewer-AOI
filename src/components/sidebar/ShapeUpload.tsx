import { useRef, useCallback } from 'react';
import { FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShapeUploadProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function ShapeUpload({ onFileSelect, className }: ShapeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [onFileSelect]
  );

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-4 bg-search border border-search-border rounded-lg text-foreground hover:bg-search/80 transition-colors text-left',
        className
      )}
      aria-label="Upload a shape file"
      data-testid="shape-upload-button"
    >
      <FileUp className="w-5 h-5 text-muted-foreground" />
      <span className="text-muted-foreground">Uploading a shape file</span>
      <input
        ref={inputRef}
        type="file"
        accept=".geojson,.json,.kml,.shp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </button>
  );
}

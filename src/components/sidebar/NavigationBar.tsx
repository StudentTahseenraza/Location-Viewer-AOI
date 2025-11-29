import { LogoIcon } from '@/components/icons/LogoIcon';
import { HomeIcon, GridIcon, SettingsIcon } from '@/components/icons/NavIcons';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  className?: string;
}

export function NavigationBar({ className }: NavigationBarProps) {
  return (
    <nav
      className={cn(
        'flex flex-col items-center py-4 px-2 bg-card border-r border-border',
        className
      )}
    >
      {/* Logo */}
      <div className="mb-8">
        <LogoIcon className="w-8 h-8" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col items-center gap-2">
        <button
          className="p-3 rounded-lg bg-icon hover:bg-icon/80 transition-colors"
          aria-label="Home"
        >
          <HomeIcon className="w-5 h-5 text-primary" active />
        </button>
        <button
          className="p-3 rounded-lg hover:bg-muted transition-colors"
          aria-label="Grid view"
        >
          <GridIcon className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Bottom Settings */}
      <div className="mt-auto">
        <button
          className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-soft"
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

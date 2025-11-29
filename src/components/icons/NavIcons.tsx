import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  active?: boolean;
}

export function HomeIcon({ className, active }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-6 h-6', className)}
    >
      <path
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
        stroke={active ? 'hsl(var(--primary))' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GridIcon({ className, active }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-6 h-6', className)}
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={active ? 'hsl(var(--primary))' : 'currentColor'}
        strokeWidth="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={active ? 'hsl(var(--primary))' : 'currentColor'}
        strokeWidth="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke={active ? 'hsl(var(--primary))' : 'currentColor'}
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke={active ? 'hsl(var(--primary))' : 'currentColor'}
        strokeWidth="2"
      />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-6 h-6', className)}
    >
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 1V3M12 21V23M23 12H21M3 12H1M20.07 3.93L18.66 5.34M5.34 18.66L3.93 20.07M20.07 20.07L18.66 18.66M5.34 5.34L3.93 3.93"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

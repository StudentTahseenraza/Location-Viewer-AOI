import { cn } from '@/lib/utils';

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-10 h-10', className)}
    >
      <path
        d="M8 32L20 8L32 32H8Z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 24L20 14L26 24H14Z"
        fill="hsl(var(--primary-foreground))"
        opacity="0.9"
      />
    </svg>
  );
}

import { useTheme } from '@/shared/ui/theme-provider';
import { PropsWithClassname } from '../types/react';
import { Button } from '@/shared/ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export function ModeToggle({ className }: PropsWithClassname) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon" className={cn('h-fit text-muted-foreground hover:bg-transparent', className)}>
      <Sun className="text-muted-foreground size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="text-muted-foreground absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

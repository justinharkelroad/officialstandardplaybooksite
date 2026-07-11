import { Keyboard, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FlowAgentMode } from '@/app/hooks/useFlowAgentSession';

const FLOW_MODE_STORAGE_KEY = 'flow_mode_pref';

interface FlowModeToggleProps {
  value: FlowAgentMode;
  onChange: (mode: FlowAgentMode) => void;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FlowModeToggle({ value, onChange, compact = false, disabled = false, className }: FlowModeToggleProps) {
  const handleChange = (mode: FlowAgentMode) => {
    if (disabled) return;
    window.localStorage.setItem(FLOW_MODE_STORAGE_KEY, mode);
    onChange(mode);
  };

  return (
    <div
      className={cn(
        'grid min-w-0 rounded-lg border bg-muted/30 p-1',
        compact ? 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1' : 'grid-cols-2 gap-2',
        className,
      )}
    >
      <Button
        type="button"
        variant={value === 'text' ? 'default' : 'ghost'}
        size={compact ? 'sm' : 'lg'}
        onClick={() => handleChange('text')}
        disabled={disabled}
        className={cn('min-w-0 gap-2 rounded-md', compact && 'h-9 px-2 text-xs sm:px-3')}
      >
        <Keyboard className="h-4 w-4" />
        TEXT
      </Button>
      <Button
        type="button"
        variant={value === 'voice' ? 'default' : 'ghost'}
        size={compact ? 'sm' : 'lg'}
        onClick={() => handleChange('voice')}
        disabled={disabled}
        className={cn('min-w-0 gap-2 rounded-md', compact && 'h-9 px-2 text-xs sm:px-3')}
      >
        <Mic className="h-4 w-4" />
        VOICE
      </Button>
    </div>
  );
}

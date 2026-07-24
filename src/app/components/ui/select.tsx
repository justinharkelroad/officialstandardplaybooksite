// App-scoped Select.
//
// Radix portals SelectContent to <body>, outside the `.member-app` wrapper, so
// the scoped design tokens never reach it: `bg-background` resolves to the
// MARKETING token (white) and the dropdown renders as an unreadable white box
// in dark mode. Same reason the app has its own dialog/card copies.
//
// This wrapper re-applies the scope to the portalled content so callers cannot
// forget it. App code must import Select from here, never from
// `@/components/ui/select`.
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent as BaseSelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { spScopeClass } from "@/app/lib/theme";
import { cn } from "@/lib/utils";
import { getNativePlatform, isNativePlatform } from "@/mobile/nativePlatform";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof BaseSelectContent>,
  React.ComponentPropsWithoutRef<typeof BaseSelectContent>
>(({ className, ...props }, ref) => (
  <BaseSelectContent
    ref={ref}
    className={cn(
      spScopeClass(),
      "z-[70] max-h-[min(24rem,var(--radix-select-content-available-height))] max-w-[calc(100vw-2rem)]",
      className,
    )}
    {...props}
  />
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export interface NativeAwareSelectOption {
  value: string;
  label: string;
}

interface NativeAwareSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: NativeAwareSelectOption[];
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Radix Select is retained for the browser app. Capacitor uses the operating
 * system picker instead, which is more reliable inside a portalled modal and
 * gives iOS and Android users their familiar touch selection UI.
 */
function NativeAwareSelect({
  value,
  onValueChange,
  placeholder,
  options,
  ariaLabel,
  disabled = false,
  className,
}: NativeAwareSelectProps) {
  const [androidOpen, setAndroidOpen] = React.useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  /* Android WebView can expose native <select> options to accessibility while
     painting them as zero-size rows. Use an explicit touch list there so every
     choice remains visible on phones and tablets. */
  if (getNativePlatform() === "android") {
    return (
      <div className={cn("min-w-0", className)}>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={androidOpen}
          disabled={disabled}
          onClick={() => setAndroidOpen((open) => !open)}
          className="flex min-h-11 w-full touch-manipulation items-center justify-between gap-3 border border-input bg-background px-3 text-left text-sm uppercase tracking-[0.08em] text-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={cn("min-w-0 flex-1 truncate", !selectedLabel && "text-muted-foreground")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", androidOpen && "rotate-180")}
          />
        </button>

        {androidOpen && (
          <div
            role="listbox"
            aria-label={`${ariaLabel} choices`}
            className="mt-2 max-h-64 w-full overscroll-contain overflow-y-auto border border-input bg-background shadow-lg"
          >
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onValueChange(option.value);
                    setAndroidOpen(false);
                  }}
                  className={cn(
                    "flex min-h-11 w-full touch-manipulation items-center border-b border-input px-3 text-left text-sm last:border-b-0",
                    selected
                      ? "bg-[#2997FF] text-white"
                      : "bg-background text-foreground active:bg-foreground/10",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (isNativePlatform()) {
    return (
      <div className={cn("relative", className)}>
        <select
          aria-label={ariaLabel}
          value={value}
          disabled={disabled}
          onChange={(event) => onValueChange(event.target.value)}
          className="h-11 w-full touch-manipulation appearance-none border border-input bg-background px-3 pr-10 text-sm uppercase tracking-[0.08em] text-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
        />
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  NativeAwareSelect,
};

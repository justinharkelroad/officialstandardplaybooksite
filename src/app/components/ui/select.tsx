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

const SelectContent = React.forwardRef<
  React.ElementRef<typeof BaseSelectContent>,
  React.ComponentPropsWithoutRef<typeof BaseSelectContent>
>(({ className, ...props }, ref) => (
  <BaseSelectContent ref={ref} className={cn(spScopeClass(), className)} {...props} />
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

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
};

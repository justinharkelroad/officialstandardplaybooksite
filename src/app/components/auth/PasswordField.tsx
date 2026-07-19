import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  required?: boolean;
}

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  minLength,
  required = false,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityLabel = isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`;

  return (
    <div>
      <label htmlFor={id} className="sp-label mb-1.5 block text-[10px] text-foreground/70">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={minLength}
          required={required}
          className="w-full border-[1.5px] border-foreground bg-card px-4 py-3 pr-14 font-[Inter] text-base text-foreground outline-none transition-colors focus:border-[#2997FF] sm:text-sm"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={visibilityLabel}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex w-12 touch-manipulation items-center justify-center text-foreground/55 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#2997FF]"
        >
          {isVisible ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Interface for Phone Input Props
 */
interface PhoneInputProps {
  value?: RPNInput.Value | string;
  onChange?: (value: RPNInput.Value | undefined) => void;
  error?: boolean;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

/**
 * Searchable Phone Input Component
 * Uses Radix UI Popover + Command for a searchable country dropdown.
 */
const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, error, helperText, ...props }, ref) => {
  // Use library's input as base but override country select and input component
  return (
    <div className={cn("space-y-1", className)}>
         <div className={cn(
            "flex w-full items-center h-12 rounded-md border border-input bg-background ring-offset-background",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            error && "border-red-500",
             props.disabled && "cursor-not-allowed opacity-50"
         )}>
            <RPNInput.default
                ref={ref}
                className="flex-1 flex"
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={InputComponent}
                defaultCountry="US"
                international
                withCountryCallingCode
                value={value}
                onChange={(newValue) => onChange?.(newValue)}
                {...props}
            />
         </div>
      {helperText && (
        <p className={cn("text-xs", error ? "text-red-600" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

/**
 * Custom Input Component to strip default styles and merge with ours
 */
const InputComponent = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <Input
    {...props}
    ref={ref}
    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-none"
  />
));
InputComponent.displayName = "InputComponent";

/**
 * Searchable Country Select Component
 */
const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country }[];
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1 rounded-l-md px-3 py-2 border-r border-border bg-transparent hover:bg-muted/50 transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.value)
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Filter by label (name)
                    onSelect={() => handleSelect(option.value)}
                    className="gap-2"
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-sm">{option.label}</span>
                    {option.value === value && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Flag Component
 */
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };

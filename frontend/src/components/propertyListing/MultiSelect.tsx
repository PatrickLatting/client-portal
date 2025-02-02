import React, { useEffect } from 'react';
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MultiSelectorProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (selectedValues: string[]) => void;
  selectedValues?: string[];
  buttonWidth?: string;
  storageKey?: string; // New prop for unique localStorage key
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  options,
  placeholder = "Select options...",
  onChange,
  selectedValues = [],
  buttonWidth = "w-[480px]",
  storageKey = "multiSelector", // Default key if none provided
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);

  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedValues = localStorage.getItem(storageKey);
    if (savedValues) {
      const parsedValues = JSON.parse(savedValues);
      setValue(parsedValues);
      onChange?.(parsedValues);
    } else if (selectedValues.length > 0) {
      setValue(selectedValues);
      localStorage.setItem(storageKey, JSON.stringify(selectedValues));
    }
  }, [storageKey]);

  const handleSetValue = (val: string) => {
    let updatedValues;
    if (value.includes(val)) {
      updatedValues = value.filter((item) => item !== val);
    } else {
      updatedValues = [...value, val];
    }
    setValue(updatedValues);
    onChange?.(updatedValues);
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedValues));
  };

  // Clear filters function
  const clearFilters = () => {
    setValue([]);
    onChange?.([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${buttonWidth} justify-between h-fit min-h-12`}
          >
            <div className="flex gap-2 justify-start flex-wrap">
              {value?.length
                ? value.map((val, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                    >
                      {options.find((option) => option.value === val)?.label}
                    </div>
                  ))
                : placeholder}
            </div>
            <ChevronDown className="ml-2 h-4 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${buttonWidth} p-0`}>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSetValue(option.value);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {/* {value.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="absolute -top-6 right-0 text-xs text-gray-500 hover:text-gray-700"
        >
          Clear filters
        </Button>
      )} */}
    </div>
  );
};

export default MultiSelector;
"use client";

import * as React from "react";
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
  buttonWidth?: string; // Allow custom width for the button
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  options,
  placeholder = "Select options...",
  onChange,
  selectedValues = [],
  buttonWidth = "w-[480px]",
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>(selectedValues);

  const handleSetValue = (val: string) => {
    let updatedValues;
    if (value.includes(val)) {
      updatedValues = value.filter((item) => item !== val);
    } else {
      updatedValues = [...value, val];
    }
    setValue(updatedValues);
    onChange?.(updatedValues); // Notify the parent of changes
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${buttonWidth} justify-between h-fit min-h-12`}
        >
          <div className="flex gap-2 justify-start flex-wrap ">
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
          <CommandInput placeholder={`Search...`} />
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
  );
};

export default MultiSelector;

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange">;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ value, defaultValue, onValueChange, min = 0, max = 100, step = 1, className, disabled, ...props }, ref) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextValue = Number(event.target.value);
            if (Number.isNaN(nextValue)) return;
            onValueChange?.([nextValue]);
        };

        const resolvedValue = value?.[0];
        const resolvedDefault = defaultValue?.[0];

        return (
            <input
                type="range"
                ref={ref}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                value={resolvedValue ?? undefined}
                defaultValue={resolvedValue === undefined ? resolvedDefault ?? min : undefined}
                onChange={handleChange}
                className={cn(
                    "h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-[#a4e24d] focus:outline-none focus:ring-2 focus:ring-[#a4e24d] disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            />
        );
    }
);

Slider.displayName = "Slider";

export { Slider };

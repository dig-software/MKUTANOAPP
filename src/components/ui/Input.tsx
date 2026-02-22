"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input-field",
              leftIcon && "pl-10",
              error && "border-terra-400 focus:ring-terra-400",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-terra-600 font-medium">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;

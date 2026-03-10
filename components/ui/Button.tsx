import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gray-900 text-white hover:bg-black font-bold uppercase tracking-widest text-sm transition-colors",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 font-bold uppercase tracking-widest text-sm transition-colors",
  outline:
    "border border-gray-200 text-gray-900 hover:border-gray-900 font-bold uppercase tracking-widest text-sm transition-colors",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 uppercase tracking-widest text-sm font-bold transition-colors",
  accent:
    "bg-gray-900 text-white hover:bg-black font-bold uppercase tracking-widest text-sm transition-colors border border-lukess-gold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-md
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

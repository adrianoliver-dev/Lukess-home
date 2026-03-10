import { type HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "elevated" | "outlined" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white shadow-md",
  elevated: "bg-white border border-gray-200 shadow-sm",
  outlined: "bg-white border border-gray-200",
  glass: "bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm border border-white/20",
};

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      hover = false,
      padding = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl overflow-hidden
          transition-all duration-300
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hover ? "hover:border border-gray-200 shadow-sm hover:-translate-y-1" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-slate-700/60 text-slate-300 border-slate-600/50",
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning:
    "bg-amber-500/15 text-amber-400 border-amber-500/30",
  error:
    "bg-rose-500/15 text-rose-400 border-rose-500/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  purple:
    "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  pulse = false,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
      "inline-flex items-center font-medium rounded-full border",
      variantStyles[variant],
      sizeStyles[size],
      pulse && "animate-pulse",
      className
    )}
      {...props}
    >
      {children}
    </span>
  );
};

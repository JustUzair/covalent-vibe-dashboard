import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: "success" | "error" | "timeout" | "running";
  text?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const config = {
    success: {
      variant: "success" as const,
      text: text || "Success",
    },
    error: {
      variant: "error" as const,
      text: text || "Error",
    },
    timeout: {
      variant: "warning" as const,
      text: text || "Timeout",
    },
    running: {
      variant: "info" as const,
      text: text || "Running",
    },
  };

  const { variant, text: displayText } = config[status];

  return <Badge variant={variant}>{displayText}</Badge>;
};

import { LoaderCircle, type LucideIcon } from "lucide-react";
import React from "react";

export type ButtonVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info";

export type ButtonSize = "sm" | "md" | "lg";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: "#1692EC", text: "#FFFFFF" },
  success: { bg: "#16A34A", text: "#FFFFFF" },
  danger: { bg: "#E84E4E", text: "#FFFFFF" },
  warning: { bg: "#F96464", text: "#FFFFFF" },
  info: { bg: "#1692EC", text: "#FFFFFF" },
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  sm: { button: "px-3 py-1.5 text-sm", icon: "w-4 h-4" },
  md: { button: "px-4 py-2 text-base", icon: "w-5 h-5" },
  lg: { button: "px-6 py-3 text-2xl", icon: "w-6 h-6" },
};

const Button = (props: IButtonProps) => {
  const {
    title,
    icon: Icon,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    className = "",
    ...rest
  } = props;

  const isDisabled = disabled || isLoading;
  const colors = variantStyles[variant];

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2.5 font-medium rounded-sm w-40
        transition-colors duration-200
        ${sizeStyles[size].button}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        backgroundColor: !isDisabled ? colors.bg : undefined,
        color: colors.text,
      }}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <LoaderCircle className={`animate-spin ${sizeStyles[size].icon}`} />
      ) : Icon ? (
        <Icon className={sizeStyles[size].icon} />
      ) : null}
      <span className="mt-0.5">{title}</span>
    </button>
  );
};

export default React.memo(Button);

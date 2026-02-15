import type { LucideIcon } from "lucide-react";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export type InputType = "text" | "number" | "email" | "password" | "textarea";

export interface IInputProps {
  label?: string;
  type?: InputType;
  placeholder?: string;
  postIcon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  rows?: number;
  register?: UseFormRegisterReturn;
  error?: string;
}

const Input = (props: IInputProps) => {
  const {
    label,
    type = "text",
    placeholder,
    postIcon: PostIcon,
    disabled = false,
    className = "",
    rows = 4,
    register,
    error,
  } = props;

  const baseInputStyles = `
    w-full text-xl font-normal border rounded-md px-4 py-3
    outline-none focus:border-[#1692EC] transition-colors
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? "border-red-500" : "border-[#C2C2C2]"}
  `;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && <label className="text-2xl font-normal">{label}</label>}
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${baseInputStyles} resize-none text-[#5C5C5C] placeholder:text-[#c2c2c2]`}
          {...register}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseInputStyles} ${PostIcon ? "pr-12" : ""}
              px-4 py-3 border-[#5C5C5C] placeholder:font-normal
              text-[#5C5C5C] placeholder:text-[#c2c2c2]`}
            {...register}
          />
          {PostIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <PostIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default React.memo(Input);

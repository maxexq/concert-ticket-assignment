import type { LucideIcon } from "lucide-react";
import React from "react";

export type InputType = "text" | "number" | "email" | "password" | "textarea";

export interface IInputProps {
  label?: string;
  type?: InputType;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  postIcon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

const Input = (props: IInputProps) => {
  const {
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    postIcon: PostIcon,
    disabled = false,
    className = "",
    rows = 4,
  } = props;

  const baseInputStyles = `
    w-full text-xl font-normal border border-[#C2C2C2] rounded-md px-4 py-3
    outline-none focus:border-[#1692EC] transition-colors
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue =
      type === "number" ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && <label className="text-2xl font-normal">{label}</label>}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`${baseInputStyles} resize-none text-[#5C5C5C] placeholder:text-[#c2c2c2]`}
        />
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseInputStyles} ${PostIcon ? "pr-12" : ""}
              px-4 py-3 border-[#5C5C5C]  placeholder:font-normal
              text-[#5C5C5C] placeholder:text-[#c2c2c2]`}
          />
          {PostIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
              <PostIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Input);

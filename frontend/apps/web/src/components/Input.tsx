import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`
        w-full
        p-3
        border border-gray-300
        rounded-xl
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        transition
        ${className}
      `}
    />
  );
};

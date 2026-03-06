import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "btn-secondary"
        : "btn-ghost";

  return (
    <button {...props} className={`btn ${variantClass} ${className}`} />
  );
};

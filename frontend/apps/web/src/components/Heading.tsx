import type { ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level?: HeadingLevel; // default to h4 if not specified
  children: ReactNode;
  className?: string;
}

export const Heading = ({
  level = 4,
  children,
  className = "",
}: HeadingProps) => {
  // Map level to HTML tag
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Default Tailwind styles per level (customize to your design)
  const baseStyles: Record<HeadingLevel, string> = {
    1: "text-5xl font-bold mb-4",
    2: "text-4xl font-bold mb-3",
    3: "text-2xl font-semibold mb-3",
    4: "text-sm font-semibold tracking-wide mb-2",
    5: "text-sm font-medium mb-2",
    6: "text-xs font-medium mb-1",
  };

  return <Tag className={`${baseStyles[level]} ${className}`}>{children}</Tag>;
};

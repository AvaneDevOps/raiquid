import type { ButtonHTMLAttributes } from "react";

// TODO: implement variants (primary/secondary/ghost/danger) and sizes.
// See docs/DESIGN_SYSTEM.md, "Button".
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function Button(props: ButtonProps) {
  return <button {...props} />;
}

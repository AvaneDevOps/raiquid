import type { HTMLAttributes, ReactNode } from "react";

// TODO: implement. See docs/DESIGN_SYSTEM.md, "Card".
export function Card(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} />;
}

export function StatCard(props: {
  label: string;
  value: string;
  caption?: string;
  emphasize?: boolean;
  className?: string;
}) {
  return null;
}

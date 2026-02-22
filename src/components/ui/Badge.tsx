import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";

interface BadgeProps {
  status?: string;
  label?: string;
  className?: string;
  dot?: boolean;
}

export function Badge({ status, label, className, dot }: BadgeProps) {
  const colorClass = status ? getStatusColor(status) : "badge-gray";
  const text = label ?? (status ? getStatusLabel(status) : "");
  return (
    <span className={cn(colorClass, className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />}
      {text}
    </span>
  );
}

interface TagProps {
  color?: "green" | "orange" | "red" | "gray";
  children: React.ReactNode;
  className?: string;
}

export function Tag({ color = "gray", children, className }: TagProps) {
  const map: Record<string, string> = {
    green: "badge-green",
    orange: "badge-orange",
    red: "badge-red",
    gray: "badge-gray",
  };
  return <span className={cn(map[color], className)}>{children}</span>;
}

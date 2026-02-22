import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = "KES"): string {
  return `${currency} ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-KE", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(dateStr);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "badge-green",
    repaid: "badge-green",
    synced: "badge-green",
    closed: "badge-gray",
    confirmed: "badge-green",
    open: "badge-orange",
    draft: "badge-gray",
    pending: "badge-orange",
    overdue: "badge-red",
    offline: "badge-red",
    inactive: "badge-gray",
    suspended: "badge-red",
    written_off: "badge-red",
    warning: "badge-orange",
    success: "badge-green",
    error: "badge-red",
    info: "badge-gray",
  };
  return map[status] ?? "badge-gray";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Active",
    repaid: "Repaid",
    synced: "Synced",
    closed: "Closed",
    confirmed: "Confirmed",
    open: "Open",
    draft: "Draft",
    pending: "Pending Sync",
    overdue: "Overdue",
    offline: "Offline",
    inactive: "Inactive",
    suspended: "Suspended",
    written_off: "Written Off",
  };
  return map[status] ?? status;
}

export function calculateLoanBalance(principal: number, interestRate: number, repaid: number): number {
  const totalDue = principal + (principal * interestRate) / 100;
  return Math.max(0, totalDue - repaid);
}

export function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

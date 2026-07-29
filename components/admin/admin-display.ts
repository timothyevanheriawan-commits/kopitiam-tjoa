import type { OrderStatus } from "@/types/domain";
import type { AdminMenuItem } from "./admin-types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Diterima",
  preparing: "Diproses",
  ready: "Siap Diambil",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// Every status now has a DISTINCT color, and status is never conveyed by
// color alone (labels + shape cues — bold weight, strikethrough — carry
// the same meaning for colorblind users / grayscale printouts).
export const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "text-kopi-metal",
  preparing: "text-kopi-heritage",
  ready: "text-kopi-signage font-bold",
  completed: "text-kopi-ink-soft",
  cancelled: "text-kopi-ink-soft line-through decoration-1",
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "preparing",
  preparing: "ready",
  ready: "completed",
};

export const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "received", label: "Diterima" },
  { value: "preparing", label: "Diproses" },
  { value: "ready", label: "Siap Diambil" },
];

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function groupByCategory(items: AdminMenuItem[]) {
  return items.reduce<Record<string, AdminMenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}

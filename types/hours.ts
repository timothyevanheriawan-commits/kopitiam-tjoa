// types/hours.ts
export type ShopStatus = "open" | "closed" | "pre-order";

export interface OpenStatus {
  status: ShopStatus;
  label: string;
  isOpen: boolean;
  canOrder: boolean;
}

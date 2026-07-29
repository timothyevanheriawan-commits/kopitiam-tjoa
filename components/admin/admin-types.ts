import type { OrderStatus } from "@/types/domain";

export type AdminOrderItem = {
  id: string;
  item_name: string;
  selected_variant: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_note: string | null;
  status: OrderStatus;
  subtotal: number;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderItem[];
};

export type AdminMenuItem = {
  id: string;
  name: string;
  category: string;
  is_available: boolean;
};

import { create } from "zustand";

export interface CartLine {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedVariant: string | null;
}

interface CartState {
  lines: CartLine[];
  isSubmitting: boolean;
  submitError: string | null;
  unavailableItems: string[] | null;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (menuItemId: string, selectedVariant: string | null) => void;
  updateQuantity: (
    menuItemId: string,
    selectedVariant: string | null,
    quantity: number,
  ) => void;
  clear: () => void;
  total: () => number;
  submitOrder: (
    customerName: string,
    customerNote: string,
  ) => Promise<{ orderId: string; orderNumber: string }>;
}

// A cart "line" is unique per (menuItemId + selectedVariant) pair, so the
// same item with a different variant (e.g. Kopi O tubruk vs. saring) gets
// its own row instead of merging quantities incorrectly.
function sameLine(
  a: { menuItemId: string; selectedVariant: string | null },
  b: { menuItemId: string; selectedVariant: string | null },
) {
  return (
    a.menuItemId === b.menuItemId && a.selectedVariant === b.selectedVariant
  );
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  isSubmitting: false,
  submitError: null,
  unavailableItems: null,

  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.lines.find((line) => sameLine(line, item));
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            sameLine(line, item)
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          ),
        };
      }
      return { lines: [...state.lines, { ...item, quantity }] };
    }),

  removeItem: (menuItemId, selectedVariant) =>
    set((state) => ({
      lines: state.lines.filter(
        (line) => !sameLine(line, { menuItemId, selectedVariant }),
      ),
    })),

  updateQuantity: (menuItemId, selectedVariant, quantity) =>
    set((state) => ({
      lines:
        quantity <= 0
          ? state.lines.filter(
              (line) => !sameLine(line, { menuItemId, selectedVariant }),
            )
          : state.lines.map((line) =>
              sameLine(line, { menuItemId, selectedVariant })
                ? { ...line, quantity }
                : line,
            ),
    })),

  clear: () => set({ lines: [] }),

  total: () =>
    get().lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),

  // Sends the cart to the server, which is the sole source of truth for
  // pricing and availability (see app/api/orders/route.ts). On success,
  // clears the cart and hands the new order id back to the caller so the
  // component can redirect to /order/[id].
  submitOrder: async (customerName, customerNote) => {
    set({ isSubmitting: true, submitError: null, unavailableItems: null });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerNote: customerNote || null,
          items: get().lines.map((line) => ({
            menuItemId: line.menuItemId,
            selectedVariant: line.selectedVariant,
            quantity: line.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({
          isSubmitting: false,
          submitError: data.error ?? "Gagal membuat pesanan.",
          unavailableItems: data.unavailableItems ?? null,
        });
        throw new Error(data.error ?? "Gagal membuat pesanan.");
      }

      set({ isSubmitting: false, submitError: null, unavailableItems: null });
      get().clear();

      return {
        orderId: data.orderId as string,
        orderNumber: data.orderNumber as string,
      };
    } catch (err) {
      set((state) => ({
        isSubmitting: false,
        submitError:
          state.submitError ??
          (err instanceof Error ? err.message : "Gagal membuat pesanan."),
      }));
      throw err;
    }
  },
}));

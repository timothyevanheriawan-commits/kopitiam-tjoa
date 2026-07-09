import type { CartLine } from "@/store/cart-store";

const KOPITIAM_WHATSAPP_NUMBER = "6281234567890"; // placeholder, replace with real number

function formatIDR(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/**
 * Builds the itemized order message sent via wa.me. Kept as plain text
 * (WhatsApp doesn't render Markdown tables) but uses WhatsApp's own
 * *bold* / lightweight formatting for scannability.
 */
export function buildOrderMessage(
  lines: CartLine[],
  customerName: string,
  notes: string,
): string {
  const itemLines = lines.map((line) => {
    const variant = line.selectedVariant ? ` (${line.selectedVariant})` : "";
    const subtotal = line.unitPrice * line.quantity;
    return `${line.quantity}x ${line.name}${variant} — ${formatIDR(subtotal)}`;
  });

  const total = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );

  const parts = [
    `Halo Kopitiam Tjoa, saya mau pesan:`,
    ``,
    ...itemLines,
    ``,
    `*Total: ${formatIDR(total)}*`,
    ``,
    `Nama: ${customerName}`,
  ];

  if (notes.trim()) {
    parts.push(`Catatan: ${notes.trim()}`);
  }

  return parts.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${KOPITIAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

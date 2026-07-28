import type { CartLine } from "@/store/cart-store";

// Must be set in the deployment environment (e.g. Vercel project env
// vars) as NEXT_PUBLIC_WHATSAPP_NUMBER, in international format with no
// leading "+" (e.g. "628123456789"). There is intentionally no fallback
// placeholder — shipping a fake number silently would send every
// customer's order confirmation into the void.
const KOPITIAM_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

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

/**
 * Throws in development if NEXT_PUBLIC_WHATSAPP_NUMBER isn't configured,
 * so a missing env var is caught immediately instead of silently sending
 * customers to a dead/placeholder number in production.
 */
export function buildWhatsAppLink(message: string): string {
  if (!KOPITIAM_WHATSAPP_NUMBER) {
    throw new Error(
      "NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Add it to your environment " +
        "before deploying — the checkout flow depends on it.",
    );
  }
  return `https://wa.me/${KOPITIAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

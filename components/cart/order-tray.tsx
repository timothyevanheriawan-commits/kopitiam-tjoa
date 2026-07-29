"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function OrderTray({ isShopOpen = true }: { isShopOpen?: boolean }) {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.total());
  const isSubmitting = useCartStore((state) => state.isSubmitting);
  const submitError = useCartStore((state) => state.submitError);
  const unavailableItems = useCartStore((state) => state.unavailableItems);
  const submitOrder = useCartStore((state) => state.submitOrder);

  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (itemCount === 0 && !isOpen) return null;

  const canCheckout =
    isShopOpen && lines.length > 0 && customerName.trim().length > 0;

  async function handleCheckout() {
    try {
      const { orderId } = await submitOrder(customerName.trim(), notes.trim());
      setIsOpen(false);
      router.push(`/order/${orderId}`);
    } catch {
      // submitError sudah tersimpan di store dan tampil di bawah tombol —
      // tray tetap terbuka supaya pengunjung bisa perbaiki pesanan.
    }
  }

  return (
    <>
      {/* Mobile-only scrim — this panel behaves like a modal on small
          screens, so it needs a backdrop and a click-outside-to-close,
          same as any other overlay on the site would. */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-kopi-ink/40 md:hidden"
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
        {isOpen && (
          <div
            role="dialog"
            aria-label="Ringkasan pesanan"
            className="border-t-2 border-kopi-ink bg-kopi-bg md:mb-3 md:border md:shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-kopi-line px-4 py-3">
              <h3 className="font-display text-base text-kopi-ink">
                Pesanan Anda
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup ringkasan pesanan"
                className="font-body text-sm text-kopi-ink-soft hover:text-kopi-ink"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto px-4 py-3">
              {lines.length === 0 && (
                <p className="py-6 text-center font-body text-sm text-kopi-ink-soft">
                  Belum ada item yang ditambahkan.
                </p>
              )}

              {lines.length > 0 && (
                <ul className="divide-y divide-kopi-line">
                  {lines.map((line) => {
                    const lineKey = `${line.menuItemId}-${line.selectedVariant ?? ""}`;
                    const lineTotal = formatIDR(line.unitPrice * line.quantity);

                    return (
                      <li
                        key={lineKey}
                        className="flex items-start justify-between gap-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-kopi-ink">
                            {line.name}
                          </p>
                          {line.selectedVariant && (
                            <p className="font-body text-xs text-kopi-ink-soft">
                              {line.selectedVariant}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  line.menuItemId,
                                  line.selectedVariant,
                                  line.quantity - 1,
                                )
                              }
                              aria-label={`Kurangi jumlah ${line.name}`}
                              className="flex h-9 w-9 items-center justify-center border border-kopi-line font-body text-sm text-kopi-ink-soft hover:border-kopi-ink hover:text-kopi-ink active:bg-kopi-bg-raised"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-body text-sm tabular-nums text-kopi-ink">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  line.menuItemId,
                                  line.selectedVariant,
                                  line.quantity + 1,
                                )
                              }
                              aria-label={`Tambah jumlah ${line.name}`}
                              className="flex h-9 w-9 items-center justify-center border border-kopi-line font-body text-sm text-kopi-ink-soft hover:border-kopi-ink hover:text-kopi-ink active:bg-kopi-bg-raised"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  line.menuItemId,
                                  line.selectedVariant,
                                )
                              }
                              className="ml-1 py-1 font-body text-xs text-kopi-signage hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        <span className="whitespace-nowrap font-body text-sm font-semibold tabular-nums text-kopi-ink">
                          {lineTotal}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="space-y-3 border-t border-kopi-line px-4 py-3">
                <div className="flex items-center justify-between font-body text-sm">
                  <span className="text-kopi-ink-soft">Total</span>
                  <span className="font-bold tabular-nums text-kopi-ink">
                    {formatIDR(total)}
                  </span>
                </div>

                <div>
                  <label htmlFor="customer-name" className="sr-only">
                    Nama Anda
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full border border-kopi-line bg-kopi-bg px-3 py-2 font-body text-sm text-kopi-ink placeholder:text-kopi-ink-soft focus-visible:border-kopi-heritage"
                  />
                </div>

                <div>
                  <label htmlFor="order-notes" className="sr-only">
                    Catatan pesanan (opsional)
                  </label>
                  <textarea
                    id="order-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan, opsional"
                    rows={2}
                    className="w-full resize-none border border-kopi-line bg-kopi-bg px-3 py-2 font-body text-sm text-kopi-ink placeholder:text-kopi-ink-soft focus-visible:border-kopi-heritage"
                  />
                </div>

                {canCheckout ? (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="block w-full px-4 py-2.5 text-center font-body text-sm font-bold text-kopi-bg transition-colors bg-kopi-signage hover:bg-kopi-signage-strong disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled
                      className="block w-full cursor-not-allowed border border-kopi-line bg-kopi-bg-raised px-4 py-2.5 text-center font-body text-sm font-bold text-kopi-ink-soft"
                    >
                      Buat Pesanan
                    </button>
                    <p className="text-center font-body text-xs text-kopi-ink-soft">
                      {!isShopOpen
                        ? "Kedai sedang tutup. Keranjang Anda tersimpan — kembali lagi saat kami buka."
                        : "Isi nama Anda untuk melanjutkan"}
                    </p>
                  </>
                )}

                {submitError && (
                  <p
                    role="alert"
                    className="font-body text-xs text-kopi-signage"
                  >
                    {submitError}
                    {unavailableItems && unavailableItems.length > 0 && (
                      <>: {unavailableItems.join(", ")}</>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Persistent trigger — this IS the primary conversion action
            while an order is active, so it carries the CTA color, not
            neutral chrome. */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 border-t border-kopi-ink bg-kopi-signage px-5 py-3.5 font-body text-sm font-bold text-kopi-bg md:w-auto md:border md:shadow-lg"
        >
          <span>{isOpen ? "Sembunyikan" : "Lihat Pesanan"}</span>
          <span className="flex items-center gap-2">
            {itemCount > 0 && <span className="count-badge">{itemCount}</span>}
            <span className="tabular-nums">{formatIDR(total)}</span>
          </span>
        </button>
      </div>
    </>
  );
}

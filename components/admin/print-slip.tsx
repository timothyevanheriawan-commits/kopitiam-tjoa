import { BrandMark } from "@/components/brand/brand-mark";
import type { AdminOrder } from "./admin-types";
import { formatIDR, formatTime } from "./admin-display";

export function PrintSlip({ order }: { order: AdminOrder }) {
  return (
    <div className="print-slip hidden print:block font-utility text-kopi-ink mx-auto max-w-[320px]">
      <BrandMark className="h-8 w-8 mx-auto mb-1.5" />
      <p className="text-center text-base font-bold tracking-wide mb-0.5">
        KOPITIAM TJOA
      </p>
      <p className="text-center text-[10px] tracking-widest mb-1">
        EST. 1968 &middot; JL. KEMBANG JEPUN, SURABAYA
      </p>
      <p className="text-center text-[10px] mb-3">
        - - - - - - - - - - - - - - -
      </p>

      <p className="text-center text-lg font-bold mb-1">
        #{order.order_number}
      </p>
      <div className="flex justify-between text-xs mb-3">
        <span>{order.customer_name}</span>
        <span>{formatTime(order.created_at)}</span>
      </div>

      <p className="text-[10px] mb-2">- - - - - - - - - - - - - - -</p>

      {order.order_items.map((item) => (
        <div key={item.id} className="text-xs mb-2">
          <div className="flex justify-between">
            <span>
              {item.quantity}× {item.item_name}
            </span>
            <span>{formatIDR(item.line_total)}</span>
          </div>
          {item.selected_variant && (
            <p className="text-[10px] text-kopi-ink-soft pl-3">
              {item.selected_variant}
            </p>
          )}
        </div>
      ))}

      <p className="text-[10px] my-2">- - - - - - - - - - - - - - -</p>

      <div className="flex justify-between text-xs mb-0.5">
        <span>Jumlah item</span>
        <span>
          {order.order_items.reduce((sum, i) => sum + i.quantity, 0)}
        </span>
      </div>
      <div className="flex justify-between text-sm font-bold">
        <span>TOTAL</span>
        <span>{formatIDR(order.subtotal)}</span>
      </div>

      {order.customer_note && (
        <p className="text-[10px] italic mt-3 pt-2 border-t border-dotted border-kopi-ink">
          Catatan: {order.customer_note}
        </p>
      )}

      <p className="text-center text-[10px] mt-4">
        - - - - - - - - - - - - - - -
      </p>
      <p className="text-center text-xs mt-2">Terima kasih atas pesanan Anda!</p>
    </div>
  );
}

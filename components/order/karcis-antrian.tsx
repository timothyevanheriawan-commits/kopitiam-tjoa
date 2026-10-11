// Queue ticket ("karcis antrian") for the order status page. Styling lives
// in globals.css under .karcis so tokens, shadow and the punched edge stay
// in one place. Not rotated: rotation is reserved for .stamp-button.

export function KarcisAntrian({
  orderNumber,
  customerName,
  issuedAt,
}: {
  orderNumber: string;
  customerName: string;
  issuedAt: string;
}) {
  // Order codes can be longer than a plain queue number; shrink the numeral
  // instead of letting it overflow the ticket.
  const sizeClass =
    orderNumber.length <= 6
      ? "text-6xl"
      : orderNumber.length <= 10
        ? "text-4xl"
        : "text-2xl";

  return (
    <div className="karcis">
      <div className="karcis__body">
        <div className="flex items-center justify-between font-utility text-[10px] font-bold uppercase tracking-[0.18em] text-kopi-signage">
          <span>Karcis Antrian</span>
          <span aria-hidden="true">蔡記</span>
        </div>

        <h1
          className={`my-3 break-all font-display leading-none tracking-tight text-kopi-ink ${sizeClass}`}
        >
          <span className="sr-only">Nomor pesanan </span>#{orderNumber}
        </h1>

        <div className="border-t border-dashed border-kopi-ink/60 pt-2 font-utility text-[10px] uppercase tracking-widest text-kopi-ink-soft">
          <p>Atas nama {customerName}</p>
          <p className="mt-0.5">{issuedAt}</p>
        </div>
      </div>
    </div>
  );
}

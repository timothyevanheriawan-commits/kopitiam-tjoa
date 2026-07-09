import type { OpenStatus } from "@/lib/hours";

export function OpenBadge({ status }: { status: OpenStatus }) {
  const { isOpen, label } = status;

  return (
    <span
      role="status"
      aria-label={isOpen ? "Buka sekarang" : "Tutup sekarang"}
      className={[
        "status-pill",
        isOpen ? "text-kopi-heritage" : "text-kopi-ink-soft",
      ].join(" ")}
    >
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}

import { AdminButton } from "@/components/admin/admin-button";
import { formatTime } from "./admin-display";

export function AdminToolbar({
  lastUpdated,
  readyCount,
  onRefresh,
  onLogout,
}: {
  lastUpdated: Date | null;
  readyCount: number;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <header className="border-b border-kopi-line bg-kopi-bg-raised px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="font-display text-base text-kopi-ink tracking-tight">
            Kopitiam Tjoa{" "}
            <span className="font-utility text-[10px] uppercase tracking-widest text-kopi-ink-soft">
              Admin
            </span>
          </p>
          <div className="flex items-center gap-4">
            <span className="status-pill" aria-live="polite">
              <span className="dot dot--open" />
              {lastUpdated
                ? `Diperbarui ${formatTime(lastUpdated.toISOString())}`
                : "Memuat…"}
            </span>
            <AdminButton variant="ghost" size="sm" onClick={onRefresh}>
              Segarkan
            </AdminButton>
            <AdminButton variant="ghost" size="sm" onClick={onLogout}>
              Keluar
            </AdminButton>
          </div>
        </div>
      </header>

      {/* Sticky, high-visibility banner — the single most time-sensitive
          fact in the whole dashboard is no longer a small text fragment. */}
      {readyCount > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="sticky top-0 z-10 bg-kopi-signage px-6 py-3 text-center font-utility text-sm font-bold uppercase tracking-widest text-kopi-bg"
        >
          {readyCount} pesanan siap diambil
        </div>
      )}
    </>
  );
}

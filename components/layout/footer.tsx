import Link from "next/link";
import type { BusinessHours } from "@/types/domain";
import { Logo } from "@/components/layout/logo";
import { getOpenStatus, getWibDayKey } from "@/lib/hours";

const DAY_LABELS: { key: keyof BusinessHours; label: string }[] = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
];

const DAY_KEYS: (keyof BusinessHours)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function formatDayHours(hours: BusinessHours[keyof BusinessHours]) {
  if (hours.closed || !hours.open || !hours.close) return "Tutup";
  return `${hours.open} sampai ${hours.close}`;
}

export function Footer({
  hours,
  manualOverride = null,
}: {
  hours: BusinessHours;
  manualOverride?: boolean | null;
}) {
const todayKey = getWibDayKey();
  const status = getOpenStatus(hours, manualOverride);

  return (
    <footer className="mt-32 border-t border-kopi-line bg-kopi-bg-raised/60">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm font-body text-sm leading-loose text-kopi-ink-soft">
              Kopitiam keluarga di Jalan Kembang Jepun, Surabaya. Berdiri sejak
              1968, menjaga resep yang sama selama tiga generasi.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-body text-xs font-bold uppercase tracking-wider text-kopi-ink-soft">
                Jelajahi
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/menu"
                    className="font-body text-sm text-kopi-ink transition-colors hover:text-kopi-signage"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="font-body text-sm text-kopi-ink transition-colors hover:text-kopi-signage"
                  >
                    Cerita Kami
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-body text-xs font-bold uppercase tracking-wider text-kopi-ink-soft">
                Lokasi
              </h3>
              <p className="font-body text-sm leading-loose text-kopi-ink-soft">
                Jalan Kembang Jepun
                <br />
                Surabaya, Jawa Timur
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jalan+Kembang+Jepun+Surabaya"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-body text-sm text-kopi-heritage underline"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-body text-xs font-bold uppercase tracking-wider text-kopi-ink-soft">
                Jam Operasional
              </h3>
              <span className="status-pill">
                <span
                  className={`dot ${status.isOpen ? "dot--open" : ""}`}
                  aria-hidden="true"
                />
                {status.label}
              </span>
            </div>
            <dl className="space-y-1.5">
              {DAY_LABELS.map(({ key, label }) => {
                const isClosed = hours[key].closed || !hours[key].open;
                const isToday = key === todayKey;
                return (
                  <div
                    key={key}
                    className="flex items-baseline justify-between gap-3 font-body text-sm"
                  >
                    <dt
                      className={
                        isToday
                          ? "font-bold text-kopi-heritage"
                          : "text-kopi-ink-soft"
                      }
                    >
                      {label}
                      {isToday && (
                        <span className="ml-1.5 font-utility text-[9px] uppercase tracking-widest">
                          Hari ini
                        </span>
                      )}
                    </dt>
                    <dd
                      className={
                        isClosed
                          ? "italic text-kopi-ink-soft/60"
                          : isToday
                            ? "font-bold tabular-nums text-kopi-heritage"
                            : "font-medium tabular-nums text-kopi-ink"
                      }
                    >
                      {formatDayHours(hours[key])}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-kopi-line/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-kopi-ink-soft/80">
            © {new Date().getFullYear()} Kopitiam Tjoa.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { ButtonLink } from "@/components/ui/button-link";

// TODO: replace with the real embed URL for the shop's Google Maps listing.
const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=REPLACE_WITH_REAL_EMBED";
const MAPS_DIRECTIONS_HREF =
  "https://maps.google.com/?q=Jl.+Kembang+Jepun,+Surabaya";

export function LocationCard() {
  return (
    <div className="border border-kopi-ink bg-kopi-bg shadow-(--shadow-stamp-md)">
      <div className="aspect-4/3-full md:aspect-video">
        <iframe
          title="Lokasi kedai di Jl. Kembang Jepun, Surabaya"
          src={MAPS_EMBED_SRC}
          className="h-full w-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-kopi-line p-4">
        <p className="font-body text-sm text-kopi-ink-soft">
          Jl. Kembang Jepun, Surabaya
        </p>
        <ButtonLink
          href={MAPS_DIRECTIONS_HREF}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka di Google Maps
        </ButtonLink>
      </div>
    </div>
  );
}

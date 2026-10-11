import { ButtonLink } from "@/components/ui/button-link";
import { SHOP_MAPS_EMBED_SRC, SHOP_MAPS_HREF } from "@/lib/constants";

export function LocationCard() {
  return (
    <div className="border border-kopi-ink bg-kopi-bg shadow-(--shadow-stamp-md)">
      <div className="aspect-4/3 md:aspect-video">
        <iframe
          title="Lokasi kedai di Jl. Kembang Jepun, Surabaya"
          src={SHOP_MAPS_EMBED_SRC}
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
          href={SHOP_MAPS_HREF}
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

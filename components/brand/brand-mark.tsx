// components/brand/brand-mark.tsx

/**
 * The Kopitiam Tjoa seal mark — bold, stamp-style treatment matching
 * the icon.svg / apple-icon.tsx favicon set. This is the single source
 * of truth for the brand mark's SHAPE across the whole product (nav,
 * footer, admin print receipt). Only the favicon/apple-icon files are
 * separate, because platform file formats (.ico, raster PNG) require
 * their own build output — but they render the identical geometry
 * defined here, kept in sync by hand since they can't share a JS import
 * across format boundaries. If you change this file, update icon.svg
 * and app/apple-icon.tsx to match.
 */
export function BrandMark({
  className,
  withPlate = true,
}: {
  className?: string;
  /** Set false when placing on an already-dark background (e.g. footer
   *  if it ever goes dark-mode) to avoid a dark-on-dark plate. */
  withPlate?: boolean;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {withPlate && (
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="9"
          fill="var(--kopi-ink)"
          stroke="var(--kopi-metal)"
          strokeWidth="1.4"
        />
      )}

      {/* Steam — bold solid shapes, cream against the ink plate */}
      <path
        d="M15.5 12.2 C13.3 10.1 16.6 8.2 14.9 6.1 C17.9 7.5 17.6 10.7 15.5 12.2 Z"
        fill="var(--kopi-bg)"
      />
      <path
        d="M24.5 12.2 C26.7 10.1 23.4 8.2 25.1 6.1 C22.1 7.5 22.4 10.7 24.5 12.2 Z"
        fill="var(--kopi-bg)"
      />

      {/* Tumbler — solid cream silhouette, reads via contrast alone */}
      <path
        d="M12 14.5 L28 14.5 L24.2 29.3 C24 30.2 23.2 30.8 22.2 30.8
           L17.8 30.8 C16.8 30.8 16 30.2 15.8 29.3 Z"
        fill="var(--kopi-bg)"
      />

      {/* Fill line — thick jade band, the one color accent */}
      <rect
        x="14.4"
        y="19.6"
        width="11.2"
        height="3.1"
        fill="var(--kopi-heritage)"
      />
    </svg>
  );
}

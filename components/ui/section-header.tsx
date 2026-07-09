type Props = {
  eyebrow?: string;
  /** Defaults to the "action/differentiator" color. Pass
   *  "text-kopi-ink-soft" for context/explanatory sections. */
  eyebrowClassName?: string;
  title: string;
  /** Defaults to heritage green. Pass "text-kopi-ink" for purely
   *  informational sections that aren't tied to the ordering flow. */
  titleClassName?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  eyebrowClassName = "text-kopi-signage",
  title,
  titleClassName = "text-kopi-heritage",
  className = "",
}: Props) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p
          className={`mb-3 font-utility text-xs font-bold uppercase tracking-widest ${eyebrowClassName}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-3xl leading-tight tracking-tight md:text-4xl ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}

import type { ProcessStep } from "@/lib/about-content";

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="space-y-6">
      {steps.map((item) => (
        <li key={item.key}>
          <div className="leader-row">
            <span className="font-utility text-sm font-bold tracking-widest text-kopi-heritage">
              {item.step}
            </span>
            <span className="leader-fill" aria-hidden="true" />
            <span className="font-display text-lg tracking-tight text-kopi-ink md:text-xl">
              {item.title}
            </span>
          </div>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-kopi-ink-soft md:pl-9">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

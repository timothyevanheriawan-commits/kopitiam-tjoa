// Reusable Framer Motion variants — single source of truth so every
// component animates with the same easing/timing language instead of
// each one guessing its own numbers.

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export function staggerContainer(staggerChildren = 0.12, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

// One spring feel, reused everywhere — this is what makes it read as
// "one premium system" instead of "five components with five timings."
export const springTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

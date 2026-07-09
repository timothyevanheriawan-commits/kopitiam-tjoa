export const TAG_LABEL = {
  signature: "Resep Asli",
  best_seller: "Paling Laris",
} as const;

export type MenuTag = keyof typeof TAG_LABEL;

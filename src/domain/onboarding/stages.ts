export const STAGES = [
  'intro',
  'threeLists',
  'characteristics',
  'rating',
  'confirm',
  'focus',
  'complete',
] as const;

export type Stage = (typeof STAGES)[number];

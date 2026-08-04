// Tiny classnames joiner (no dependency). Filters falsy values.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

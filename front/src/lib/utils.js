import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
// Fonctions utilitaires (validation, helpers...)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

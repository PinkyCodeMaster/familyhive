import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map(word => word[0]?.toUpperCase())
    .join("")
    .slice(0, 3); // Limit to 3 chars for long names like "John Ronald Reuel Tolkien"
}

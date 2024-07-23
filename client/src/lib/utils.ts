import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*
combines class names and merges Tailwind CSS classes to avoid conflicts and ensure proper styling.
classValues are merged without conflict for usage dynamically based on components being used

clsx: A utility for constructing className strings conditionally. It takes various types of inputs 
(strings, objects, arrays) and returns a single string with all the class names.

twMerge: A utility from the tailwind-merge package that merges Tailwind CSS classes intelligently, 
ensuring no conflicting classes are applied (e.g., combining p-4 and p-2 correctly).
*/

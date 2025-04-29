import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

// Combines Tailwind classes conditionally and cleanly
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats date strings using Day.js
export const formatDate = (dateString: string): string => {
  try {
    return dayjs(dateString).format("MMMM DD, YYYY");
  } catch {
    return "Invalid Date";
  }
};

// Extracts a JSON object from markdown-style code blocks
export function parseMarkdownToJson(markdownText: string): unknown | null {
  const regex = /```json\s+([\s\S]+?)\s+```/;
  const match = markdownText.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Error parsing JSON from markdown:", error);
      return null;
    }
  }

  console.warn("No JSON block found in markdown.");
  return null;
}

// Attempts to parse a JSON string into a Trip object
export function parseTripData(jsonString: string): Trip | null {
  try {
    const data: Trip = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Failed to parse trip data:", error);
    return null;
  }
}

// Gets the first word from a string input safely
export function getFirstWord(input: unknown): string {
  if (typeof input !== "string") {
    console.warn("Expected a string in getFirstWord but got:", typeof input);
    return "";
  }

  return input.trim().split(/\s+/)[0] || "";
}

// Calculates month-over-month trend and percentage
export const calculateTrendPercentage = (
  countOfThisMonth: number,
  countOfLastMonth: number
): TrendResult => {
  if (countOfLastMonth === 0) {
    return countOfThisMonth === 0
      ? { trend: "no change", percentage: 0 }
      : { trend: "increment", percentage: 100 };
  }

  const change = countOfThisMonth - countOfLastMonth;
  const percentage = Math.abs((change / countOfLastMonth) * 100);

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no change", percentage: 0 };
  }
};

// Converts camelCase keys into readable labels
export const formatKey = (key: keyof TripFormData): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

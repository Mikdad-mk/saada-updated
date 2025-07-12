import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose from "mongoose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getModel<T>(name: string, schema: any) {
  return mongoose.models[name] || mongoose.model<T>(name, schema);
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const STATIC_UPLOAD_PREFIX = "/static/uploads/"

const normalizeRelativePath = (path: string) => {
  const trimmed = path.replace(/^\/+/, "")
  if (trimmed.startsWith("static/")) {
    return `/${trimmed}`
  }
  if (trimmed.startsWith("uploads/")) {
    return `/static/${trimmed}`
  }
  return `${STATIC_UPLOAD_PREFIX}${trimmed}`
}

export function buildImageUrl(path?: string | null) {
  if (!path) {
    return "/placeholder.svg"
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : normalizeRelativePath(path)
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (base) {
    return `${base}${normalizedPath}`
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${normalizedPath}`
  }

  return normalizedPath
}

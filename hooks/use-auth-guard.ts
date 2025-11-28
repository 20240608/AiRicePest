"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Redirects unauthenticated users to the sign-in page and returns whether the current
 * client session is authorized to view the guarded content.
 */
export function useAuthGuard(redirectTo: string = "/sign-in") {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    const verifyAuth = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.replace(redirectTo);
        return;
      }

      await Promise.resolve();
      if (active) {
        setIsAuthorized(true);
      }
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [redirectTo, router]);

  return isAuthorized;
}

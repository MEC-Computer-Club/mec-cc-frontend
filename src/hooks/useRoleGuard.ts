"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardOptions {
  redirect?: string;
}

export function useRoleGuard(
  allowedRoles: string[],
  options?: RoleGuardOptions
) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const userRole = String(user?.role || "").toLowerCase();
  const userClubRole = String(user?.clubRole || "").toLowerCase();

  const isAllowed = Boolean(
    user &&
      (allowedRoles.map((r) => r.toLowerCase()).includes(userRole) ||
        (userClubRole && allowedRoles.map((r) => r.toLowerCase()).includes(userClubRole)))
  );

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !isAllowed) {
      router.replace(options?.redirect || "/dashboard");
    }
  }, [isLoading, isAuthenticated, user, isAllowed, router, options?.redirect]);

  return { isAllowed, isLoading, role: userRole };
}

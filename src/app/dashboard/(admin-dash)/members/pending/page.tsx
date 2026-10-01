"use client";
import AdminPendingPage from "@/components/dashboard/PendingApplications";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const Page = () => {
  const { isAllowed, isLoading } = useRoleGuard(["admin", "moderator", "executive"]);
  if (isLoading || !isAllowed) return null;
  return <AdminPendingPage></AdminPendingPage>;
};

export default Page;

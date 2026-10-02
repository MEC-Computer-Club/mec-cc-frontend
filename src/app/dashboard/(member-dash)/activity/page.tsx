"use client";

import ActivityOverview from "@/components/dashboard/ActivityOverview";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const Page = () => {
  const { isAllowed, isLoading } = useRoleGuard(["member"]);
  if (isLoading || !isAllowed) return null;
  return <ActivityOverview />;
};

export default Page;

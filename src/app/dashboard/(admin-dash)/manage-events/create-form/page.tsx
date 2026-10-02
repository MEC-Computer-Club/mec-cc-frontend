"use client";

import { Suspense } from "react";
import FormBuilder from "@/components/form-builder/FormBuilder";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const CreateFormPage = () => {
  const { isAllowed, isLoading } = useRoleGuard(["admin", "moderator", "executive"]);

  if (isLoading || !isAllowed) return null;

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-text-secondary">Loading Form Builder...</div>}>
      <FormBuilder />
    </Suspense>
  );
};

export default CreateFormPage;

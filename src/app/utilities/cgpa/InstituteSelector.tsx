"use client";

import { School } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { DU_TECH_UNIT_INSTITUTES } from "@/data/syllabusCourses";

interface InstituteSelectorProps {
  selectedInstitute: string;
  onInstituteChange: (name: string) => void;
}

export function InstituteSelector({
  selectedInstitute,
  onInstituteChange,
}: InstituteSelectorProps) {
  const isValid = DU_TECH_UNIT_INSTITUTES.some((i) => i.value === selectedInstitute);
  const currentVal = isValid ? selectedInstitute : DU_TECH_UNIT_INSTITUTES[0].value;

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-mono font-bold tracking-wider text-text-secondary uppercase flex items-center gap-1.5">
        <School size={14} className="text-accent-primary" />
        College / Institute
      </label>

      <Select
        value={currentVal}
        onChange={(val) => onInstituteChange(val)}
        options={DU_TECH_UNIT_INSTITUTES}
        placeholder="Select College / Institute..."
      />
    </div>
  );
}

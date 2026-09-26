import { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [];

export function getExecTeam(): TeamMember[] {
  return teamMembers.filter((m) => m.isExec);
}

export function getPanelLeads(): TeamMember[] {
  return teamMembers.filter((m) => !m.isExec && m.department);
}

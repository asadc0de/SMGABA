export interface FirmStats {
  professionals: number;
  clients: number;
  experienceText: string;
  experienceLabel: string;
  yearsExperience: string | number | null;
  offices: number;
}

export const FIRM_STATS: FirmStats = {
  professionals: 40,
  clients: 2500,
  experienceText: "Decades",
  experienceLabel: "of Experience",
  yearsExperience: "Decades" as string | number | null,
  offices: 3,
};

export type Project = {
  id: string;
  name: string;
  popular_name: string;
  year: number;
  description: string;
  budget: string;
  eu_contribution: string;
  coordinates: [number, number];
  category: string;
  impact: string;
  official_link?: string;
};

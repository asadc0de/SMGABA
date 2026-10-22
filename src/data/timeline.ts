/**
 * Timeline data for "Our Story" company growth section.
 * Single source of truth for all milestone dates, descriptions, and intro copy.
 */

export type TimelineItem = {
  dateLabel: string;
  isoDate: string;
  title: string;
  description: string;
  future?: boolean;
};

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    dateLabel: "OCT 2015",
    isoDate: "2015-10",
    title: "SMG begins",
    description: "The start of the firm.",
  },
  {
    dateLabel: "JAN 2018",
    isoDate: "2018-01",
    title: "Islandia HQ",
    description: "Moves into its headquarters.",
  },
  {
    dateLabel: "NOV 2021",
    isoDate: "2021-11",
    title: "St. Petersburg",
    description: "Lori Hornby acquisition expands SMG into Florida.",
  },
  {
    dateLabel: "2022",
    isoDate: "2022",
    title: "Florida office",
    description: "Expands to 5,000 sq. ft.",
  },
  {
    dateLabel: "AUG 2025",
    isoDate: "2025-08",
    title: "Lynn Mark",
    description: "Acquisition adds to SMG's growth.",
  },
  {
    dateLabel: "MAR 2026",
    isoDate: "2026-03",
    title: "Islandia HQ",
    description: "Headquarters acquired and expanded.",
  },
  {
    dateLabel: "OCT 2030",
    isoDate: "2030-10",
    title: "15 years",
    description: "Our 15-year milestone ahead in 2030.",
    future: true,
  },
];

export const TIMELINE_INTRO = {
  eyebrow: "SMG ABA · OUR STORY",
  heading: "Built on relationships. Growing with purpose.",
  subheading: "A decade of growth, with our 15-year milestone ahead in 2030.",
};

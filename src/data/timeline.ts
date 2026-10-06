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
    dateLabel: "Oct 2015",
    isoDate: "2015-10",
    title: "SMG begins",
    description: "The start of the firm.",
  },
  {
    dateLabel: "Jan 2018",
    isoDate: "2018-01",
    title: "Islandia HQ",
    description: "Moves into its headquarters.",
  },
  {
    dateLabel: "Nov 2021",
    isoDate: "2021-11",
    title: "Florida expansion",
    description: "Lori Hornby's practice joins SMG.",
  },
  {
    dateLabel: "2022",
    isoDate: "2022",
    title: "St. Pete expansion",
    description: "Expanded regional office facilities.",
  },
  {
    dateLabel: "Aug 2025",
    isoDate: "2025-08",
    title: "Continued growth",
    description: "Lynn Mark's practice joins SMG.",
  },
  {
    dateLabel: "Mar 2026",
    isoDate: "2026-03",
    title: "HQ expansion",
    description: "Islandia headquarters expansion.",
  },
  {
    dateLabel: "Oct 2030",
    isoDate: "2030-10",
    title: "15 years",
    description: "Our next milestone.",
    future: true,
  },
];

export const TIMELINE_INTRO = {
  eyebrow: "SMG ABA · Our Story",
  heading: "Built on relationships. Growing with purpose.",
  subheading: "A decade of growth, with our 15-year milestone ahead in 2030.",
};

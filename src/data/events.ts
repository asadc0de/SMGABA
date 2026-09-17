/**
 * Static Fallback and Seed Data for Events & Webinars
 * Single source of truth for predefined events when Supabase is offline or during local dev.
 */

export interface EventItem {
  id: string; // Slug identifier, e.g. "dress-your-business-webinar"
  title: string;
  subtitle?: string;
  host: string;
  host_title?: string;
  event_date: string; // ISO date "YYYY-MM-DD"
  time_range: string; // e.g. "2:30 - 3:30 PM"
  description: string;
  registration_link: string;
  recording_link?: string | null;
  thumbnail_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const EVENTS: EventItem[] = [
  {
    id: "dress-your-business-webinar",
    title: "DRESS your Business for Success",
    subtitle: "For Business Owners and CEO's",
    host: "Gregory M. Scotto",
    host_title: "CPA",
    event_date: "2026-09-10",
    time_range: "2:30 - 3:30 PM",
    description:
      "Join Managing Partner Gregory M. Scotto, CPA for an in-depth session detailing the crucial legal and accounting structures modern businesses need. Learn compliance checklists, risk mitigation strategies, and how to present your company to lenders and investors with institutional confidence.",
    registration_link: "https://www.smgaba.com/dress-your-business-webinar",
    recording_link: undefined,
    thumbnail_url: null,
    created_at: "2026-09-01T12:00:00.000Z",
  },
  {
    id: "accounts-payable-webinar",
    title: "Accounts Payable",
    subtitle: "Bill Pay and Software Integration",
    host: "Kinshuk Sharma",
    host_title: undefined,
    event_date: "2026-09-17",
    time_range: "2:30 - 3:30 PM",
    description:
      "Accounting Manager Kinshuk Sharma breaks down the modern AP tech stack. Discover how automated three-way matching, secure payment gateways, and real-time ledger sync eliminate bottlenecks and protect your business against supplier payment fraud.",
    registration_link: "https://www.smgaba.com/accounts-payable-webinar",
    recording_link: undefined,
    thumbnail_url: null,
    created_at: "2026-09-01T12:00:00.000Z",
  },
  {
    id: "business-structure-webinar",
    title: "Business Structure Decisions",
    subtitle: "What Every Owner Should Consider",
    host: "Marc Valente",
    host_title: "CPA",
    event_date: "2026-09-24",
    time_range: "10:00 - 11:00 AM",
    description:
      "Partner Marc Valente, CPA guides business owners through the nuances of entity formation. Understand pass-through taxation, reasonable compensation guidelines, state franchise taxes, and when restructuring your business saves thousands in annual tax liability.",
    registration_link: "https://www.smgaba.com/business-structure-webinar",
    recording_link: undefined,
    thumbnail_url: null,
    created_at: "2026-09-01T12:00:00.000Z",
  },
  {
    id: "year-end-tax-planning-webinar",
    title: "Year End Tax Planning",
    subtitle: "and Strategies for Business Owners",
    host: "Corey Adams",
    host_title: "CPA, CFP",
    event_date: "2026-09-30",
    time_range: "2:00 - 3:00 PM",
    description:
      "Senior Tax Manager Corey Adams, CPA, CFP shares proactive tax strategies to implement before December 31st. Topics include Section 179 depreciation acceleration, retirement plan contributions, timing income and expenses, and wealth transfer planning.",
    registration_link: "https://www.smgaba.com/year-end-tax-planning-webinar",
    recording_link: undefined,
    thumbnail_url: null,
    created_at: "2026-09-01T12:00:00.000Z",
  },
];

/**
 * Determines whether an event is in the upcoming or past state.
 * Compares event_date (YYYY-MM-DD) against the current date string (YYYY-MM-DD).
 */
export function getEventStatus(
  event: Pick<EventItem, "event_date">,
  referenceDate = new Date(),
): "upcoming" | "past" {
  const eventDateStr = event.event_date.slice(0, 10);
  const nowStr = referenceDate.toISOString().slice(0, 10);
  return eventDateStr >= nowStr ? "upcoming" : "past";
}

/**
 * Returns upcoming events sorted in ascending order (soonest event first).
 */
export function getUpcomingEvents(
  events: EventItem[],
  referenceDate = new Date(),
): EventItem[] {
  return events
    .filter((e) => getEventStatus(e, referenceDate) === "upcoming")
    .sort((a, b) => a.event_date.localeCompare(b.event_date));
}

/**
 * Returns past events sorted in descending order (most recently passed event first).
 */
export function getPastEvents(
  events: EventItem[],
  referenceDate = new Date(),
): EventItem[] {
  return events
    .filter((e) => getEventStatus(e, referenceDate) === "past")
    .sort((a, b) => b.event_date.localeCompare(a.event_date));
}

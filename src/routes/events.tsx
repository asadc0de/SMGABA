import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ExternalLink,
  Play,
  Video,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { Button } from "@/components/ui/button";
import { getPublicEventsFeed } from "@/lib/events-admin";
import {
  getUpcomingEvents,
  getPastEvents,
  getEventStatus,
  type EventItem,
} from "@/data/events";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Webinars | SMG ABA Accountants & Advisors" },
      {
        name: "description",
        content:
          "Explore upcoming educational webinars and watch on-demand recordings hosted by SMG ABA partners and accounting specialists.",
      },
    ],
  }),
  loader: async () => {
    try {
      const { events } = await getPublicEventsFeed();
      return { events };
    } catch (err) {
      console.error("Error loading events feed:", err);
      return { events: [] };
    }
  },
  component: EventsPage,
});

function formatEventDisplayDate(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
      return d.toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function EventCard({ event }: { event: EventItem }) {
  const [imgError, setImgError] = useState(false);
  const status = getEventStatus(event);
  const isUpcoming = status === "upcoming";
  const hasRecording = Boolean(event.recording_link && event.recording_link.trim());
  const showImage = Boolean(event.thumbnail_url && event.thumbnail_url.trim() && !imgError);

  return (
    <div
      className={cn(
        "group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40",
        !isUpcoming && "opacity-95"
      )}
      id={`event-${event.id}`}
    >
      {/* Left: Thumbnail (fixed width on desktop) */}
      <div className="relative w-full md:w-[380px] lg:w-[420px] shrink-0 overflow-hidden bg-slate-900">
        {showImage ? (
          <img
            src={event.thumbnail_url!}
            alt={event.title}
            onError={() => setImgError(true)}
            className={cn(
              "size-full object-contain transition-transform duration-500 group-hover:scale-105",
              !isUpcoming && "filter brightness-[0.88] contrast-95"
            )}
          />
        ) : (
          /* Branded Elegant Fallback Banner */
          <div
            className={cn(
              "relative size-full min-h-[200px] flex flex-col items-center justify-center p-6 text-white overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]",
              isUpcoming
                ? "bg-gradient-to-br from-[#0c1833] via-[#162d5c] to-[#1e3e7b]"
                : "bg-gradient-to-br from-[#091122] via-[#12203e] to-[#0f1d38]"
            )}
          >
            <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 pointer-events-none">
              <CalendarIcon className="size-32" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border shadow-inner",
                  isUpcoming
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-slate-300"
                )}
              >
                {isUpcoming ? (
                  <Sparkles className="size-4 text-blue-300" />
                ) : (
                  <Video className="size-4 text-slate-300" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-blue-200/80">
                  SMG ABA Webinar Series
                </span>
                <p className="font-serif-hero text-sm font-bold text-white/95 line-clamp-2 max-w-[220px]">
                  {event.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/95 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-md border border-white/20">
              <Sparkles className="size-3 text-blue-200" /> Upcoming Webinar
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-slate-200 shadow-lg backdrop-blur-md border border-white/15">
              <Video className="size-3 text-slate-400" /> Past Recording
            </span>
          )}
        </div>
      </div>

      {/* Right: Content + CTA */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-3">
          {/* Date & Time Row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5 font-bold text-navy">
              <CalendarIcon className="size-3.5 text-primary" />
              {formatEventDisplayDate(event.event_date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {event.time_range}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="font-serif-hero text-lg sm:text-xl font-bold text-navy leading-snug tracking-tight group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            {event.subtitle && (
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
                {event.subtitle}
              </p>
            )}
          </div>

          {/* Host Speaker */}
          <div className="flex items-center gap-2 text-xs text-navy font-semibold">
            <div className="flex size-6 items-center justify-center rounded-full bg-navy/10 text-navy">
              <User className="size-3" />
            </div>
            <div>
              <span className="text-muted-foreground font-normal">Presented by </span>
              <span className="font-bold text-navy">
                {event.host}
                {event.host_title && `, ${event.host_title}`}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-3 border-t border-border/60">
          {isUpcoming ? (
            <Button
              asChild
              className="rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold py-2.5 px-6 shadow-xs transition-transform active:scale-[0.99]"
            >
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                title={`Register for ${event.title}`}
              >
                Register Now
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          ) : hasRecording ? (
            <Button
              asChild
              className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-semibold py-2.5 px-6 shadow-xs transition-transform active:scale-[0.99]"
            >
              <a
                href={event.recording_link!}
                target="_blank"
                rel="noopener noreferrer"
                title={`Watch recording of ${event.title}`}
              >
                <Play className="mr-2 size-4 fill-current" />
                Watch Recording
                <ExternalLink className="ml-2 size-4 opacity-80" />
              </a>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="rounded-xl border-dashed border-border/80 text-muted-foreground bg-secondary/40 font-medium py-2.5 px-6 cursor-not-allowed opacity-70"
            >
              <Clock className="mr-2 size-4" />
              Recording Coming Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const loaderData = Route.useLoaderData();
  const allEvents = loaderData?.events || [];

  const upcomingEvents = useMemo(() => getUpcomingEvents(allEvents), [allEvents]);
  const pastEvents = useMemo(() => getPastEvents(allEvents), [allEvents]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      <Header />

      <main className="flex-1">
        {/* Subpage Hero */}
        <SubpageHero
          bgImage="https://www.smgaba.com/wp-content/uploads/2021/11/smg-wallpaper.jpg"
          eyebrow="Knowledge & Insights"
          title="Events & Webinars"
          description="Join SMG ABA partners and accounting leaders for live executive webinars, practical structuring workshops, and on-demand financial masterclasses."
        />

        {/* Section 1: Upcoming Webinars */}
        <section className="py-16 sm:py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="size-3.5" />
                Live Sessions
              </div>
              <h2 className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">
                Upcoming Webinars & Workshops
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                Register in advance to reserve your spot and receive live Microsoft Teams access links and session calendar reminders.
              </p>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Showing <strong className="text-navy">{upcomingEvents.length}</strong> upcoming session
              {upcomingEvents.length === 1 ? "" : "s"}
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="my-12 text-center py-16 px-4 card-surface rounded-2xl border-border/70">
              <CalendarIcon className="size-12 mx-auto text-muted-foreground/60 mb-3" />
              <h3 className="text-base font-bold text-navy">No Live Sessions Scheduled Right Now</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-1">
                We regularly add new webinars covering tax strategy, bookkeeping modernizations, and financial advisory. Browse our on-demand recordings below!
              </p>
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: On-Demand Recording Library */}
        <section className="py-16 sm:py-20 bg-secondary/30 border-t border-border/70">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-border/70">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Video className="size-3.5" />
                  Past Sessions
                </div>
                <h2 className="font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">
                  On-Demand Webinar Library
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  Catch up on previous broadcasts. Video recordings are published here following live sessions.
                </p>
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                Showing <strong className="text-navy">{pastEvents.length}</strong> past session
                {pastEvents.length === 1 ? "" : "s"}
              </div>
            </div>

            {pastEvents.length === 0 ? (
              <div className="my-12 text-center py-16 px-4 card-surface rounded-2xl border-border/70">
                <Video className="size-12 mx-auto text-muted-foreground/60 mb-3" />
                <h3 className="text-base font-bold text-navy">All Events Are Currently Upcoming</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                  Once an event date passes, its card automatically transitions here so attendees can access the recording.
                </p>
              </div>
            ) : (
              <div className="mt-10 flex flex-col gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Consultation Call to Action */}
        <section className="py-16 px-6 lg:px-12 max-w-5xl mx-auto text-center">
          <div className="card-surface p-8 sm:p-12 rounded-3xl border-primary/20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-navy/20 dark:to-transparent space-y-4">
            <h3 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
              Have Questions About a Webinar Topic?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Our partners and advisory team are available for one-on-one discovery consultations tailored to your business structure, tax scenario, and financial goals.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-full bg-navy text-white hover:bg-navy/90 font-bold shadow-md">
                <a href="/islandia-location">Schedule a Consultation</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

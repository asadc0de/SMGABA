import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Globe,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  FileText,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookanappointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment - SMG Accountants, Bookkeepers & Advisors" },
      {
        name: "description",
        content:
          "Schedule a discovery call or consultation with SMG ABA accounting and tax experts to discuss bookkeeping, tax planning, and fractional CFO advisory.",
      },
    ],
  }),
  component: BookAnAppointmentPage,
});

const SERVICES = [
  {
    id: "discovery",
    host: "Cynthia Cortes",
    hostTitle: "Onboarding Manager",
    title: "New Client Discovery Call",
    duration: "30 min",
    location: "Web conferencing details provided upon confirmation.",
    desc: "This will be a discovery call to learn more information about your accounting and tax needs, as well as for us to provide information about our team at SMG and how you can work with us. Calls are typically 15-30 minutes.",
  },
  {
    id: "cfo",
    host: "Dominic Savino / Alejandro García",
    hostTitle: "Executive CFO Advisory",
    title: "CFO Advisory Strategy Session",
    duration: "45 min",
    location: "Web conferencing details provided upon confirmation.",
    desc: "Explore executive-level financial leadership including cash-flow forecasting, operational KPI benchmarking, budgeting, and strategic growth tailored to your business.",
  },
  {
    id: "tax",
    host: "Mohammed Syed / Kevin Levine",
    hostTitle: "Tax Directors",
    title: "Tax Planning & Compliance Review",
    duration: "30 min",
    location: "Web conferencing details provided upon confirmation.",
    desc: "Proactive evaluation of your multi-state tax position, corporate entity structure, credits/deductions, and year-round filing strategy.",
  },
  {
    id: "bookkeeping",
    host: "Kinshuk Sharma",
    hostTitle: "Accounting Manager",
    title: "Outsourced Bookkeeping Consultation",
    duration: "30 min",
    location: "Web conferencing details provided upon confirmation.",
    desc: "Review your chart of accounts, monthly close procedures, payroll integration, and financial reporting dashboards.",
  },
];

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const TIMEZONES = [
  "Eastern Time - US & Canada (ET)",
  "Central Time - US & Canada (CT)",
  "Mountain Time - US & Canada (MT)",
  "Pacific Time - US & Canada (PT)",
  "Greenwich Mean Time (UTC/GMT)",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function BookAnAppointmentPage() {
  const [selectedServiceId, setSelectedServiceId] = useState("discovery");
  
  // Date selection state (Default: September 2026 or current active month)
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(() => {
    // Pick upcoming weekday
    const d = today.getDate() + 1;
    return d > 28 ? 15 : d;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 AM");
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0]);
  
  // Booking Form State
  const [step, setStep] = useState<"calendar" | "details" | "confirmed">("calendar");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0],
    [selectedServiceId]
  );

  // Calendar logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  // Normalize so Monday is column 0 (Mon-Sun format)
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setStep("confirmed");
  };

  return (
    <div className="min-h-screen bg-white text-[#1c2d42] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        {/* =========================================================================
            1. SUBPAGE HERO
           ========================================================================= */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Direct Expert Access"
          title="Book an Appointment"
          description="Schedule a complimentary discovery call or advisory session with SMG's accounting, tax, and CFO specialists to plan smarter for the future."
          buttonText="CHOOSE MEETING TYPE"
          buttonHref="#booking-engine"
        />

        {/* =========================================================================
            2. INTERACTIVE CALENDAR & SCHEDULING WIDGET
           ========================================================================= */}
        <section id="booking-engine" className="py-16 sm:py-24 bg-[#f8fafc]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Service Tabs */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedServiceId(s.id);
                    setStep("calendar");
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold transition-all",
                    selectedServiceId === s.id
                      ? "bg-[#142340] text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#142340]"
                  )}
                >
                  {s.title} ({s.duration})
                </button>
              ))}
            </div>

            {/* Main Booking Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
              {step === "confirmed" ? (
                /* ================= STEP 3: CONFIRMATION SUCCESS ================= */
                <div className="p-8 sm:p-14 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                    Appointment Confirmed
                  </span>
                  <h2 className="mt-4 font-serif-hero text-2xl sm:text-3xl font-bold text-[#142340]">
                    You are scheduled with {selectedService.host}!
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    A calendar invitation and web conferencing details have been sent to{" "}
                    <strong className="text-slate-900">{formData.email}</strong>.
                  </p>

                  <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-left space-y-3 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="size-4 text-[#1b4e94]" />
                      <span>
                        <strong>Date:</strong> {MONTH_NAMES[currentMonth]} {selectedDate}, {currentYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="size-4 text-[#1b4e94]" />
                      <span>
                        <strong>Time:</strong> {selectedTime} ({selectedTimezone})
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Video className="size-4 text-[#1b4e94]" />
                      <span>
                        <strong>Meeting:</strong> {selectedService.title} ({selectedService.duration})
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setStep("calendar");
                        setFormData({ fullName: "", email: "", phone: "", company: "", notes: "" });
                      }}
                      className="rounded-full bg-[#1b4e94] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#142340] transition"
                    >
                      Book Another Meeting
                    </button>
                    <a
                      href="/resources"
                      className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition"
                    >
                      Back to Resources
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* Left Column: Host Profile & Event Overview */}
                  <div className="lg:col-span-5 p-6 sm:p-10 bg-[#fafbfe] flex flex-col justify-between">
                    <div>
                      {/* SMG Mini Brand Badge */}
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#142340] text-white font-serif-hero font-bold text-xs shadow-xs">
                          SMG
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#142340]">SMG ABA</div>
                          <div className="text-[0.65rem] text-slate-400 font-semibold uppercase tracking-wider">
                            Accountants & Advisors
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold uppercase tracking-wider text-[#1b4e94] mb-1">
                        {selectedService.host} &bull; {selectedService.hostTitle}
                      </div>
                      <h3 className="font-serif-hero text-2xl font-bold text-[#142340]">
                        {selectedService.title}
                      </h3>

                      <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-slate-400" />
                          <span>{selectedService.duration}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Video className="size-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedService.location}</span>
                        </div>
                      </div>

                      <p className="mt-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 pt-6">
                        {selectedService.desc}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-[0.7rem] text-slate-400">
                      <a href="/privacy-policy-2" className="hover:text-[#1b4e94] transition-colors underline">
                        Privacy Policy
                      </a>
                      <span>Confidential & Secure</span>
                    </div>
                  </div>

                  {/* Right Column: Calendar / Details Steps */}
                  <div className="lg:col-span-7 p-6 sm:p-10 bg-white">
                    {step === "calendar" ? (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-serif-hero text-lg font-bold text-[#142340]">
                            Select a Date & Time
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                              aria-label="Previous month"
                            >
                              <ChevronLeft className="size-4" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 min-w-28 text-center">
                              {MONTH_NAMES[currentMonth]} {currentYear}
                            </span>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                              aria-label="Next month"
                            >
                              <ChevronRight className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="mb-6">
                          <div className="grid grid-cols-7 gap-1 text-center text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </div>

                          <div className="grid grid-cols-7 gap-1.5 text-center">
                            {/* Empty offset days */}
                            {Array.from({ length: startOffset }).map((_, i) => (
                              <div key={`empty-${i}`} className="h-9 sm:h-10" />
                            ))}

                            {/* Month Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const dateObj = new Date(currentYear, currentMonth, day);
                              const dayOfWeek = dateObj.getDay();
                              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                              const isSelected = selectedDate === day;

                              return (
                                <button
                                  key={`day-${day}`}
                                  type="button"
                                  disabled={isWeekend}
                                  onClick={() => setSelectedDate(day)}
                                  className={cn(
                                    "relative flex h-9 sm:h-10 items-center justify-center rounded-xl text-xs font-bold transition-all",
                                    isSelected
                                      ? "bg-[#1b4e94] text-white shadow-md font-extrabold scale-105"
                                      : isWeekend
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#1b4e94] hover:font-bold"
                                  )}
                                >
                                  {day}
                                  {!isWeekend && !isSelected && (
                                    <span className="absolute bottom-1 size-1 rounded-full bg-blue-500/50" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Timezone Selector */}
                        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
                          <Globe className="size-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-600">Time zone:</span>
                          <select
                            value={selectedTimezone}
                            onChange={(e) => setSelectedTimezone(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#1b4e94]"
                          >
                            {TIMEZONES.map((tz) => (
                              <option key={tz} value={tz}>
                                {tz}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Available Time Slots when Date is Selected */}
                        {selectedDate && (
                          <div className="border-t border-slate-100 pt-6 animate-in fade-in duration-200">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-[#142340] mb-3">
                              Available Times for {MONTH_NAMES[currentMonth]} {selectedDate}
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {TIME_SLOTS.map((time) => {
                                const isTimeSelected = selectedTime === time;
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => setSelectedTime(time)}
                                    className={cn(
                                      "rounded-xl py-2 px-3 text-xs font-bold transition-all text-center",
                                      isTimeSelected
                                        ? "bg-[#142340] text-white shadow-sm ring-2 ring-[#1b4e94]"
                                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#1b4e94] hover:text-[#1b4e94]"
                                    )}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>

                            {selectedTime && (
                              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="text-xs text-slate-600">
                                  Selected: <strong>{MONTH_NAMES[currentMonth]} {selectedDate}</strong> at{" "}
                                  <strong>{selectedTime}</strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setStep("details")}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1b4e94] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#142340] transition"
                                >
                                  <span>Next Step</span>
                                  <ArrowRight className="size-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ================= STEP 2: ATTENDEE DETAILS ================= */
                      <form onSubmit={handleBookingSubmit} className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div>
                            <h4 className="font-serif-hero text-lg font-bold text-[#142340]">
                              Enter Your Details
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {MONTH_NAMES[currentMonth]} {selectedDate}, {currentYear} at {selectedTime}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep("calendar")}
                            className="text-xs font-bold text-[#1b4e94] hover:underline"
                          >
                            &larr; Change Date
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b4e94] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b4e94] focus:outline-none"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="(555) 000-0000"
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b4e94] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Company / Business Name
                            </label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Acme Enterprises LLC"
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b4e94] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Please share anything that will help prepare for our meeting:
                          </label>
                          <textarea
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Tell us about your business goals, current pain points, or timeline..."
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#1b4e94] focus:outline-none resize-none"
                          />
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setStep("calendar")}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="rounded-full bg-[#1b4e94] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#142340] transition"
                          >
                            Schedule Event
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Resources CTA matching live site */}
            <div className="mt-12 text-center">
              <a
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full bg-[#142340] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#1b4e94] hover:scale-105"
              >
                <span>BACK TO RESOURCES</span>
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. "LET'S TALK" CONSULTATION & INQUIRY FORM
           ========================================================================= */}
        <div id="contact-form">
          <QuoteForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

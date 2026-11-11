import { useMemo, useState } from "react";
import { createRoute, useLoaderData, type AnyRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCareers, getOnboardingGuide, getPublishedCmsPage, getPublicBlog, getPublicBlogs, getPublicEvents, resolveCmsRedirect, resolveWebinarRedirect } from "@/lib/api/client";
import type { PublicBlogPost, PublicEvent } from "@/lib/api/contracts";
import { ONBOARDING_GUIDES, SECURITY_NOTICE, type OnboardingGuide } from "@/data/onboardingGuides";
import { Render } from "@puckeditor/core";
import { puckRenderConfig } from "@/cms/render.config";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function BlogCard({ post }: { post: PublicBlogPost }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
      {post.image && <img src={post.image} alt="" className="h-48 w-full object-cover" loading="lazy" />}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <h2 className="font-serif-hero text-xl font-bold text-navy">{post.title}</h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <a className="inline-flex items-center gap-2 text-sm font-bold text-primary" href={`/blog/${post.slug}`}>
          Read article <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}

export function StaticBlogIndex() {
  const { posts } = useLoaderData({ from: "/blog/" }) as { posts: PublicBlogPost[] };
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => posts.filter((post) => `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query.toLowerCase())),
    [posts, query],
  );

  return (
    <PageShell>
      <main>
        <SubpageHero
          bgImage="/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.webp"
          eyebrow="Financial Intelligence"
          title="Insights & Advisory Blog"
          description="Actionable guidance, tax regulations, outsourced bookkeeping strategies, and financial insights to propel your business forward."
        />
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles..." className="rounded-full pl-10" />
          </div>
          {filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
          ) : (
            <p className="rounded-xl border border-border p-8 text-center text-muted-foreground">No published articles matched your search.</p>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function ArticleBody({ post }: { post: PublicBlogPost }) {
  return (
    <article className="mx-auto max-w-4xl space-y-6 px-6 py-12 text-base leading-relaxed text-foreground/90 lg:px-8">
      {post.blocks.map((rawBlock, index) => {
        const block = rawBlock as { type?: string; text?: string; html?: string };
        if (block.html?.includes("<")) {
          return <div key={index} dangerouslySetInnerHTML={{ __html: block.html }} />;
        }
        if (block.type === "h2") return <h2 key={index} className="border-t border-border/40 pt-6 font-serif-hero text-2xl font-bold text-navy">{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index} className="font-serif-hero text-xl font-bold text-navy">{block.text}</h3>;
        return <p key={index}>{block.text}</p>;
      })}
    </article>
  );
}

export function StaticBlogDetail() {
  const { post } = useLoaderData({ from: "/blog/$slug" }) as { post: PublicBlogPost | null };
  if (!post) {
    return <PageShell><main className="px-6 py-32 text-center"><h1 className="font-serif-hero text-3xl font-bold text-navy">Article Not Found</h1><a className="mt-4 inline-block text-primary" href="/blog">Back to Blog</a></main></PageShell>;
  }
  return (
    <PageShell>
      <main>
        <div className="bg-gradient-to-b from-[#0e1b36] via-[#162a52] to-[#0f2040] px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300">{post.category} · {post.date}</div>
            <h1 className="mt-4 font-serif-hero text-4xl font-bold">{post.h1 || post.title}</h1>
            <p className="mt-5 max-w-3xl text-slate-200">{post.excerpt}</p>
          </div>
        </div>
        {post.image && <img src={post.image} alt={post.title} className="mx-auto -mt-8 block aspect-video w-[min(90%,56rem)] rounded-2xl object-cover shadow-2xl" />}
        <ArticleBody post={post} />
      </main>
    </PageShell>
  );
}

export function StaticCareers() {
  const data = useLoaderData({ from: "/careers" }) as Awaited<ReturnType<typeof getCareers>>;
  const [query, setQuery] = useState("");
  const jobs = data.jobs.filter((job) => `${job.title} ${job.city} ${job.state} ${job.department}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <PageShell>
      <main>
        <SubpageHero bgImage="/images/stock/unsplash-photo-1497366216548-37526070297c.webp" eyebrow="Join Our Team" title="Careers at SMG" description="Explore open positions and join our team." />
        <section className="mx-auto max-w-6xl px-6 py-12">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search positions..." className="mb-8 max-w-md rounded-full" />
          {data.error && !data.jobs.length ? <p className="rounded-xl border border-destructive/30 p-8 text-center text-destructive">{data.error}</p> : (
            <div className="space-y-4">{jobs.map((job) => <article key={job.referenceNumber} className="rounded-2xl border border-border bg-card p-6"><h2 className="font-serif-hero text-xl font-bold text-navy">{job.title}</h2><p className="mt-2 text-sm text-muted-foreground">{[job.city, job.state, job.employmentType].filter(Boolean).join(" · ")}</p><p className="mt-3 line-clamp-3 text-sm">{job.plainDescription}</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary" href={job.applyurl || job.url} target="_blank" rel="noreferrer">View position <ArrowRight className="size-4" /></a></article>)}</div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function EventCard({ event }: { event: PublicEvent }) {
  return <article className="rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1"><Calendar className="size-3.5" />{event.event_date}</span><span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{event.time_range} {event.time_zone || event.timeZone}</span></div><h2 className="mt-3 font-serif-hero text-xl font-bold text-navy">{event.title}</h2><p className="mt-2 text-sm text-muted-foreground">{event.subtitle}</p><p className="mt-3 text-sm leading-relaxed">{event.description}</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary" href={event.recordingUrl || event.recording_link || event.registration_link} target="_blank" rel="noreferrer">{event.recordingUrl || event.recording_link ? "Watch recording" : "Register"} <ArrowRight className="size-4" /></a></article>;
}

export function StaticEvents() {
  const { events } = useLoaderData({ from: "/events" }) as Awaited<ReturnType<typeof getPublicEvents>>;
  return <PageShell><main><SubpageHero bgImage="/images/stock/unsplash-photo-1497366216548-37526070297c.webp" eyebrow="Learn & Connect" title="Events & Webinars" description="Explore upcoming educational webinars and watch on-demand recordings." /><section className="mx-auto max-w-6xl space-y-5 px-6 py-12">{events.map((event) => <EventCard key={event.id} event={event} />)}</section></main></PageShell>;
}

export function StaticOnboarding() {
  const { guide } = useLoaderData({ from: "/onboarding/$office" }) as { guide: OnboardingGuide };
  const sections = Object.values(guide.sections);
  return <PageShell><main><SubpageHero bgImage="/images/stock/unsplash-photo-1497366216548-37526070297c.webp" eyebrow={`Client Onboarding · ${guide.label} Office`} title={guide.welcomeTitle} description={guide.subtitle} /><section className="mx-auto max-w-5xl space-y-8 px-6 py-12"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><strong>Security Notice:</strong> {SECURITY_NOTICE}</div><div className="rounded-2xl border border-border bg-card p-6"><h2 className="font-serif-hero text-2xl font-bold text-navy">{guide.pageTitle}</h2>{guide.introParagraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-relaxed">{paragraph}</p>)}</div><Accordion type="multiple">{sections.map((section) => <AccordionItem key={section.id} value={section.id}><AccordionTrigger>{section.title}</AccordionTrigger><AccordionContent><div className="space-y-4">{section.providers.map((provider) => <div key={provider.id} className="rounded-xl border border-border p-4"><h3 className="font-bold text-navy">{provider.name}</h3><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{provider.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>)}</div></AccordionContent></AccordionItem>)}</Accordion></section></main></PageShell>;
}

export function StaticCmsPage() {
  const { page } = useLoaderData({ from: "/$slug" }) as Awaited<ReturnType<typeof getPublishedCmsPage>>;
  if (!page) {
    return <PageShell><main className="px-6 py-32 text-center"><h1 className="font-serif-hero text-3xl font-bold text-navy">Page Not Found</h1><a className="mt-4 inline-block text-primary" href="/">Go to Homepage</a></main></PageShell>;
  }
  return <PageShell><main><div className="mx-auto max-w-6xl px-6 pb-16 pt-28"><h1 className="font-serif-hero text-4xl font-bold text-navy">{page.title}</h1>{page.data ? <div className="mt-8"><Render config={puckRenderConfig} data={page.data as never} /></div> : null}</div></main></PageShell>;
}

export function createStaticPublicRoutes(rootRoute: AnyRoute) {
  const blogIndex = createRoute({ getParentRoute: () => rootRoute, path: "/blog/", loader: () => getPublicBlogs(), component: StaticBlogIndex });
  const blogDetail = createRoute({ getParentRoute: () => rootRoute, path: "/blog/$slug", loader: ({ params }) => getPublicBlog(params.slug), component: StaticBlogDetail });
  const careers = createRoute({ getParentRoute: () => rootRoute, path: "/careers", loader: () => getCareers(), component: StaticCareers });
  const events = createRoute({ getParentRoute: () => rootRoute, path: "/events", loader: () => getPublicEvents(), component: StaticEvents });
  const onboarding = createRoute({ getParentRoute: () => rootRoute, path: "/onboarding/$office", loader: async ({ params }) => { try { return await getOnboardingGuide(params.office); } catch { return { office: params.office === "fl" ? "fl" : "ny", guide: ONBOARDING_GUIDES[params.office === "fl" ? "fl" : "ny"] }; } }, component: StaticOnboarding });
  const cmsPage = createRoute({
    getParentRoute: () => rootRoute,
    path: "/$slug",
    loader: async ({ params }) => {
      const currentPath = `/${params.slug}`;
      const cms = await getPublishedCmsPage(params.slug).catch(() => ({ page: null, error: null }));
      if (cms.page) return cms;
      const cmsRedirect = await resolveCmsRedirect(currentPath);
      const webinarRedirect = await resolveWebinarRedirect(params.slug);
      const redirect = cmsRedirect.redirect || webinarRedirect.redirect;
      if (redirect?.destination) {
        window.location.assign(redirect.destination);
      }
      return { page: null, error: null };
    },
    component: StaticCmsPage,
  });
  return [blogIndex, blogDetail, careers, events, onboarding, cmsPage] as const;
}

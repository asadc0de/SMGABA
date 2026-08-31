import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Share2,
  ChevronRight,
  ArrowLeft,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { BlogPost, BLOG_POSTS } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { QuoteForm } from "@/components/site/QuoteForm";

interface BlogPostViewProps {
  post: BlogPost;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find related posts
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .filter((p) => p.category === post.category || true)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 lg:pt-28">
        {/* Article Header & Hero */}
        <div className="border-b border-border/60 bg-gradient-to-b from-[#0e1b36] via-[#162a52] to-[#0f2040] text-white py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300/80">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <ChevronRight className="size-3 text-slate-400" />
              <a href="/blog" className="hover:text-white transition-colors">
                Blog
              </a>
              <ChevronRight className="size-3 text-slate-400" />
              <span className="text-blue-300 truncate max-w-xs">{post.category}</span>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Calendar className="size-3.5 text-blue-400" />
                <span>{post.date}</span>
              </div>
              <span className="text-slate-500">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Clock className="size-3.5 text-blue-400" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="mt-4 font-serif-hero text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              {post.h1 || post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md">
                  <User className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{post.author}</div>
                  <div className="text-xs text-slate-300">SMG Accounting, Bookkeeping & Advisory</div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs gap-1.5"
                >
                  {copied ? <Check className="size-3.5 text-green-400" /> : <Share2 className="size-3.5" />}
                  <span>{copied ? "Copied!" : "Share"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-6 sm:-mt-8">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-2xl bg-muted aspect-16/9 sm:aspect-21/9 relative">
              <img
                src={post.image}
                alt={post.title}
                className="size-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Main Content Body */}
            <article className="lg:col-span-12 space-y-6 text-foreground/90 text-base sm:text-lg leading-relaxed">
              {post.blocks.map((block, idx) => {
                if (block.type === "h2") {
                  return (
                    <h2
                      key={idx}
                      className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy pt-6 border-t border-border/40 first:border-0 first:pt-0"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "h3") {
                  return (
                    <h3 key={idx} className="font-serif-hero text-xl sm:text-2xl font-bold text-navy pt-4">
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === "h4") {
                  return (
                    <h4 key={idx} className="text-lg font-bold text-navy pt-2">
                      {block.text}
                    </h4>
                  );
                }

                if (block.type === "p") {
                  if (block.html && block.html.includes("<")) {
                    return (
                      <p
                        key={idx}
                        className="text-foreground/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: block.html }}
                      />
                    );
                  }
                  return (
                    <p key={idx} className="text-foreground/90 leading-relaxed">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "ul") {
                  return (
                    <ul key={idx} className="my-6 space-y-3 pl-2">
                      {block.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground/90">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-600" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "ol") {
                  return (
                    <ol key={idx} className="my-6 space-y-3 list-decimal pl-6 text-foreground/90">
                      {block.items?.map((item, i) => (
                        <li key={i} className="pl-1" dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ol>
                  );
                }

                if (block.type === "blockquote") {
                  return (
                    <blockquote
                      key={idx}
                      className="my-8 rounded-2xl border-l-4 border-blue-600 bg-blue-50/60 p-6 italic text-navy shadow-xs"
                    >
                      <p className="text-lg leading-relaxed font-medium">"{block.text}"</p>
                    </blockquote>
                  );
                }

                return null;
              })}

              {/* Author Box */}
              <div className="mt-12 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-white shadow-md">
                    <User className="size-7" />
                  </div>
                  <div>
                    <span className="eyebrow text-xs">Published by</span>
                    <h3 className="text-lg font-bold text-navy">{post.author}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      SMG ABA provides strategic accounting, bookkeeping, and fractional CFO advisory services to hospitality, real estate, and growth businesses nationwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to blog button */}
              <div className="pt-8 flex items-center justify-between">
                <Button asChild variant="outline" className="gap-2 rounded-full">
                  <a href="/blog">
                    <ArrowLeft className="size-4" /> Back to All Articles
                  </a>
                </Button>
                <Button asChild className="gap-2 rounded-full bg-navy text-white hover:bg-navy/90">
                  <a href="/contact">
                    Talk to an Advisor <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="section-y bg-mist/25 border-t border-border/60">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="eyebrow">Explore More</span>
                  <h2 className="mt-2 font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
                    Related Articles & Insights
                  </h2>
                </div>
                <Button asChild variant="ghost" className="hidden sm:inline-flex gap-1.5 text-primary font-bold">
                  <a href="/blog">
                    View All Posts <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <a
                    key={rel.slug}
                    href={`/${rel.slug}/`}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
                  >
                    <div>
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted mb-4">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-navy/80 backdrop-blur-md px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-white">
                          {rel.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3 text-primary" />
                        <span>{rel.date}</span>
                        <span>•</span>
                        <span>{rel.readTime}</span>
                      </div>
                      <h3 className="mt-2 font-serif-hero text-lg font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                        {rel.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}

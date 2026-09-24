import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogContent, headingsOf } from "@/components/marketing/BlogContent";
import { ReadingProgress } from "@/components/marketing/ReadingProgress";
import { ContactCta } from "@/components/marketing/ContactCta";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { blogPosts, type BlogPost } from "@/data/blogPosts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [post.image],
    },
  };
}

/**
 * The service page each blog category leads into, so the closing call to
 * action continues the topic the reader just finished instead of a generic
 * "request a quote". Unmapped categories fall back to the quote form.
 */
const categoryService: Record<string, { href: string; label: string }> = {
  "Digital Strategy": { href: "/web-software", label: "Explore Our Software Services" },
  "Education Tech": { href: "/web-software", label: "Explore Our Software Services" },
  Cybersecurity: { href: "/it-support", label: "Explore Our IT Support" },
  "Cloud Computing": { href: "/it-support", label: "Explore Cloud & Networking" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZW", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Same-category posts first, then anything else to make up the count.
 *
 * This was previously the first two posts in the file regardless of what
 * had just been read, so someone finishing the cybersecurity article was
 * reliably offered cloud migration.
 */
function relatedPosts(post: BlogPost, count = 2): BlogPost[] {
  const others = blogPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[index];

  if (!post) notFound();

  const related = relatedPosts(post);
  const previous = blogPosts[index - 1];
  const next = blogPosts[index + 1];
  const headings = headingsOf(post.content);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        image={post.image}
        datePublished={post.date}
        slug={post.slug}
      />

      <ReadingProgress targetId="article-body" />

      <section className="relative page-padding-top py-20 overflow-hidden bg-hero">
        {/* The post image is editorial content here, so it stays more visible
            than on other heroes — a directional gradient keeps the headline
            legible without flattening the photo. */}
        <Image src={post.image} alt="" fill sizes="100vw" className="object-cover opacity-60" priority quality={60} />
        <div className="absolute inset-0 bg-gradient-to-b from-hero/70 via-hero/85 to-hero" />
        <div className="relative container mx-auto px-4 max-w-3xl text-center">
          {/* Inverted here rather than in Breadcrumbs itself: this is the one
              hero on the site with a dark backdrop. */}
          <Breadcrumbs
            crumbs={[{ name: "Blog", path: "/blog" }, { name: post.title }]}
            className="mb-6 flex justify-center [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
          />
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-hero-foreground mb-5 text-balance">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-5 text-hero-foreground/70 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <Section>
        <div id="article-body" className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
          </div>

          {/* Only worth the space on posts long enough to need navigating. */}
          {headings.length >= 3 && (
            <nav aria-label="In this article" className="mb-10 rounded-2xl border border-border bg-secondary/50 p-6">
              <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                In this article
              </p>
              <ol className="space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-foreground/80 hover:text-accent hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <BlogContent content={post.content} />

          {/* Sequential navigation, so a reader who finishes a post has
              somewhere to go that isn't the browser back button. */}
          {(previous || next) && (
            <nav aria-label="More articles" className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/blog/${previous.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/40 hover:shadow-md"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous
                  </span>
                  <p className="mt-1.5 font-heading text-sm font-semibold group-hover:text-accent">{previous.title}</p>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-accent/40 hover:shadow-md sm:col-start-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <p className="mt-1.5 font-heading text-sm font-semibold group-hover:text-accent">{next.title}</p>
                </Link>
              )}
            </nav>
          )}
        </div>
      </Section>

      <ContactCta
        title="Need help with this?"
        lead="We work with organizations across Zimbabwe on exactly these challenges. Tell us where you are and we'll suggest a practical next step — free, with no obligation."
        action={categoryService[post.category]}
      />

      <Section>
        <h2 className="font-heading text-2xl font-bold text-center mb-10">Related Articles</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-accent/30 hover:shadow-xl transition-all"
            >
              <div className="relative h-44">
                <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {item.category}
                </Badge>
                <h3 className="font-heading font-semibold mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { cn } from "@/lib/utils";

// Newest first, regardless of the order posts were added to the data file.
const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

const categoryCounts = sortedPosts.reduce<Record<string, number>>((acc, post) => {
  acc[post.category] = (acc[post.category] ?? 0) + 1;
  return acc;
}, {});

const categories = ["All", ...Object.keys(categoryCounts)];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZW", { year: "numeric", month: "short", day: "numeric" });
}

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {post.readTime}
      </span>
    </div>
  );
}

/**
 * The newest post, given the full width. Shown only on the unfiltered view —
 * once someone is searching, every result should carry equal weight.
 */
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mx-auto mb-8 grid max-w-6xl overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-xl md:grid-cols-2"
    >
      <div className="relative h-56 md:h-full md:min-h-80">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent">Latest</Badge>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h2 className="mb-3 font-heading text-2xl font-bold leading-tight transition-colors group-hover:text-accent md:text-3xl">
          {post.title}
        </h2>
        <p className="mb-6 leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <PostMeta post={post} />
        <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-xl"
    >
      <div className="relative h-48">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Badge variant="secondary" className="mb-3 w-fit">
          {post.category}
        </Badge>
        <h2 className="mb-2 font-heading text-lg font-semibold transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

export function BlogList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedPosts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const isFiltering = query.trim() !== "" || category !== "All";
  const [featured, ...rest] = filtered;
  const gridPosts = isFiltering ? filtered : rest;

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <>
      <div className="mx-auto mb-6 max-w-2xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === cat
                ? "bg-accent text-accent-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-accent",
            )}
          >
            {cat}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                category === cat ? "bg-white/20" : "bg-secondary text-muted-foreground",
              )}
            >
              {cat === "All" ? sortedPosts.length : categoryCounts[cat]}
            </span>
          </button>
        ))}
      </div>

      <p role="status" className="mb-10 min-h-5 text-center text-sm text-muted-foreground">
        {isFiltering && filtered.length > 0 && (
          <>
            {filtered.length} {filtered.length === 1 ? "article" : "articles"} found ·{" "}
            <button onClick={clearFilters} className="font-medium text-accent hover:underline">
              Clear filters
            </button>
          </>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-2 font-heading text-lg font-semibold">No articles found</p>
          <p className="mb-6 text-sm text-muted-foreground">Try a different search term or category.</p>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {!isFiltering && featured && <FeaturedPost post={featured} />}
          {gridPosts.length > 0 && (
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

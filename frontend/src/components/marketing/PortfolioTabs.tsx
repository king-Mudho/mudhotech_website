"use client";

import { useMemo, useState } from "react";
import { Search, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SkeletonImage } from "@/components/marketing/SkeletonImage";
import { portfolioProjects, repairShowcases } from "@/data/portfolio";
import { galleryImages } from "@/data/services";

const projectCategories = ["All", ...Array.from(new Set(portfolioProjects.map((p) => p.category)))];
const galleryCategories = ["All", ...Array.from(new Set(galleryImages.map((g) => g.category)))];

function FilterChips({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === option
              ? "bg-accent text-accent-foreground"
              : "bg-card border border-border text-muted-foreground hover:border-accent/30 hover:text-accent"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function PortfolioTabs() {
  const [projectCategory, setProjectCategory] = useState("All");
  const [repairQuery, setRepairQuery] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("All");

  const filteredProjects = useMemo(
    () => portfolioProjects.filter((p) => projectCategory === "All" || p.category === projectCategory),
    [projectCategory],
  );

  const filteredRepairs = useMemo(() => {
    const q = repairQuery.trim().toLowerCase();
    if (!q) return repairShowcases;
    return repairShowcases.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.problem.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [repairQuery]);

  const filteredGallery = useMemo(
    () => galleryImages.filter((g) => galleryCategory === "All" || g.category === galleryCategory),
    [galleryCategory],
  );

  return (
    <Tabs defaultValue="projects" className="max-w-6xl mx-auto">
      <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-10">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="repairs">Repairs</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
      </TabsList>

      <TabsContent value="projects">
        <FilterChips options={projectCategories} active={projectCategory} onChange={setProjectCategory} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <Badge variant="secondary" className="w-fit mb-3">
                {project.category}
              </Badge>
              <h3 className="font-heading font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{project.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-foreground/80 border-t border-border pt-4">{project.result}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="repairs">
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="repair-search" className="sr-only">
              Search repair case studies
            </label>
            <Input
              id="repair-search"
              value={repairQuery}
              onChange={(e) => setRepairQuery(e.target.value)}
              placeholder="Search repairs…"
              className="pl-9"
            />
          </div>
        </div>

        {filteredRepairs.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No repair case studies match that search.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRepairs.map((repair) => (
              <div key={repair.title} className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">{repair.title}</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-foreground/80">Problem</dt>
                    <dd className="text-muted-foreground">{repair.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground/80">Work Performed</dt>
                    <dd className="text-muted-foreground">{repair.work}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground/80">Result</dt>
                    <dd className="text-muted-foreground">{repair.result}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {repair.turnaround}
                  </span>
                  {repair.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="gallery">
        <FilterChips options={galleryCategories} active={galleryCategory} onChange={setGalleryCategory} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGallery.map((image) => (
            <SkeletonImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              wrapperClassName="rounded-xl border border-border h-56"
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

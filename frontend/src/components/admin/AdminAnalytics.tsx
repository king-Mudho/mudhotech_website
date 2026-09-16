"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api/client";

interface AnalyticsResponse {
  totals: { contacts: number; quotes: number; new_contacts: number; new_quotes: number };
  range_days: number;
  contact_status: Record<string, number>;
  quote_status: Record<string, number>;
  contacts_daily: Record<string, number>;
  quotes_daily: Record<string, number>;
}

const STATUS_COLORS = ["hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--whatsapp))"];
const ranges = [7, 30, 90];

/**
 * Recharts' default tooltip is a hardcoded white panel with black text, so
 * it was unreadable against the dark theme. Driving it from the same tokens
 * as the rest of the dashboard keeps it legible in both.
 */
const tooltipStyles = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    color: "hsl(var(--popover-foreground))",
    fontSize: "0.8125rem",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
  itemStyle: { color: "hsl(var(--muted-foreground))" },
  cursor: { fill: "hsl(var(--muted) / 0.4)" },
} as const;

export function AdminAnalytics() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics", days],
    queryFn: () => apiFetch<AnalyticsResponse>(`/api/admin/analytics?days=${days}`),
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-8" aria-busy="true" aria-label="Loading analytics">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[340px] rounded-xl" />
          <Skeleton className="h-[340px] rounded-xl" />
        </div>
      </div>
    );
  }

  const allDates = Array.from(new Set([...Object.keys(data.contacts_daily), ...Object.keys(data.quotes_daily)])).sort();

  const dailyData = allDates.map((date) => ({
    date,
    contacts: data.contacts_daily[date] ?? 0,
    quotes: data.quotes_daily[date] ?? 0,
  }));

  const statusData = ["new", "read", "replied"].map((status) => ({
    name: status,
    value: (data.contact_status[status] ?? 0) + (data.quote_status[status] ?? 0),
  }));

  const comparisonData = [
    { name: "Total", contacts: data.totals.contacts, quotes: data.totals.quotes },
    { name: "New", contacts: data.totals.new_contacts, quotes: data.totals.new_quotes },
  ];

  const tiles = [
    { label: "Total Contacts", value: data.totals.contacts },
    { label: "New Contacts", value: data.totals.new_contacts },
    { label: "Total Quotes", value: data.totals.quotes },
    { label: "New Quotes", value: data.totals.new_quotes },
  ];

  return (
    <div className="space-y-8">
      <div role="group" aria-label="Date range" className="flex gap-2">
        {ranges.map((range) => (
          <Button
            key={range}
            size="sm"
            variant={days === range ? "accent" : "outline"}
            aria-pressed={days === range}
            onClick={() => setDays(range)}
          >
            Last {range} days
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-border bg-card p-5">
            <p className="mb-1 text-sm text-muted-foreground">{tile.label}</p>
            <p className="font-heading text-3xl font-bold text-accent">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-heading font-semibold">Daily Submissions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip {...tooltipStyles} />
              <Legend />
              <Area
                type="monotone"
                dataKey="contacts"
                stackId="1"
                stroke="hsl(var(--accent))"
                fill="hsl(var(--accent))"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="quotes"
                stackId="1"
                stroke="hsl(var(--whatsapp))"
                fill="hsl(var(--whatsapp))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-heading font-semibold">Status Distribution</h3>
          {statusData.every((entry) => entry.value === 0) ? (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No submissions in this range yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                {/* Zero slices were still drawing a "0" label, stacking three of
                  them on top of each other in the middle of the doughnut. */}
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ value }: { value?: number }) => (value ? String(value) : "")}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyles} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 font-heading font-semibold">Contacts vs Quotes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip {...tooltipStyles} />
              <Legend />
              <Bar dataKey="contacts" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quotes" fill="hsl(var(--whatsapp))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

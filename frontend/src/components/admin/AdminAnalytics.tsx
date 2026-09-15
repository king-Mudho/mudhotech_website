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

export function AdminAnalytics() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics", days],
    queryFn: () => apiFetch<AnalyticsResponse>(`/api/admin/analytics?days=${days}`),
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground py-10 text-center">Loading analytics…</p>;
  }

  const allDates = Array.from(
    new Set([...Object.keys(data.contacts_daily), ...Object.keys(data.quotes_daily)]),
  ).sort();

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
      <div className="flex gap-2">
        {ranges.map((range) => (
          <Button key={range} size="sm" variant={days === range ? "accent" : "outline"} onClick={() => setDays(range)}>
            {range}d
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl bg-card border border-border p-5">
            <p className="text-muted-foreground text-sm mb-1">{tile.label}</p>
            <p className="font-heading text-3xl font-bold text-accent">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Daily Submissions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip />
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

        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-heading font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label>
                {statusData.map((entry, i) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4">Contacts vs Quotes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip />
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

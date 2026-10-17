"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type VotingPowerPoint = {
  date: string;
  owned: number;
  delegated: number;
  proposal?: string;
  delegationChange?: string;
};

type Horizon = "week" | "month" | "year";

export type VotingPowerChartProps = {
  data: VotingPowerPoint[];
  className?: string;
  title?: string;
};

const HORIZON_DAYS: Record<Horizon, number> = {
  week: 7,
  month: 30,
  year: 365,
};

const numberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 4,
});

function formatDate(value: string, horizon: Horizon) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, horizon === "year"
    ? { month: "short", year: "2-digit" }
    : { month: "short", day: "numeric" }).format(date);
}

export default function VotingPowerChart({
  data,
  className = "",
  title = "Voting power history",
}: VotingPowerChartProps) {
  const [horizon, setHorizon] = useState<Horizon>("month");
  const [showOwned, setShowOwned] = useState(true);
  const [showDelegated, setShowDelegated] = useState(true);

  const points = useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const validDates = sorted
      .map((point) => new Date(point.date).getTime())
      .filter(Number.isFinite);
    if (validDates.length === 0) return sorted;
    const cutoff = Math.max(...validDates) - HORIZON_DAYS[horizon] * 86_400_000;
    return sorted.filter((point) => {
      const time = new Date(point.date).getTime();
      return Number.isFinite(time) && time >= cutoff;
    });
  }, [data, horizon]);

  const events = points.filter((point) => point.proposal || point.delegationChange);

  return (
    <section className={`min-w-0 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            Owned and delegated voting power at token checkpoints.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Chart time horizon">
          {(["week", "month", "year"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setHorizon(range)}
              aria-pressed={horizon === range}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${horizon === range ? "bg-lime-300 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showOwned} onChange={(event) => setShowOwned(event.target.checked)} />
          <span className="text-slate-300">Owned power</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showDelegated} onChange={(event) => setShowDelegated(event.target.checked)} />
          <span className="text-slate-300">Delegated power</span>
        </label>
      </div>

      <div className="h-72 w-full" role="img" aria-label="Historical owned and delegated voting power chart">
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-400">
            No checkpoint history is available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#ffffff12" strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value: string) => formatDate(value, horizon)} stroke="#94a3b8" tick={{ fontSize: 11 }} minTickGap={24} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} width={48} />
              <Tooltip
                labelFormatter={(value) => formatDate(String(value), horizon)}
                formatter={(value, name) => [numberFormat.format(Number(value)), name === "owned" ? "Owned power" : "Delegated power"]}
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
              />
              {showOwned && <Line type="monotone" dataKey="owned" name="owned" stroke="#CBF34D" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />}
              {showDelegated && <Line type="monotone" dataKey="delegated" name="delegated" stroke="#38bdf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />}
              {events.map((event) => (
                <ReferenceDot
                  key={`${event.date}-${event.proposal ?? event.delegationChange}`}
                  x={event.date}
                  y={Math.max(event.owned, event.delegated)}
                  r={5}
                  fill={event.proposal ? "#fbbf24" : "#c084fc"}
                  stroke="#0f172a"
                  ifOverflow="discard"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {events.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <h3 className="mb-3 text-sm font-medium text-slate-200">Governance events</h3>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={`${event.date}-details-${event.proposal ?? event.delegationChange}`} className="flex flex-col gap-1 rounded-lg bg-white/[0.03] px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-slate-200">{event.proposal ?? event.delegationChange}</span>
                <span className="text-slate-400">{formatDate(event.date, horizon)} · owned {numberFormat.format(event.owned)} · delegated {numberFormat.format(event.delegated)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

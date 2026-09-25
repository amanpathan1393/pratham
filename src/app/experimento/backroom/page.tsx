import { CHALLENGES } from "@/lib/experimento/content";
import { getExperimentoAdmin } from "@/lib/experimento/admin";

// Always hit Supabase fresh: this is a live data view.
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  created_at: string;
  path: "fellow" | "ngo" | "curious";
  next_step: string;
  name: string;
  email: string;
  phone: string | null;
  subject?: string | null;
  grades?: string[] | null;
  student_count?: string | null;
  challenges?: string[] | null;
};

const PALETTE = ["#2457f5", "#0891b2", "#f59e0b", "#10b981", "#e11d48", "#7c3aed"];

function tally(values: (string | null | undefined)[]) {
  const counts = new Map<string, number>();
  for (const v of values) {
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function subjectLabel(v: string) {
  return v === 'both' ? 'Both subjects' : v.charAt(0).toUpperCase() + v.slice(1);
}

export default async function BackRoomPage() {
  let leads: LeadRow[] = [];
  let loadError: string | null = null;
  try {
    const { data, error } = await getExperimentoAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    leads = (data ?? []) as LeadRow[];
    loadError = error?.message ?? null;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load leads.";
  }

  const fellows = leads.filter((l) => l.path === "fellow");
  const challengeLabel = (id: string) => CHALLENGES.find((c) => c.id === id)?.short ?? id;

  return (
    <main className="flex flex-col gap-10">
      <header className="exp-fade-up">
        <p className="exp-mono text-xs font-medium" style={{ color: "var(--exp-blue)" }}>
          Internal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Experimento back room</h1>
        <p className="exp-muted mt-2 max-w-2xl">
          Everyone who left their details through the Experimento stall page. Refreshes on every
          load. Not linked from anywhere.
        </p>
      </header>

      {loadError && (
        <p className="exp-card px-4 py-3 text-sm font-semibold" style={{ color: "#b42318" }}>
          {loadError}
        </p>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total leads" value={leads.length} />
        <Stat label="Fellows" value={fellows.length} />
        <Stat label="NGO partners" value={leads.filter((l) => l.path === "ngo").length} />
        <Stat label="Just curious" value={leads.filter((l) => l.path === "curious").length} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="What they want next" note="All leads">
          <Donut items={tally(leads.map((l) => l.next_step))} unit="leads" />
        </Panel>
        <Panel title="Situations Fellows recognised" note="Fellows, up to 5 each">
          <Donut
            items={tally(fellows.flatMap((l) => l.challenges ?? [])).map((t) => ({
              label: challengeLabel(t.label),
              count: t.count,
            }))}
            unit="ticks"
          />
        </Panel>
        <Panel title="Subject" note="Fellows">
          <Donut
            items={tally(fellows.map((l) => l.subject)).map((t) => ({
              label: subjectLabel(t.label),
              count: t.count,
            }))}
            unit="fellows"
          />
        </Panel>
        <Panel title="Grades taught" note="Fellows, can pick several">
          <Donut
            items={tally(fellows.flatMap((l) => l.grades ?? [])).map((t) => ({
              label: `Grade ${t.label}`,
              count: t.count,
            }))}
            unit="picks"
          />
        </Panel>
        <Panel title="Class size" note="Fellows">
          <Donut items={tally(fellows.map((l) => l.student_count))} unit="fellows" />
        </Panel>
      </div>

      <section>
        <h2 className="text-lg font-bold">Recent leads</h2>
        <p className="exp-muted mt-1 text-sm">Most recent 50. For the full list, export from the Supabase Table Editor.</p>
        <div className="exp-card mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="exp-mono text-[11px]" style={{ color: "var(--exp-ink-soft)" }}>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Path</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 50).map((l) => (
                <tr key={l.id} style={{ borderTop: "1px solid var(--exp-grid)" }}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 capitalize">{l.path}</td>
                  <td className="px-4 py-3 font-semibold">{l.name}</td>
                  <td className="px-4 py-3">
                    {l.email}
                    {l.phone ? <span className="exp-muted"> · {l.phone}</span> : null}
                  </td>
                  <td className="exp-muted px-4 py-3">
                    {[
                      l.subject ? subjectLabel(l.subject) : null,
                      l.grades?.length ? `Grades ${l.grades.join(", ")}` : null,
                      l.student_count ? `${l.student_count} students` : null,
                      l.next_step,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="exp-muted px-4 py-8 text-center">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="exp-card px-4 py-4">
      <p className="exp-mono text-[11px]" style={{ color: "var(--exp-ink-soft)" }}>
        {label}
      </p>
      <p className="mt-1 text-4xl leading-none font-bold">{value}</p>
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="exp-muted text-sm">{note}</p>
      {children}
    </section>
  );
}

function Donut({ items, unit }: { items: { label: string; count: number }[]; unit: string }) {
  if (items.length === 0) {
    return <p className="exp-muted mt-3 text-sm">No data yet.</p>;
  }
  const total = items.reduce((sum, i) => sum + i.count, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const segments = items.reduce<{ item: (typeof items)[number]; length: number; offset: number }[]>(
    (acc, item) => {
      const length = (item.count / total) * circumference;
      const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].length : 0;
      acc.push({ item, length, offset });
      return acc;
    },
    [],
  );

  return (
    <div className="exp-card mt-3 flex flex-col items-center gap-5 p-5">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" role="img" aria-label="Breakdown chart">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e6edf6" strokeWidth="16" />
          {segments.map(({ item, length, offset }, i) => (
            <circle
              key={item.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth="16"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="exp-mono text-[10px]" style={{ color: "var(--exp-ink-soft)" }}>
            {unit}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span>{item.label}</span>
            </span>
            <span className="shrink-0 font-bold">
              {item.count}{" "}
              <span className="exp-muted font-normal">({Math.round((item.count / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

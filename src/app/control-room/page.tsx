import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { CHALLENGES } from "@/lib/challenges";

// Always hit Supabase fresh — this is a live dashboard, not static content.
export const dynamic = "force-dynamic";

type Path = "fellow" | "ngo" | "curious";

type SubmissionRow = {
  id: string;
  created_at: string;
  path: Path;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  challenges: string[] | null;
  student_count: string | null;
  grades_taught: string | null;
  next_step: string | null;
  ngo_org: string | null;
  ngo_location: string | null;
  ngo_audience: string | null;
  ngo_settings: string[] | null;
  ngo_explore: string[] | null;
};

type ActivityResultRow = {
  id: string;
  created_at: string;
  path: "fellow" | "curious";
  kind: string;
  result: "won" | "timeout" | "completed";
};

// Display order matches the challenge picker on fellow/1.
const ACTIVITY_LABEL: Record<string, string> = {
  game: "Fastest Finger First",
  "speaking-ladder": "Speaking Ladder",
  "kit-reveal": "Session Kit Reveal",
  "progress-reveal": "Progress Reveal",
  regroup: "Regroup by Level",
  "spot-the-difference": "Spot the Difference",
};
const ACTIVITY_ORDER = Object.keys(ACTIVITY_LABEL);
// These two have a real pass/fail outcome; the rest are single-path
// reveals with nothing to win or lose, so "completed" is all there is.
const WIN_LOSE_KINDS = new Set(["game", "spot-the-difference"]);

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

function tallyArrays(values: (string[] | null | undefined)[]) {
  const flat = values.flatMap((v) => v ?? []);
  return tally(flat);
}

export default async function ControlRoomPage() {
  let submissions: SubmissionRow[] = [];
  let activityResults: ActivityResultRow[] = [];
  let loadError: string | null = null;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const [submissionsRes, activityRes] = await Promise.all([
      supabaseAdmin
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("activity_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);
    submissions = (submissionsRes.data ?? []) as SubmissionRow[];
    activityResults = (activityRes.data ?? []) as ActivityResultRow[];
    loadError = submissionsRes.error?.message ?? activityRes.error?.message ?? null;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load data.";
  }

  const fellowSubs = submissions.filter((s) => s.path === "fellow");
  const ngoSubs = submissions.filter((s) => s.path === "ngo");
  const curiousSubs = submissions.filter((s) => s.path === "curious");

  const challengeCounts = tallyArrays(fellowSubs.map((s) => s.challenges)).map((c) => ({
    label: CHALLENGES.find((ch) => ch.id === c.label)?.label ?? c.label,
    count: c.count,
  }));
  const studentCountCounts = tally(fellowSubs.map((s) => s.student_count));
  const gradesCounts = tally(fellowSubs.map((s) => s.grades_taught));
  const helpChoiceCounts = tally(fellowSubs.map((s) => s.next_step));
  const ngoSettingCounts = tallyArrays(ngoSubs.map((s) => s.ngo_settings));
  const ngoInterestCounts = tallyArrays(ngoSubs.map((s) => s.ngo_explore));

  function activityStats(kind: string) {
    const rows = activityResults.filter((a) => a.kind === kind);
    const won = rows.filter((a) => a.result === "won").length;
    return {
      total: rows.length,
      won,
      rate: rows.length > 0 ? Math.round((won / rows.length) * 100) : 0,
    };
  }

  const totalActivityPlays = activityResults.length;

  return (
    <main className="flex flex-1 flex-col bg-[#0b1220] px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-teal uppercase">Internal</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Control Room</h1>
          <p className="mt-2 text-slate-400">
            Live submissions and activity across Fellow, NGO, and Curious. Refreshes on every
            load.
          </p>
        </div>

        {loadError && (
          <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError} Check that SUPABASE_SERVICE_ROLE_KEY is set (in .env.local for dev, in
            the Vercel project for production) and that the submissions / activity_results
            tables exist.
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total submissions" value={submissions.length} />
          <StatCard label="Fellow" value={fellowSubs.length} accent="gold" />
          <StatCard label="NGO" value={ngoSubs.length} accent="teal" />
          <StatCard label="Curious (email left)" value={curiousSubs.length} />
        </div>

        <section className="mt-12">
          <SectionTitle title="Activity engagement" />
          <p className="mt-1 text-sm text-slate-500">
            All 6 interactives, across Fellow and Curious. {totalActivityPlays} plays total.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITY_ORDER.map((kind) => {
              const stats = activityStats(kind);
              const label = ACTIVITY_LABEL[kind];
              return WIN_LOSE_KINDS.has(kind) ? (
                <RingCard
                  key={kind}
                  label={label}
                  percent={stats.rate}
                  sub={`${stats.won} of ${stats.total} won`}
                />
              ) : (
                <ActivityCountCard key={kind} label={label} count={stats.total} />
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle title="Challenges Fellows picked" />
          <p className="mt-1 text-sm text-slate-500">
            From completed Fellow submissions only.
          </p>
          <BarList items={challengeCounts} />
        </section>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section>
            <SectionTitle title="Class size" />
            <BarList items={studentCountCounts} />
          </section>
          <section>
            <SectionTitle title="Grades taught" />
            <BarList items={gradesCounts} />
          </section>
          <section>
            <SectionTitle title="What Fellows want next" />
            <BarList items={helpChoiceCounts} />
          </section>
          <section>
            <SectionTitle title="NGO settings of interest" />
            <BarList items={ngoSettingCounts} />
          </section>
          <section>
            <SectionTitle title="NGO exploration interests" />
            <BarList items={ngoInterestCounts} />
          </section>
        </div>

        <section className="mt-12 mb-16">
          <SectionTitle title="Recent submissions" />
          <p className="mt-1 text-sm text-slate-500">Most recent 50.</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs tracking-wide text-slate-400 uppercase">
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {submissions.slice(0, 50).map((s) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                      {new Date(s.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <PathBadge path={s.path} />
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {s.name || s.ngo_org || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{s.email || s.phone || "—"}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {s.path === "fellow" &&
                        [s.student_count, s.grades_taught, s.next_step]
                          .filter(Boolean)
                          .join(" · ")}
                      {s.path === "ngo" &&
                        [s.ngo_org, s.ngo_location, s.ngo_audience].filter(Boolean).join(" · ")}
                      {s.path === "curious" && "Email left"}
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "teal" | "gold";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          accent === "teal" ? "text-teal" : accent === "gold" ? "text-gold" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-lg font-bold text-white">{title}</h2>;
}

function PathBadge({ path }: { path: Path }) {
  const styles: Record<Path, string> = {
    fellow: "bg-gold/15 text-gold",
    ngo: "bg-teal/15 text-teal",
    curious: "bg-white/10 text-slate-300",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[path]}`}
    >
      {path}
    </span>
  );
}

function BarList({ items }: { items: { label: string; count: number }[] }) {
  if (items.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">No data yet.</p>;
  }
  const max = Math.max(...items.map((i) => i.count));
  return (
    <div className="mt-4 flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-slate-200">{item.label}</span>
            <span className="shrink-0 font-semibold text-white">{item.count}</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-teal"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityCountCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{count}</p>
      <p className="mt-1 text-xs text-slate-400">
        {count === 1 ? "time tried" : "times tried"}
      </p>
    </div>
  );
}

function RingCard({ label, percent, sub }: { label: string; percent: number; sub: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#F2B705"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {percent}%
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

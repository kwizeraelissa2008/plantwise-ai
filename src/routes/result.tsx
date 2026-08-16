import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Droplets, Loader2, Send, Sprout, Sun, Thermometer } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { askPlantAI } from "@/lib/plant.functions";
import { loadScan, saveScan, type ChatMessage, type ScanRecord } from "@/lib/plant-types";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Plant result — PlantAI health assessment" },
      {
        name: "description",
        content:
          "See your plant's identification, AI visual health assessment, care guide and ask PlantAI follow-up questions.",
      },
      { property: "og:title", content: "Your PlantAI result" },
      { property: "og:description", content: "Identification, health check and care advice." },
    ],
  }),
  component: ResultScreen,
});

const SUGGESTIONS = [
  "Why are the leaves turning yellow?",
  "How often should I water it?",
  "What should I do next?",
];

function ResultScreen() {
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setScan(loadScan());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!scan) {
    return (
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-lg font-semibold">No scan yet</p>
        <p className="text-sm text-muted-foreground">Scan a plant to see your results here.</p>
        <Link
          to="/scan"
          className="flex h-12 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground"
        >
          Start Scanning
        </Link>
      </main>
    );
  }

  const a = scan.analysis;
  const healthy = a.healthStatus === "Healthy";

  return (
    <main className="mx-auto w-full max-w-[430px] pb-28">
      <div className="relative">
        <img
          src={scan.image}
          alt={a.plantName}
          className="h-72 w-full rounded-b-[2rem] object-cover"
        />
        <button
          onClick={() => navigate({ to: "/home" })}
          aria-label="Back"
          className="absolute left-5 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {a.demo && (
          <span className="absolute right-5 top-12 rounded-full bg-warning-soft px-3 py-1.5 text-xs font-semibold text-warning-foreground">
            Demo Mode
          </span>
        )}
      </div>

      <div className="space-y-5 px-5 pt-5">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">{a.plantName}</h1>
          {a.scientificName && (
            <p className="mt-1 text-sm italic text-muted-foreground">{a.scientificName}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {a.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                {t}
              </span>
            ))}
            {a.confidence > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                {Math.round(a.confidence * 100)}% confidence
              </span>
            )}
          </div>
        </section>

        <section
          className={`rounded-3xl p-5 ${healthy ? "bg-accent" : "bg-warning-soft"}`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p
            className={`text-sm font-semibold ${healthy ? "text-accent-foreground" : "text-warning-foreground"}`}
          >
            {healthy ? "🌱 Plant Health" : "⚠️ Plant Health"}
          </p>
          <p
            className={`mt-2 text-lg font-bold uppercase tracking-wide ${healthy ? "text-accent-foreground" : "text-warning-foreground"}`}
          >
            {healthy ? "Your plant looks healthy" : "Possible health problem"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">
            {healthy
              ? "PlantAI did not detect obvious visible signs of disease."
              : a.problem || "Signs may indicate a plant health issue."}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            AI visual assessment — general guidance, not a guaranteed diagnosis.
          </p>
        </section>

        {a.description && (
          <Card title="About this plant">
            <p className="text-sm leading-relaxed text-secondary-foreground">{a.description}</p>
          </Card>
        )}

        {!healthy ? (
          <Card title="Possible problem">
            <p className="font-semibold text-foreground">{a.problem || "Unclear symptoms"}</p>
            {a.noticed && (
              <>
                <p className="mt-4 text-sm font-semibold text-secondary-foreground">
                  What we noticed
                </p>
                <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">
                  {a.noticed}
                </p>
              </>
            )}
            {a.recommendations.length > 0 && (
              <>
                <p className="mt-4 text-sm font-semibold text-secondary-foreground">
                  What you can do
                </p>
                <ul className="mt-2 space-y-2">
                  {a.recommendations.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-secondary-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        ) : (
          <Card title="Plant looks healthy 🌱">
            <p className="text-sm leading-relaxed text-secondary-foreground">
              Continue monitoring your crop regularly.
            </p>
            {a.recommendations.length > 0 && (
              <ul className="mt-3 space-y-2">
                {a.recommendations.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-secondary-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <Card title="Care Guide">
          <div className="grid grid-cols-2 gap-3">
            <CareItem icon={<Sun className="h-4 w-4" />} label="Sunlight" value={a.care.sunlight} />
            <CareItem icon={<Droplets className="h-4 w-4" />} label="Water" value={a.care.water} />
            <CareItem icon={<Sprout className="h-4 w-4" />} label="Soil" value={a.care.soil} />
            <CareItem
              icon={<Thermometer className="h-4 w-4" />}
              label="Temperature"
              value={a.care.temperature}
            />
          </div>
        </Card>

        <ChatSection scan={scan} onUpdate={setScan} />
      </div>

      <BottomNav />
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border p-5">
      <h2 className="mb-3 text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

function CareItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-secondary-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-sm leading-snug text-secondary-foreground">{value}</p>
    </div>
  );
}

function ChatSection({
  scan,
  onUpdate,
}: {
  scan: ScanRecord;
  onUpdate: (s: ScanRecord) => void;
}) {
  const ask = useServerFn(askPlantAI);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const a = scan.analysis;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [scan.messages.length, pending]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || pending) return;
    setInput("");
    const messages: ChatMessage[] = [...scan.messages, { role: "user", content: question }];
    const withUser = { ...scan, messages };
    onUpdate(withUser);
    saveScan(withUser);
    setPending(true);
    try {
      const context = `Plant: ${a.plantName}\nScientific name: ${a.scientificName}\nHealth status: ${a.healthStatus}\nDetected problem: ${a.problem || "none detected"}\nDescription: ${a.description}`;
      const { reply } = await ask({ data: { context, messages: messages.slice(-10) } });
      const next: ScanRecord = {
        ...withUser,
        messages: [...messages, { role: "assistant", content: reply }],
      };
      onUpdate(next);
      saveScan(next);
    } catch (e) {
      const next: ScanRecord = {
        ...withUser,
        messages: [
          ...messages,
          {
            role: "assistant",
            content: e instanceof Error ? e.message : "Sorry, I couldn't answer that right now.",
          },
        ],
      };
      onUpdate(next);
      saveScan(next);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-3xl bg-accent p-5">
      <h2 className="text-base font-bold text-accent-foreground">Ask PlantAI</h2>
      <p className="mt-1 text-sm text-secondary-foreground">Have a question about this plant?</p>

      <div className="mt-4 space-y-3">
        {scan.messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="flex w-fit items-center gap-2 rounded-2xl bg-background px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> PlantAI is thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {scan.messages.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              className="rounded-full bg-background px-3 py-2 text-xs font-medium text-secondary-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your plant..."
          className="h-12 flex-1 rounded-full bg-background px-4 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:ring-2"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={pending}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
}

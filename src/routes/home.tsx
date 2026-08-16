import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, Leaf, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { getUser } from "@/lib/auth";
import { loadScan, type ScanRecord } from "@/lib/plant-types";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "PlantAI Scanner — Check your crop with your camera" },
      {
        name: "description",
        content:
          "Scan a plant with your phone camera and PlantAI identifies it and checks for visible health problems.",
      },
      { property: "og:title", content: "PlantAI Scanner" },
      { property: "og:description", content: "Check your plant with your camera." },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("Farmer");
  const [last, setLast] = useState<ScanRecord | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    setName(user.name || "Farmer");
    setLast(loadScan());
  }, [navigate]);

  return (
    <main className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Hello, {name} 👋</h1>
        <p className="mt-1 text-base text-muted-foreground">Check your plant with your camera.</p>
      </header>

      <section
        className="mt-6 rounded-3xl bg-accent p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Camera className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-accent-foreground">Scan a Plant</h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">
          Take a photo of a plant or crop and PlantAI will analyze it.
        </p>
        <Link
          to="/scan"
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Start Scanning <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {last && (
        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Last scan</h3>
          <Link
            to="/result"
            className="flex items-center gap-4 rounded-3xl border border-border p-3"
          >
            <img
              src={last.image}
              alt={last.analysis.plantName}
              loading="lazy"
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold">{last.analysis.plantName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {last.analysis.healthStatus === "Healthy"
                  ? "Looks healthy"
                  : last.analysis.problem || "Assessment available"}
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3">
        <InfoTile
          icon={<Leaf className="h-5 w-5" />}
          title="Plant ID"
          text="Name and species from a photo."
        />
        <InfoTile
          icon={<Sparkles className="h-5 w-5" />}
          title="AI advice"
          text="Simple steps you can take today."
        />
      </section>

      <BottomNav />
    </main>
  );
}

function InfoTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-secondary p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-primary">
        {icon}
      </span>
      <p className="mt-3 font-semibold text-secondary-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

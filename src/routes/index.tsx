import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import heroCrop from "@/assets/hero-crop.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlantAI — Know your plant. Protect your harvest." },
      {
        name: "description",
        content:
          "Use your phone camera to identify plants, detect health problems, and get simple AI-powered farming advice.",
      },
      { property: "og:title", content: "PlantAI — Know your plant. Protect your harvest." },
      {
        property: "og:description",
        content: "AI-powered plant identification and health guidance for farmers.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden">
      <img
        src={heroCrop}
        alt="Healthy green maize crop field at golden hour"
        width={1024}
        height={1536}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col justify-between px-6 pb-10 pt-14">
        <div className="flex items-center gap-2 text-primary-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">PlantAI</span>
        </div>

        <div className="text-primary-foreground">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">PlantAI</h1>
          <p className="mt-3 text-xl font-medium opacity-95">
            Know your plant. Protect your harvest.
          </p>
          <p className="mt-4 text-base leading-relaxed opacity-85">
            Use your phone camera to identify plants, detect health problems, and get simple
            AI-powered advice.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
            >
              Start Scanning
            </Link>
            <Link
              to="/auth"
              search={{ mode: "login" }}
              className="flex h-12 w-full items-center justify-center rounded-full border border-primary-foreground/40 text-base font-medium text-primary-foreground/95 backdrop-blur-sm"
            >
              Log in
            </Link>
          </div>

          <p className="mt-6 text-center text-xs opacity-75">
            AI-powered plant identification and health guidance.
          </p>
        </div>
      </div>
    </main>
  );
}

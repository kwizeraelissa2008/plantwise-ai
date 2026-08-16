import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { setUser } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? ("signup" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "Log in to PlantAI — Your smart farming assistant" },
      {
        name: "description",
        content: "Log in or create a PlantAI account to scan crops and get AI plant health advice.",
      },
      { property: "og:title", content: "Log in to PlantAI" },
      { property: "og:description", content: "Your smart farming assistant." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: mode === "signup" && name ? name : email.split("@")[0] || "Farmer", email });
    navigate({ to: "/home" });
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col px-6 pb-10 pt-16">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Leaf className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome to PlantAI</h1>
      <p className="mt-2 text-base text-muted-foreground">Your smart farming assistant.</p>

      <div className="mt-6 flex rounded-full bg-muted p-1 text-sm font-medium">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2.5 transition-colors ${
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m === "login" ? "Log in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <Field label="Name" value={name} onChange={setName} type="text" placeholder="Your name" />
        )}
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="farmer@email.com"
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="••••••••"
        />
        <button
          type="submit"
          className="mt-2 flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setUser({ name: "Farmer", guest: true });
          navigate({ to: "/home" });
        }}
        className="mt-4 h-12 w-full rounded-full border border-border text-base font-medium text-foreground"
      >
        Continue as guest
      </button>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-secondary-foreground">{label}</span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full rounded-2xl bg-secondary px-4 text-base text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2"
      />
    </label>
  );
}

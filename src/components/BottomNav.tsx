import { Link } from "@tanstack/react-router";
import { Home, ScanLine } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-around px-6 py-2">
        <NavItem to="/home" label="Home" icon={<Home className="h-5 w-5" />} />
        <NavItem to="/scan" label="Scan" icon={<ScanLine className="h-5 w-5" />} />
      </div>
    </nav>
  );
}

function NavItem({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium text-muted-foreground transition-colors"
      activeProps={{ className: "text-primary" }}
    >
      {icon}
      {label}
    </Link>
  );
}

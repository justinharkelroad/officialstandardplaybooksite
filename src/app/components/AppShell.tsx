import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/lib/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app", label: "Hub", end: true },
  { to: "/app/core4", label: "Core 4" },
  { to: "/app/weekly-playbook", label: "Playbook" },
  { to: "/app/flows", label: "Flows" },
  { to: "/app/debrief", label: "Debrief" },
  { to: "/app/monthly-missions", label: "Missions" },
  { to: "/app/life-targets", label: "Targets" },
  { to: "/app/theta-talk-track", label: "90 Day Audio" },
];

export default function AppShell() {
  const { member, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const items = isAdmin ? [...NAV_ITEMS, { to: "/app/admin", label: "Admin" }] : NAV_ITEMS;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <NavLink to="/app" className="flex items-baseline gap-2 shrink-0">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#2997FF]">
              Standard Playbook
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">Member App</span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-[#2997FF]/15 text-[#2997FF]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {member?.full_name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border px-4 py-2 lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={"end" in item ? item.end : false}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm",
                      isActive
                        ? "bg-[#2997FF]/15 text-[#2997FF]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

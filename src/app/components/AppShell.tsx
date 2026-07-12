import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AudioLines,
  CalendarRange,
  ClipboardEdit,
  Dumbbell,
  LayoutGrid,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Rocket,
  Shield,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useAuth } from "@/app/lib/auth";
import { useSpTheme } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app", label: "Hub", icon: LayoutGrid, end: true },
  { to: "/app/core4", label: "Core 4", icon: Dumbbell },
  { to: "/app/weekly-playbook", label: "Playbook", icon: ListChecks },
  { to: "/app/flows", label: "Flows", icon: Sparkles },
  { to: "/app/debrief", label: "Debrief", icon: ClipboardEdit },
  { to: "/app/monthly-missions", label: "Missions", icon: Rocket },
  { to: "/app/life-targets", label: "Targets", icon: CalendarRange },
  { to: "/app/theta-talk-track", label: "90 Day Audio", icon: AudioLines },
];

const COLLAPSE_KEY = "sp-sidebar-collapsed";

export default function AppShell() {
  const { member, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = useSpTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* private mode — collapse state just won't persist */
    }
  }, [collapsed]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const items = isAdmin
    ? [...NAV_ITEMS, { to: "/app/admin", label: "Admin", icon: Shield }]
    : NAV_ITEMS;

  const initials = (member?.full_name ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navList = (onNavigate?: () => void, isCollapsed = false) => (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={"end" in item ? item.end : false}
            onClick={onNavigate}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "sp-label relative flex items-center gap-3 px-5 py-3 text-[11px] transition-colors",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-foreground/[0.06] text-[#2997FF]"
                  : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0 h-full w-[3px]",
                    isActive ? "bg-[#2997FF]" : "bg-transparent",
                  )}
                />
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className={cn("member-app min-h-screen", theme === "dark" && "dark")}>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r-[1.5px] border-foreground bg-background lg:flex",
          collapsed ? "w-[72px]" : "w-[248px]",
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b-[1.5px] border-foreground px-5",
            collapsed && "justify-center px-0",
          )}
        >
          <NavLink to="/app" className="flex items-center gap-2 overflow-hidden">
            {collapsed ? (
              <span className="sp-display text-lg leading-none text-foreground">SP</span>
            ) : (
              <>
                <span className="sp-display whitespace-nowrap text-base leading-none text-foreground">
                  Standard&nbsp;Playbook
                </span>
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#2997FF]" />
              </>
            )}
          </NavLink>
        </div>

        {navList(undefined, collapsed)}

        <div className="shrink-0 border-t border-foreground/15 p-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "sp-label flex w-full items-center gap-3 px-2 py-2 text-[10px] text-foreground/50 transition-colors hover:text-foreground",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r-[1.5px] border-foreground bg-background lg:hidden">
            <div className="flex h-14 shrink-0 items-center justify-between border-b-[1.5px] border-foreground px-5">
              <span className="sp-display text-base leading-none text-foreground">
                Standard&nbsp;Playbook
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {navList(() => setMobileOpen(false))}
          </aside>
        </>
      )}

      {/* Main column */}
      <div
        className={cn(
          "flex min-h-screen flex-col",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]",
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b-[1.5px] border-foreground bg-background/95 px-6 backdrop-blur">
          <button
            type="button"
            className="text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="text-foreground/60 transition-colors hover:text-[#2997FF]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center bg-foreground text-[10px] font-bold text-background"
              >
                {initials}
              </span>
              <span className="sp-label hidden text-[10px] text-foreground/60 sm:inline">
                {member?.full_name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="text-foreground/60 transition-colors hover:text-[#2997FF]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

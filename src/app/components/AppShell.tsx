import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AudioLines,
  BookOpenText,
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
import standardLogo from "@/assets/standard-word-logo.png";
import spIconBlack from "@/assets/sp-icon-black.png";
import { useAuth } from "@/app/lib/auth";
import { useSpTheme } from "@/app/lib/theme";
import { IconTooltip } from "@/app/components/IconTooltip";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Today",
    items: [
      { to: "/app", label: "Hub", icon: LayoutGrid, end: true },
      { to: "/app/core4", label: "Daily", icon: Dumbbell },
    ],
  },
  {
    label: "Plan",
    items: [
      { to: "/app/weekly-playbook", label: "Weekly", icon: ListChecks },
      { to: "/app/monthly-missions", label: "This Month", icon: Rocket },
      { to: "/app/life-targets", label: "Quarterly", icon: CalendarRange },
    ],
  },
  {
    label: "Coach",
    items: [
      { to: "/app/flows", label: "Flows", icon: Sparkles },
      { to: "/app/reflection", label: "Reflection", icon: BookOpenText },
      { to: "/app/debrief", label: "Debrief", icon: ClipboardEdit },
    ],
  },
  {
    label: "Reinforce",
    items: [{ to: "/app/theta-talk-track", label: "90 Day Audio", icon: AudioLines }],
  },
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

  const groups = isAdmin
    ? [
        ...NAV_GROUPS,
        {
          label: "Manage",
          items: [{ to: "/app/admin", label: "Admin", icon: Shield }],
        },
      ]
    : NAV_GROUPS;

  const initials = (member?.full_name ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navList = (onNavigate?: () => void, isCollapsed = false) => (
    <nav className="flex flex-1 flex-col overflow-y-auto py-3" aria-label="Primary navigation">
      {groups.map((group, groupIndex) => (
        <div
          key={group.label}
          className={cn(
            "pb-2",
            groupIndex > 0 && "mt-1 border-t border-foreground/10 pt-3",
          )}
        >
          {!isCollapsed ? (
            <p className="sp-label px-5 pb-1 text-[8px] text-foreground/35">{group.label}</p>
          ) : null}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const link = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={"end" in item ? item.end : false}
                  onClick={onNavigate}
                  aria-label={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "sp-label relative flex items-center gap-3 px-5 py-2.5 text-[11px] transition-colors",
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

              return isCollapsed ? (
                <IconTooltip key={item.to} label={item.label} side="right">
                  {link}
                </IconTooltip>
              ) : (
                link
              );
            })}
          </div>
        </div>
      ))}
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
              <img
                src={spIconBlack}
                alt="Standard Playbook"
                className="h-8 w-8 object-contain dark:invert"
              />
            ) : (
              <img
                src={standardLogo}
                alt="Standard Playbook"
                className="h-[22px] w-auto shrink-0 brightness-0 dark:invert"
              />
            )}
          </NavLink>
        </div>

        {navList(undefined, collapsed)}

        <div className="shrink-0 border-t border-foreground/15 p-3">
          <IconTooltip
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            side="right"
            disabled={!collapsed}
          >
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
          </IconTooltip>
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
              <img
                src={standardLogo}
                alt="Standard Playbook"
                className="h-[22px] w-auto brightness-0 dark:invert"
              />
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
          "flex min-h-screen min-w-0 max-w-full flex-col",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]",
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 min-w-0 shrink-0 items-center justify-between gap-2 border-b-[1.5px] border-foreground bg-background/95 px-3 backdrop-blur sm:gap-4 sm:px-6">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <IconTooltip label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} side="bottom">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60 transition-colors hover:text-[#2997FF]"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </IconTooltip>

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

            <IconTooltip label="Sign out" side="bottom">
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60 transition-colors hover:text-[#2997FF]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </IconTooltip>
          </div>
        </header>

        <main className="mx-auto min-w-0 w-full max-w-[1200px] flex-1 px-4 py-4 sm:px-6 sm:py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

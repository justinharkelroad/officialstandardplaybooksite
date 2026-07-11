import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
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
    <div className="member-app min-h-screen">
      <header className="sticky top-0 z-40 border-b-[1.5px] border-[#0A0A0B] bg-[#F4F2EE]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-6 md:px-10">
          <NavLink to="/app" className="flex items-center gap-2 shrink-0">
            <span className="sp-display text-lg leading-none text-[#0A0A0B]">
              Standard&nbsp;Playbook
            </span>
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full bg-[#2997FF]"
            />
            <span className="sp-label hidden text-[10px] text-[#0A0A0B]/60 sm:inline">
              Member App
            </span>
          </NavLink>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "sp-label px-3 py-2 text-[11px] transition-colors",
                    isActive
                      ? "text-[#2997FF]"
                      : "text-[#0A0A0B]/70 hover:text-[#0A0A0B]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="sp-label hidden text-[10px] text-[#0A0A0B]/60 md:inline">
              {member?.full_name}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="p-1.5 text-[#0A0A0B]/70 transition-colors hover:text-[#2997FF]"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-[#0A0A0B] lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-[#0A0A0B]/15 px-6 py-2 lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={"end" in item ? item.end : false}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "sp-label px-3 py-2.5 text-[11px]",
                      isActive ? "text-[#2997FF]" : "text-[#0A0A0B]/70",
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

      <main className="mx-auto max-w-[1440px] px-6 py-6 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}

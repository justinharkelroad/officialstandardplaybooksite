import { Outlet } from "react-router-dom";
import { useSpTheme } from "@/app/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Full-bleed frame for the immersive flow surfaces (session, start, complete,
 * view). These pages own the whole viewport — they set their own `min-h-screen`
 * and pin a composer to the bottom — so nesting them inside AppShell's padded
 * <main> pushed their footer below the fold. They render outside the shell but
 * still inside the member-app token scope, so the theme follows.
 */
export default function ImmersiveFrame() {
  const [theme] = useSpTheme();

  return (
    <div className={cn("member-app min-h-screen", theme === "dark" && "dark")}>
      <Outlet />
    </div>
  );
}

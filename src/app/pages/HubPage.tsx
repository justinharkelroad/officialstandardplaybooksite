import { useAuth } from "@/app/lib/auth";

// Placeholder hub — replaced by the transplanted Personal Growth dashboard.
export default function HubPage() {
  const { member } = useAuth();
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold">Welcome, {member?.full_name}</h1>
      <p className="mt-2 text-muted-foreground">Your Standard Playbook hub is loading in.</p>
    </div>
  );
}

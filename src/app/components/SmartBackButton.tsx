import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/lib/auth";

type SmartBackButtonProps = {
  className?: string;
  authenticatedPath?: string;
  authenticatedLabel?: string;
};

/**
 * Back button that returns members to the configured hub destination,
 * or to /login when unauthenticated.
 */
export function SmartBackButton({
  className,
  authenticatedPath = "/app",
  authenticatedLabel = "Hub",
}: SmartBackButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const destination = user ? authenticatedPath : "/login";
  const destinationLabel = user ? authenticatedLabel : "Login";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(destination)}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to {destinationLabel}
    </Button>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/lib/auth";

type SmartBackButtonProps = {
  className?: string;
  authenticatedPath?: string;
  authenticatedLabel?: string;
};

/**
 * Smart back button that navigates to:
 * - /staff from Staff Portal routes
 * - the configured authenticated destination for Brain Portal users
 * - /auth if user is not authenticated
 */
export function SmartBackButton({
  className,
  authenticatedPath = "/dashboard",
  authenticatedLabel = "Dashboard",
}: SmartBackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isStaffPortal = location.pathname.startsWith("/staff/");
  const destination = isStaffPortal
    ? "/staff"
    : user
      ? authenticatedPath
      : "/auth";
  const destinationLabel = isStaffPortal
    ? "Staff Dashboard"
    : user
      ? authenticatedLabel
      : "Login";

  const handleBack = () => {
    navigate(destination);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to {destinationLabel}
    </Button>
  );
}

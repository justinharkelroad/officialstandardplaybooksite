import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useThetaStore } from "@/app/lib/thetaTrackStore";
import { useCreateTargets } from "@/app/hooks/useThetaTargets";
import { toast } from "sonner";

const MAX_CHARS = 500;

const categories = [
  {
    key: 'body' as const,
    label: 'Body',
    placeholder: 'Physical health, fitness routines, nutrition goals, energy levels...',
    description: 'Your physical health and wellness targets'
  },
  {
    key: 'being' as const,
    label: 'Being',
    placeholder: 'Mental health, mindfulness, spiritual practices, personal growth...',
    description: 'Your mental and spiritual growth aspirations'
  },
  {
    key: 'balance' as const,
    label: 'Balance',
    placeholder: 'Work-life harmony, time management, boundaries, relationships...',
    description: 'Your equilibrium and life harmony goals'
  },
  {
    key: 'business' as const,
    label: 'Business',
    placeholder: 'Career goals, income targets, skill development, professional growth...',
    description: 'Your professional and financial objectives'
  }
];

export function ThetaTargetsInput() {
  const {
    targets,
    setTargets,
    sessionId,
    setCurrentStep,
  } = useThetaStore();
  const createTargets = useCreateTargets();

  const handleChange = (key: 'body' | 'being' | 'balance' | 'business', value: string) => {
    if (value.length <= MAX_CHARS) {
      setTargets({ [key]: value });
    }
  };

  const filledCount = [targets.body, targets.being, targets.balance, targets.business]
    .filter(v => v.trim().length > 0).length;
  const canContinue = filledCount >= 1 && sessionId.length > 0;

  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      await createTargets.mutateAsync({
        sessionId,
        body: targets.body,
        being: targets.being,
        balance: targets.balance,
        business: targets.business
      });
      
      toast.success("Targets saved successfully!");
      setCurrentStep(2);
    } catch (error) {
      console.error("Error saving targets:", error);
      toast.error("Failed to save targets. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Define Your 90 Day Targets</h2>
        <p className="text-muted-foreground">
          Enter at least 1 area to continue. Saved quarterly targets are transferred here automatically.
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={category.key} className="text-base font-semibold">
                {category.label}
              </Label>
              <span 
                className={`text-sm ${
                  targets[category.key].length > MAX_CHARS * 0.9
                    ? 'text-destructive' 
                    : 'text-muted-foreground'
                }`}
              >
                {targets[category.key].length}/{MAX_CHARS}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            <Textarea
              id={category.key}
              placeholder={category.placeholder}
              value={targets[category.key]}
              onChange={(e) => handleChange(category.key, e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={MAX_CHARS}
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          onClick={handleContinue}
          disabled={!canContinue || createTargets.isPending}
          className="w-full"
          size="lg"
        >
          {createTargets.isPending ? "Saving..." : `Continue (${filledCount}/4 areas filled)`}
        </Button>
        {!canContinue && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Fill at least 1 area to continue
          </p>
        )}
      </div>
    </div>
  );
}

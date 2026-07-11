import {
  useState } from "react";
import { Card,
  CardContent,
  CardHeader,
  CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedRefresh as RefreshCw } from "@/app/components/icons/AnimatedRefresh";

interface AffirmationSet {
  body: string[];
  being: string[];
  balance: string[];
  business: string[];
}

interface ThetaAffirmationsApprovalProps {
  affirmations: AffirmationSet;
  onApprove: (affirmations: AffirmationSet) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const categoryConfig = {
  body: { label: 'Body', color: 'bg-[#2997FF]/15 text-[#2997FF] border-[#2997FF]/20' },
  being: { label: 'Being', color: 'bg-[#2997FF]/15 text-[#2997FF] border-[#2997FF]/20' },
  balance: { label: 'Balance', color: 'bg-[#2997FF]/15 text-[#2997FF] border-[#2997FF]/20' },
  business: { label: 'Business', color: 'bg-[#2997FF]/15 text-[#2997FF] border-[#2997FF]/20' }
};
const MAX_AFFIRMATION_CHARS = 300;

export function ThetaAffirmationsApproval({
  affirmations,
  onApprove,
  onRegenerate,
  isRegenerating
}: ThetaAffirmationsApprovalProps) {
  const [editedAffirmations, setEditedAffirmations] = useState<AffirmationSet>(affirmations);
  const [editingIndex, setEditingIndex] = useState<{ category: keyof AffirmationSet; index: number } | null>(null);

  const handleEdit = (category: keyof AffirmationSet, index: number, value: string) => {
    setEditedAffirmations(prev => ({
      ...prev,
      [category]: prev[category].map((aff, i) => i === index ? value : aff)
    }));
  };

  const handleApprove = () => {
    // Validate all affirmations are present
    const allCategories = Object.keys(editedAffirmations) as Array<keyof AffirmationSet>;
    const isValid = allCategories.every(cat =>
      editedAffirmations[cat].length === 5 && editedAffirmations[cat].every(
        aff => aff.trim().length > 0 && aff.trim().length <= MAX_AFFIRMATION_CHARS,
      )
    );

    if (!isValid) {
      toast.error(`Each area needs 5 affirmations of ${MAX_AFFIRMATION_CHARS} characters or fewer.`);
      return;
    }

    onApprove(editedAffirmations);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review Your Affirmations</h3>
          <p className="text-sm text-muted-foreground">
            Edit any affirmation by clicking on it, or regenerate all with a different tone
          </p>
        </div>
        <Button
          onClick={onRegenerate}
          disabled={isRegenerating}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(categoryConfig) as Array<keyof AffirmationSet>).map((category) => {
          const config = categoryConfig[category];
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({editedAffirmations[category].length} affirmations)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editedAffirmations[category].map((affirmation, index) => {
                  const isEditing = editingIndex?.category === category && editingIndex?.index === index;
                  
                  return (
                    <div key={index} className="group relative">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={affirmation}
                            onChange={(e) => handleEdit(category, index, e.target.value)}
                            className="min-h-[60px] text-sm"
                            maxLength={MAX_AFFIRMATION_CHARS}
                            autoFocus
                          />
                          <p className="text-right text-xs text-muted-foreground">
                            {affirmation.length}/{MAX_AFFIRMATION_CHARS}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => setEditingIndex(null)}
                            className="w-full"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Done
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingIndex({ category, index })}
                          className="p-3 rounded-md bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors relative group"
                        >
                          <p className="text-sm pr-8">{affirmation}</p>
                          <Edit2 className="h-4 w-4 absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleApprove}
          size="lg"
          className="min-w-[200px]"
        >
          <Check className="h-5 w-5 mr-2" />
          Approve & Continue
        </Button>
      </div>
    </div>
  );
}

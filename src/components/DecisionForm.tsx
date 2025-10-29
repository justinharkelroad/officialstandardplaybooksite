import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INTAKE_SCHEMA, FormData } from '@/data/decisionEngine';

const formSchema = z.object({
  situation: z.string().min(1, { message: "Please describe your situation" }),
  team_size: z.coerce.number().optional(),
  ninety_day_win: z.string().min(1, { message: "Please describe your 90-day win" }),
  focus: z.array(z.string()).min(1, { message: "Select at least one focus area" }),
  coaching_mode: z.string().min(1, { message: "Select a coaching mode" }),
  urgency: z.string().min(1, { message: "Select a start timeframe" }),
  app_usage: z.boolean().default(false),
});

interface DecisionFormProps {
  onSubmit: (data: FormData) => void;
}

const DecisionForm = ({ onSubmit }: DecisionFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      situation: '',
      team_size: undefined,
      ninety_day_win: '',
      focus: [],
      coaching_mode: '',
      urgency: '',
      app_usage: false,
    },
  });

  const focusField = INTAKE_SCHEMA.fields.find((f) => f.id === 'focus');
  const coachingModeField = INTAKE_SCHEMA.fields.find((f) => f.id === 'coaching_mode');
  const urgencyField = INTAKE_SCHEMA.fields.find((f) => f.id === 'urgency');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-dark-card border border-primary/20 rounded-lg p-8 space-y-6">
        {/* Situation */}
        <div className="space-y-2">
          <Label htmlFor="situation" className="text-white font-medium">
            Your situation
          </Label>
          <Textarea
            id="situation"
            placeholder="Tell us where you are right now..."
            className="min-h-[120px] bg-dark-card border-primary/20 text-white placeholder:text-gray-500"
            {...form.register('situation')}
          />
          {form.formState.errors.situation && (
            <p className="text-red-500 text-sm">{form.formState.errors.situation.message}</p>
          )}
        </div>

        {/* Team Size */}
        <div className="space-y-2">
          <Label htmlFor="team_size" className="text-white font-medium">
            Team size
          </Label>
          <Input
            id="team_size"
            type="number"
            min="0"
            placeholder="How many people on your team?"
            className="bg-dark-card border-primary/20 text-white placeholder:text-gray-500"
            {...form.register('team_size')}
          />
        </div>

        {/* 90-Day Win */}
        <div className="space-y-2">
          <Label htmlFor="ninety_day_win" className="text-white font-medium">
            A win in the next 90 days looks like…
          </Label>
          <Textarea
            id="ninety_day_win"
            placeholder="What does success look like?"
            className="min-h-[120px] bg-dark-card border-primary/20 text-white placeholder:text-gray-500"
            {...form.register('ninety_day_win')}
          />
          {form.formState.errors.ninety_day_win && (
            <p className="text-red-500 text-sm">{form.formState.errors.ninety_day_win.message}</p>
          )}
        </div>

        {/* Primary Focus */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Primary focus</Label>
          <div className="space-y-3">
            {focusField?.options?.map((option) => {
              const isChecked = form.watch('focus')?.includes(option);
              return (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={`focus-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const current = form.getValues('focus') || [];
                      if (checked) {
                        form.setValue('focus', [...current, option]);
                      } else {
                        form.setValue('focus', current.filter((v) => v !== option));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`focus-${option}`}
                    className="text-gray-300 font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
          {form.formState.errors.focus && (
            <p className="text-red-500 text-sm">{form.formState.errors.focus.message}</p>
          )}
        </div>

        {/* Coaching Mode */}
        <div className="space-y-2">
          <Label htmlFor="coaching_mode" className="text-white font-medium">
            Coaching mode
          </Label>
          <Select
            value={form.watch('coaching_mode')}
            onValueChange={(value) => form.setValue('coaching_mode', value)}
          >
            <SelectTrigger className="bg-dark-card border-primary/20 text-white">
              <SelectValue placeholder="Select coaching preference" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card text-white border-primary/20 z-50">
              {coachingModeField?.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.coaching_mode && (
            <p className="text-red-500 text-sm">{form.formState.errors.coaching_mode.message}</p>
          )}
        </div>

        {/* Start Timeframe */}
        <div className="space-y-2">
          <Label htmlFor="urgency" className="text-white font-medium">
            Start timeframe
          </Label>
          <Select
            value={form.watch('urgency')}
            onValueChange={(value) => form.setValue('urgency', value)}
          >
            <SelectTrigger className="bg-dark-card border-primary/20 text-white">
              <SelectValue placeholder="When do you want to start?" />
            </SelectTrigger>
            <SelectContent className="bg-dark-card text-white border-primary/20 z-50">
              {urgencyField?.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.urgency && (
            <p className="text-red-500 text-sm">{form.formState.errors.urgency.message}</p>
          )}
        </div>

        {/* App Usage */}
        <div className="flex items-center space-x-3">
          <Switch
            id="app_usage"
            checked={form.watch('app_usage')}
            onCheckedChange={(checked) => form.setValue('app_usage', checked)}
          />
          <Label htmlFor="app_usage" className="text-gray-300 font-normal cursor-pointer">
            Willing to use the app weekly
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="btn-primary text-lg px-12">
          GET MY RECOMMENDATIONS
        </Button>
      </div>
    </form>
  );
};

export default DecisionForm;

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface BookingOnboardingFormProps {
  onComplete: () => void;
}

interface FormData {
  full_name: string;
  email: string;
  cell_phone: string;
  primary_carrier: string;
  whats_working: string;
  whats_not_working: string;
  desired_outcome: string;
  committed: boolean | null;
}

const SESSION_KEY = 'booking-session-id';

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const BookingOnboardingForm = ({ onComplete }: BookingOnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    cell_phone: '',
    primary_carrier: '',
    whats_working: '',
    whats_not_working: '',
    desired_outcome: '',
    committed: null,
  });

  // Load existing session data on mount
  useEffect(() => {
    const loadExistingSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('booking_leads')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (data && !error) {
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            cell_phone: data.cell_phone || '',
            primary_carrier: data.primary_carrier || '',
            whats_working: data.whats_working || '',
            whats_not_working: data.whats_not_working || '',
            desired_outcome: data.desired_outcome || '',
            committed: data.committed,
          });
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingSession();
  }, [sessionId]);

  // Debounced auto-save
  const saveToDatabase = useCallback(async (data: FormData) => {
    setIsSaving(true);
    try {
      // Check if row exists
      const { data: existing } = await supabase
        .from('booking_leads')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existing) {
        // Update existing row
        await supabase
          .from('booking_leads')
          .update({
            ...data,
          })
          .eq('session_id', sessionId);
      } else {
        // Insert new row
        await supabase
          .from('booking_leads')
          .insert({
            session_id: sessionId,
            ...data,
          });
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId]);

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.full_name || formData.email || formData.cell_phone) {
        saveToDatabase(formData);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, saveToDatabase]);

  const updateField = (field: keyof FormData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    updateField('cell_phone', formatted);
  };

  const isStep1Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return (
      formData.full_name.trim() !== '' &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.cell_phone.replace(/\s/g, ''))
    );
  };

  const isStep2Valid = () => {
    return (
      formData.primary_carrier.trim() !== '' &&
      formData.whats_working.trim() !== '' &&
      formData.whats_not_working.trim() !== '' &&
      formData.desired_outcome.trim() !== '' &&
      formData.committed === true
    );
  };

  const handleNext = () => {
    if (isStep1Valid()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleComplete = async () => {
    if (!isStep2Valid()) return;

    // Mark as completed and save
    try {
      await supabase
        .from('booking_leads')
        .update({ completed: true })
        .eq('session_id', sessionId);
      
      onComplete();
    } catch (error) {
      console.error('Error completing form:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Step {step} of 2</span>
          {isSaving && (
            <span className="text-gray-400 flex items-center gap-1 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
        </div>
        <Progress value={step * 50} className="h-2" />
        <h2 className="text-xl font-semibold text-white">
          {step === 1 ? 'Contact Information' : 'Tell Us About Your Team'}
        </h2>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="John Smith"
              value={formData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@agency.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell_phone" className="text-gray-300">Cell Phone *</Label>
            <Input
              id="cell_phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.cell_phone}
              onChange={handlePhoneChange}
              maxLength={14}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
            <p className="text-xs text-gray-400">
              Please enter your personal cell phone, NOT your agency phone number
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!isStep1Valid()}
            className="w-full mt-6"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary_carrier" className="text-gray-300">Primary Carrier *</Label>
            <Input
              id="primary_carrier"
              type="text"
              placeholder="e.g., State Farm, Allstate"
              value={formData.primary_carrier}
              onChange={(e) => updateField('primary_carrier', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whats_working" className="text-gray-300">
              What do you feel like is WORKING right now inside of your sales team? *
            </Label>
            <Textarea
              id="whats_working"
              placeholder="Describe what's working well..."
              value={formData.whats_working}
              onChange={(e) => updateField('whats_working', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whats_not_working" className="text-gray-300">
              What do you feel like is NOT WORKING right now inside of your sales team? *
            </Label>
            <Textarea
              id="whats_not_working"
              placeholder="Describe what's not working..."
              value={formData.whats_not_working}
              onChange={(e) => updateField('whats_not_working', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desired_outcome" className="text-gray-300">
              What is the desired outcome in your mind for our call? *
            </Label>
            <Textarea
              id="desired_outcome"
              placeholder="What do you hope to achieve from this call?"
              value={formData.desired_outcome}
              onChange={(e) => updateField('desired_outcome', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="committed" className="text-gray-300">
              Are you committed to showing up for the call? *
            </Label>
            <Select
              value={formData.committed === null ? '' : formData.committed ? 'yes' : 'no'}
              onValueChange={(value) => updateField('committed', value === 'yes')}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {formData.committed === false && (
              <p className="text-xs text-red-400">
                We only work with people who are 100% committed to showing up. If there's any hesitation, we may not be the right fit.
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!isStep2Valid()}
              className="flex-1"
            >
              Continue to Booking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingOnboardingForm;

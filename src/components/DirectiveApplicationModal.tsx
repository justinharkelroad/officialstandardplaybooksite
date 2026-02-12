import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DirectiveApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DirectiveApplicationModal = ({ open, onOpenChange }: DirectiveApplicationModalProps) => {
  const [form, setForm] = useState({ full_name: '', email: '', cell_phone: '', agency_name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      // Save to DB
      const { error } = await supabase.from('directive_applications').insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        cell_phone: form.cell_phone.trim(),
        agency_name: form.agency_name.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke('send-directive-notification', {
        body: {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          cell_phone: form.cell_phone.trim(),
          agency_name: form.agency_name.trim(),
          message: form.message.trim(),
        },
      });

      toast.success('Application submitted! We\'ll be in touch soon.');
      setForm({ full_name: '', email: '', cell_phone: '', agency_name: '', message: '' });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0f1e] border-blue-500/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-oswald text-2xl uppercase tracking-wide text-white">Apply for The Directive</DialogTitle>
          <p className="text-gray-400 text-sm mt-1">Submit your application and we'll reach out personally.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Full Name *"
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            className={inputClass}
            maxLength={100}
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className={inputClass}
            maxLength={255}
            required
          />
          <input
            type="tel"
            placeholder="Cell Phone"
            value={form.cell_phone}
            onChange={e => setForm(f => ({ ...f, cell_phone: formatPhone(e.target.value) }))}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Agency Name"
            value={form.agency_name}
            onChange={e => setForm(f => ({ ...f, agency_name: e.target.value }))}
            className={inputClass}
            maxLength={150}
          />
          <textarea
            placeholder="Why are you interested in The Directive?"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className={`${inputClass} min-h-[100px] resize-none`}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-bold text-base py-4 rounded-full hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DirectiveApplicationModal;

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

interface WebsitesInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WebsitesInquiryModal = ({ open, onOpenChange }: WebsitesInquiryModalProps) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    agency_name: '',
    timeline: '',
    message: '',
  });
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
      const { error } = await supabase.functions.invoke('send-websites-inquiry', {
        body: {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          agency_name: form.agency_name.trim(),
          timeline: form.timeline.trim(),
          message: form.message.trim(),
        },
      });
      if (error) throw error;

      toast.success("Thanks — we'll be in touch within one business day.");
      setForm({ full_name: '', email: '', phone: '', agency_name: '', timeline: '', message: '' });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: sf,
    fontSize: 17,
    fontWeight: 400,
    lineHeight: 1.47,
    letterSpacing: '-0.374px',
    color: '#1d1d1f',
    background: '#f5f5f7',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: sf,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.29,
    letterSpacing: '-0.224px',
    color: '#1d1d1f',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tell us what you're looking for</DialogTitle>
          <p style={{ fontFamily: sf, fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)', marginTop: 4 }}>
            Share a few details and we'll reach out with a custom quote.
          </p>
        </DialogHeader>
        <style>{`
          .apple-form input, .apple-form textarea, .apple-form select {
            color: #1d1d1f !important;
            background: #f5f5f7 !important;
            border-color: rgba(0,0,0,0.1) !important;
          }
          .apple-form input::placeholder, .apple-form textarea::placeholder {
            color: rgba(0,0,0,0.3) !important;
          }
          .apple-form input:focus, .apple-form textarea:focus, .apple-form select:focus {
            border-color: #0071e3 !important;
            box-shadow: none !important;
            outline: none !important;
          }
        `}</style>
        <form onSubmit={handleSubmit} className="apple-form" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              placeholder="John Smith"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              style={inputStyle}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="john@agency.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
              maxLength={255}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Agency Name</label>
            <input
              type="text"
              placeholder="Your agency"
              value={form.agency_name}
              onChange={e => setForm(f => ({ ...f, agency_name: e.target.value }))}
              style={inputStyle}
              maxLength={150}
            />
          </div>
          <div>
            <label style={labelStyle}>Timeline</label>
            <select
              value={form.timeline}
              onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
              style={inputStyle}
            >
              <option value="">Select…</option>
              <option value="ASAP">ASAP</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="Just exploring">Just exploring</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>What are you looking for?</label>
            <textarea
              placeholder="Pages you need, features you're thinking about, questions…"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              fontFamily: sf,
              fontSize: 17,
              fontWeight: 400,
              color: '#fff',
              background: submitting ? 'rgba(0,113,227,0.5)' : '#0071e3',
              border: '1px solid transparent',
              borderRadius: 980,
              padding: '12px 0',
              width: '100%',
              cursor: submitting ? 'default' : 'pointer',
              transition: 'all 0.2s',
              marginTop: 8,
            }}
          >
            {submitting ? 'Sending...' : 'Send inquiry'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebsitesInquiryModal;

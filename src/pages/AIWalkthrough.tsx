import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download, CheckCircle } from 'lucide-react';
import standardLogo from '@/assets/standard-word-logo.png';

const PDF_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=189jb2-R6jfqSHJBpRQHrnvaI3an3l39m';

const AIWalkthrough = () => {
  const [open, setOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', cell_phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.cell_phone) {
      toast.error('Please fill out all fields.');
      return;
    }
    setLoading(true);

    try {
      // Save to booking_leads with source='ai-walkthrough'
      const sessionId = `ai-walkthrough-${Date.now()}`;
      const { error: dbError } = await supabase.from('booking_leads').insert({
        full_name: form.full_name,
        email: form.email,
        cell_phone: form.cell_phone,
        session_id: sessionId,
        source: 'ai-walkthrough',
        completed: true,
      });

      if (dbError) {
        console.error('DB error:', dbError);
        toast.error('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-walkthrough-notification', {
          body: { full_name: form.full_name, email: form.email, cell_phone: form.cell_phone },
        });
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <Dialog open={open} onOpenChange={(v) => { if (submitted) setOpen(v); }}>
        <DialogContent className="bg-dark-card border-white/10 text-white max-w-md p-0 gap-0 [&>button]:text-white">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="text-center space-y-3">
                <img src={standardLogo} alt="Standard" className="h-8 mx-auto mb-2" />
                <h2 className="font-oswald font-bold text-2xl md:text-3xl uppercase tracking-tight text-white">
                  Get Your AI Brain Walkthrough
                </h2>
                <p className="text-gray-400 text-sm">
                  Fill out the form below to get instant access to the walkthrough.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-300 text-sm font-medium">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="John Smith"
                    value={form.full_name}
                    onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@agency.com"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cell_phone" className="text-gray-300 text-sm font-medium">Phone Number</Label>
                  <Input
                    id="cell_phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.cell_phone}
                    onChange={(e) => setForm(f => ({ ...f, cell_phone: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-oswald font-bold text-lg uppercase tracking-wide py-6 hover:bg-primary-light rounded-pill button-press accent-glow"
              >
                {loading ? 'Submitting...' : 'Get Access'}
              </Button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <div className="space-y-2">
                <h2 className="font-oswald font-bold text-2xl uppercase tracking-tight text-white">
                  You're In!
                </h2>
                <p className="text-gray-400">
                  Click below to download your AI Brain Walkthrough.
                </p>
              </div>
              <a href={PDF_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary text-white font-oswald font-bold text-lg uppercase tracking-wide py-6 hover:bg-primary-light rounded-pill button-press accent-glow gap-2">
                  <Download className="w-5 h-5" />
                  Download Walkthrough
                </Button>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIWalkthrough;

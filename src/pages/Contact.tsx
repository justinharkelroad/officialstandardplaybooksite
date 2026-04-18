import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import StandardFitModal from '@/components/StandardFitModal';

const sf = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   HERO — BLACK
   ══════════════════════════════════════════════════════ */
const HeroSection = ({ onBookCall }: { onBookCall: () => void }) => (
  <section
    className="relative flex items-center justify-center text-center"
    style={{
      background: '#000',
      minHeight: '70vh',
      paddingTop: 48,
    }}
  >
    <div className="px-6 max-w-[980px] mx-auto">
      <Reveal>
        <p
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600,
            letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}
        >
          Contact
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1
          style={{
            fontFamily: sf,
            fontSize: 'clamp(40px, 7vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            color: '#fff',
            margin: 0,
          }}
        >
          Get in touch.
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p
          style={{
            fontFamily: sf,
            fontSize: 'clamp(18px, 3vw, 21px)',
            fontWeight: 400,
            lineHeight: 1.19,
            letterSpacing: '0.231px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: 16,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Questions about the programs or ready to raise your standard? We'll respond within 24 hours.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <button
            onClick={onBookCall}
            style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400,
              color: '#fff', background: '#0071e3',
              border: '1px solid transparent', borderRadius: 8,
              padding: '8px 20px', cursor: 'pointer',
            }}
            className="hover:brightness-110 transition-all"
          >
            Book a Call
          </button>
          <a
            href="mailto:info@standardplaybook.com"
            style={{
              fontFamily: sf, fontSize: 17, fontWeight: 400,
              color: '#2997ff',
              border: '1px solid #2997ff',
              borderRadius: 980,
              padding: '8px 20px',
              textDecoration: 'none',
            }}
            className="hover:bg-[#2997ff]/10 transition-all"
          >
            Send an email
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   CONTACT METHODS — LIGHT GRAY
   ══════════════════════════════════════════════════════ */
type ContactMethod = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const contactMethods: ContactMethod[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@standardplaybook.com',
    href: 'mailto:info@standardplaybook.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (260) 515-1349',
    href: 'tel:+12605151349',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Fort Wayne, IN, USA',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
  },
];

const ContactCard = ({ method }: { method: ContactMethod }) => {
  const Icon = method.icon;
  const content = (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        transition: 'transform 0.3s ease',
      }}
      className="hover:-translate-y-1"
    >
      <div
        style={{
          width: 44, height: 44,
          borderRadius: 12,
          background: 'rgba(0,113,227,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon style={{ width: 22, height: 22, color: '#0071e3' }} />
      </div>
      <div>
        <p style={{
          fontFamily: sf, fontSize: 12, fontWeight: 600, lineHeight: 1.33,
          letterSpacing: '-0.12px', color: '#0071e3',
          textTransform: 'uppercase', marginBottom: 6,
        }}>
          {method.label}
        </p>
        <p style={{
          fontFamily: sf, fontSize: 21, fontWeight: 600, lineHeight: 1.19,
          letterSpacing: '0.231px', color: '#1d1d1f',
        }}>
          {method.value}
        </p>
      </div>
    </div>
  );

  if (method.href) {
    return (
      <a
        href={method.href}
        {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        {content}
      </a>
    );
  }
  return content;
};

const ContactMethodsSection = () => (
  <section style={{ background: '#f5f5f7', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <Reveal>
        <div className="text-center mb-16">
          <p style={{
            fontFamily: sf, fontSize: 14, fontWeight: 600, lineHeight: 1.29,
            letterSpacing: '-0.224px', color: 'rgba(0,0,0,0.48)',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            Reach Out
          </p>
          <h2 style={{
            fontFamily: sf, fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: 600,
            lineHeight: 1.1, letterSpacing: 'normal', color: '#1d1d1f',
          }}>
            Ways to connect.
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactMethods.map((method, i) => (
          <Reveal key={method.label} delay={i * 0.05}>
            <ContactCard method={method} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   LOCATION — BLACK SECTION
   ══════════════════════════════════════════════════════ */
const LocationSection = () => (
  <section style={{ background: '#000', padding: '120px 24px' }}>
    <div className="max-w-[980px] mx-auto text-center">
      <Reveal>
        <p style={{
          fontFamily: sf, fontSize: 14, fontWeight: 600, lineHeight: 1.29,
          letterSpacing: '-0.224px', color: 'rgba(255,255,255,0.48)',
          textTransform: 'uppercase', marginBottom: 12,
        }}>
          Based in
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 style={{
          fontFamily: sf, fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 600,
          lineHeight: 1.07, letterSpacing: '-0.28px', color: '#fff',
        }}>
          Fort Wayne, Indiana.
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p style={{
          fontFamily: sf, fontSize: 'clamp(18px, 3vw, 21px)', fontWeight: 400,
          lineHeight: 1.19, letterSpacing: '0.231px',
          color: 'rgba(255,255,255,0.6)', marginTop: 16,
        }}>
          Serving insurance agencies nationwide.
        </p>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════
   APPLE FOOTER
   ══════════════════════════════════════════════════════ */
const AppleFooter = () => (
  <footer style={{ background: '#f5f5f7', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
    <div className="max-w-[980px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p style={{
          fontFamily: sf, fontSize: 12, fontWeight: 400, lineHeight: 1.33,
          letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)',
        }}>
          Copyright &copy; {new Date().getFullYear()} Standard Playbook Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: 'Privacy', to: '/privacy' },
            { label: 'Terms', to: '/terms' },
            { label: 'Contact', to: '/contact' },
          ].map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              {i > 0 && (
                <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: 10 }}>|</span>
              )}
              <Link
                to={link.to}
                style={{
                  fontFamily: sf, fontSize: 12, fontWeight: 400,
                  letterSpacing: '-0.12px', color: 'rgba(0,0,0,0.48)', textDecoration: 'none',
                }}
                className="hover:text-[#1d1d1f] transition-colors"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const Contact = () => {
  const [fitModalOpen, setFitModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: sf, background: '#000' }}>
      <SEOHead />
      <Navigation />
      <HeroSection onBookCall={() => setFitModalOpen(true)} />
      <ContactMethodsSection />
      <LocationSection />
      <AppleFooter />
      <StandardFitModal open={fitModalOpen} onOpenChange={setFitModalOpen} />
    </div>
  );
};

export default Contact;

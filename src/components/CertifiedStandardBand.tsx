import { Link } from 'react-router-dom';
import { CERTIFIED_STANDARD_PATH, getCertifiedStandardHandoff } from '@/data/certifiedStandard';

const display = '"Anton", "Archivo Black", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const ink = '#0A0A0B';
const paper = '#F4F2EE';
const blue = '#2997FF';

const CertifiedStandardBand = () => (
  <section aria-labelledby="certified-standard-heading" style={{ background: ink, color: paper, padding: '100px 24px', fontFamily: body }}>
    <div className="max-w-[1280px] mx-auto">
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: blue, marginBottom: 24 }}>/ Certified Standard</p>
      <h2 id="certified-standard-heading" style={{ fontFamily: display, fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: 1, textTransform: 'uppercase', fontWeight: 400, letterSpacing: '-.01em', maxWidth: 1100, textWrap: 'balance' }}>
        A process they can practice.<br /><span style={{ color: blue }}>Evidence you can coach.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-10">
        <div>
          <p style={{ fontSize: 18, lineHeight: 1.65, maxWidth: 620 }}>
            Develop producer readiness from the first hello through the close and follow-up. AI customer rehearsal, scored checks, and practical guides give your team one standard. The Confirmation gives you the owner handoff to verify it on real calls.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: '#c9c7c4', marginTop: 24 }}>
            $399 per learner seat, one time. Managing your team uses no seat. Purchase and training are delivered through Agency Brain; no full Agency Brain subscription required.
          </p>
          <div className="flex flex-wrap items-center gap-5 mt-8">
            <Link to={`${CERTIFIED_STANDARD_PATH}?src=home-band`} className="inline-block px-6 py-4 font-bold text-sm uppercase tracking-wide bg-[#F4F2EE] text-[#0A0A0B] hover:bg-[#2997FF] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#2997FF]">
              Explore Certified Standard →
            </Link>
            <a href={getCertifiedStandardHandoff('?src=home-band')} className="inline-block py-3 text-sm font-bold underline underline-offset-4 hover:text-[#2997FF] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#2997FF]">
              Choose learner seats →
            </a>
          </div>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {[
            ['A defined training path', '17 conversation modules and four knowledge commitments. Unscored practice builds the skill; scored skill and knowledge checks require 80% to pass.'],
            ['Work you can review', 'Saved answers, results, feedback, and available roleplay evidence. A standard one-time allowance of 750 voice minutes per learner seat.'],
            ['An owner-led finish', 'Three producer PDF guides and The Confirmation: debrief, live proof, a 30-day coaching window, and Confirmed / Not Yet sign-off.'],
          ].map(([title, text]) => (
            <li key={title} style={{ borderTop: '1px solid #f4f2ee44', paddingBlock: 24 }}>
              <h3 style={{ fontFamily: display, fontSize: 28, lineHeight: 1.1, fontWeight: 400, textTransform: 'uppercase', marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#c9c7c4' }}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default CertifiedStandardBand;

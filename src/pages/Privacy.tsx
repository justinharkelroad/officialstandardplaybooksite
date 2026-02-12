import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Back to Home */}
      <div className="container mx-auto px-4 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            Privacy
            <br />
            <span className="text-gradient">Policy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Agency Brain Privacy Policy — How we collect, use, disclose, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div className="space-y-12 text-gray-300">
              
              <div className="text-center mb-12">
                <p className="text-lg leading-relaxed">
                  <strong>Standard Playbook INC</strong> ("we," "us," "our," or the "Company"), doing business as Agency Brain, operates the Agency Brain platform, accessible at myagencybrain.com and via associated mobile applications (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our Service.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  By accessing or using the Service, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Service immediately.
                </p>
              </div>

              {/* All sections from previous Privacy.tsx - keeping same content */}
              {/* Section 1 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  1. Scope and Applicability
                </h2>
                <p>This Privacy Policy applies to all users of the Agency Brain platform, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li><strong>Agency Owners</strong> who manage insurance agencies through the platform</li>
                  <li><strong>Key Employees</strong> granted owner-level dashboard access by agency owners</li>
                  <li><strong>Staff Portal Users</strong> (team members) who submit daily performance data and access training</li>
                  <li><strong>Coaching Clients</strong> (1:1 Coaching and Boardroom members) who use coaching, training, and personal development tools</li>
                  <li><strong>Administrative Users</strong> who manage the platform at a system level</li>
                </ul>
                <p className="mt-4">
                  This policy covers data collected through all platform features including, without limitation, KPI tracking, call scoring, AI coaching tools, lead management, community features, document storage, and all integrated third-party services.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  2. Information We Collect
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">2.1 Account and Identity Information</h3>
                <p>When you create an account or are added to the platform, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Full name, email address, and phone number</li>
                  <li>Username and password (hashed; we never store plaintext passwords)</li>
                  <li>Agency affiliation and role designation (Admin, Owner, Key Employee, Staff, Manager)</li>
                  <li>Membership tier (1:1 Coaching, Boardroom, Call Scoring)</li>
                  <li>Profile information you voluntarily provide for AI personalization (goals, background, preferences)</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.2 Performance and Business Data</h3>
                <p>Through your use of the platform, we collect and process:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Daily KPI submissions (outbound calls, talk minutes, quotes, items sold, premium amounts)</li>
                  <li>Prospect and lead information (names, contact details, insurance details, lead sources, ZIP codes)</li>
                  <li>Sales and service performance metrics, scorecard data, and contest results</li>
                  <li>Commission data, production figures, and financial performance metrics you submit</li>
                  <li>Custom form field data as configured by your agency owner</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.3 Audio Recordings and Transcriptions</h3>
                <p className="text-primary font-semibold mb-2">This is a critical data category.</p>
                <p>When you use our Call Scoring feature, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Audio recordings of insurance sales and service calls that you or your agency owner upload to the platform (MP3, WAV, M4A, OGG formats, up to 100MB per file)</li>
                  <li>Automated transcriptions of those recordings generated by OpenAI Whisper</li>
                  <li>AI-generated analysis of call content including skill scores, discovery evaluations, and performance assessments generated by OpenAI GPT-4o</li>
                </ul>
                <div className="bg-dark-card border border-primary/20 rounded-lg p-6 mt-4">
                  <p><strong>Important:</strong> Call recordings may contain personally identifiable information about third parties (your clients/prospects). If the call recording does, Agency Brain will eliminate them from the transcription generation before scoring and permanently delete. You are responsible for ensuring you have all necessary consents under applicable federal and state wiretapping and recording laws before uploading any call recording to the platform. Agency Brain does not independently verify that such consents have been obtained. Once transcribed and scored, Agency Brain deletes all records of call recordings immediately and does not retain any transcription details.</p>
                </div>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.4 AI Interaction Data</h3>
                <p>Our platform uses artificial intelligence across several features. When you interact with AI-powered tools, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Roleplay Bot conversation transcripts and AI-generated performance grades</li>
                  <li>Life Targets, goals, affirmations, and personal development data you input for AI processing</li>
                  <li>Flow session responses and AI-generated reflections and insights</li>
                  <li>Theta Talk Track inputs (body, being, balance, and business targets) used to generate personalized audio content</li>
                  <li>AI-generated coaching suggestions, daily action plans, and monthly missions</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.5 Community and Communication Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posts, comments, and reactions shared in The Exchange community feed</li>
                  <li>Direct messages exchanged between platform members</li>
                  <li>Tag selections, topic preferences, and engagement patterns</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.6 Documents and Files</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Files uploaded to the Process Vault (onboarding documents, quoting procedures, service protocols)</li>
                  <li>Training materials created by agency owners</li>
                  <li>Coaching documents and uploaded reports</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.7 Usage and Technical Data</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>IP address, browser type and version, operating system, and device identifiers</li>
                  <li>Pages visited, features used, timestamps, session duration, and click patterns</li>
                  <li>Error logs, performance metrics, and diagnostic data</li>
                  <li>Referring URLs and exit pages</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">2.8 Payment Information</h3>
                <p>We use Stripe as our payment processor. When you subscribe to a paid plan, Stripe collects your payment card number, expiration date, CVC, and billing address. We do not store, access, or process your full payment card details on our servers. We receive only a tokenized reference, the last four digits of your card, card brand, and expiration date from Stripe for display and record-keeping purposes. Our payment processing is compliant with PCI-DSS standards through Stripe.</p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  3. How We Use Your Information
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">3.1 Service Delivery and Operations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing, maintaining, and improving the Agency Brain platform and all its features</li>
                  <li>Processing KPI submissions, generating analytics dashboards, and producing performance reports</li>
                  <li>Transcribing and analyzing uploaded call recordings to generate call scorecards</li>
                  <li>Powering AI coaching tools including roleplay grading, life target analysis, affirmation generation, and Flow sessions</li>
                  <li>Managing user accounts, authentication, and role-based access controls</li>
                  <li>Processing payments and managing subscription tiers</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">3.2 Communication</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sending transactional emails (scorecard submission confirmations, daily summaries, password resets)</li>
                  <li>Delivering in-app notifications for community activity, training assignments, and coaching updates</li>
                  <li>Contacting you regarding account security, service changes, or policy updates</li>
                </ul>
                <p className="mt-4 text-primary font-semibold">We do not sell advertising, and we will not send you third-party marketing communications without your explicit opt-in consent.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">3.3 Analytics and Improvement</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyzing usage patterns to improve platform performance and user experience</li>
                  <li>Identifying and resolving technical issues, bugs, and security vulnerabilities</li>
                  <li>Developing new features and capabilities based on aggregate usage data</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">3.4 Legal and Safety</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Complying with applicable laws, regulations, and legal processes</li>
                  <li>Enforcing our Terms of Service and protecting against fraud, abuse, or unauthorized access</li>
                  <li>Protecting the rights, property, and safety of our users and the public</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  4. Third-Party Service Providers (Sub-Processors)
                </h2>
                <p className="mb-6">We share your data with the following categories of third-party service providers strictly to operate and deliver the Service:</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">4.1 Infrastructure and Database</h3>
                <p><strong>Supabase, Inc.</strong> — Cloud database hosting (PostgreSQL), user authentication, file storage, edge function execution, and real-time data synchronization.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">4.2 Artificial Intelligence and Machine Learning</h3>
                <p><strong>OpenAI, L.L.C.</strong> — Call transcription (Whisper API) and call analysis (GPT-4o API).</p>
                <p className="mt-2"><strong>Lovable AI Gateway</strong> — AI processing for affirmation generation, roleplay grading, life target analysis, monthly mission generation, and daily action suggestions.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">4.3 Voice Synthesis</h3>
                <p><strong>ElevenLabs, Inc.</strong> — Voice synthesis for the Theta Talk Track feature and real-time AI voice conversation for the Roleplay Bot.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">4.4 Payment Processing</h3>
                <p><strong>Stripe, Inc.</strong> — All payment processing, subscription management, and billing. PCI-DSS Level 1 certified.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">4.5 Email Delivery</h3>
                <p><strong>Resend</strong> — Transactional email delivery for scorecard notifications, daily summaries, password resets, training assignments, and other platform communications.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">4.6 Updates to This List</h3>
                <p>We may add or change sub-processors as the Service evolves. We will update this section when material changes occur and notify affected users at least 30 days before a new sub-processor begins processing personal data.</p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  5. Data Roles: Controller vs. Processor
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">5.1 Data Controller</h3>
                <p>We act as the data controller for data we collect directly from you for our own purposes, including your account information, usage data, payment information, and data you submit through coaching and personal development tools.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">5.2 Data Processor</h3>
                <p>We act as a data processor on behalf of Agency Owners for data submitted through agency operations. Agency Owners are the data controllers for this data and are responsible for ensuring they have a lawful basis to collect and process it.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">5.3 Data Processing Agreement</h3>
                <p>Agency Owners who require a Data Processing Agreement (DPA) may request one by contacting us at the email address provided in Section 17.</p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  6. AI Data Processing Disclosure
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">6.1 What Data Is Sent to AI Providers</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Call Scoring:</strong> Audio files are sent to OpenAI Whisper for transcription. The resulting text transcript is sent to OpenAI GPT-4o for analysis and scoring.</li>
                  <li><strong>Roleplay Bot:</strong> Your spoken input is processed by ElevenLabs for voice recognition and generation, and by AI models for response generation and grading.</li>
                  <li><strong>Life Targets and Flows:</strong> The goals, reflections, and personal context you enter are sent to AI models to generate personalized coaching insights.</li>
                  <li><strong>Theta Talk Track:</strong> Your body, being, balance, and business targets are sent to AI models for affirmation generation, and the resulting text is sent to ElevenLabs for voice synthesis.</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">6.2 AI Training Opt-Out</h3>
                <p>We use OpenAI's API tier, which by default does not use submitted data to train OpenAI's models. We contractually require that no third-party AI provider uses your data to train, improve, or develop their general-purpose models.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">6.3 Automated Decision-Making</h3>
                <p>Our AI features generate scores, rankings, and assessments. These outputs are informational tools designed to support human decision-making. They are not used as the sole basis for decisions that produce legal or similarly significant effects on individuals.</p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  7. Call Recording and Consent
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">7.1 Consent Obligations</h3>
                <p>Federal law and many U.S. states require one-party or all-party consent before a telephone conversation may be recorded. You are solely responsible for understanding and complying with applicable recording consent laws before uploading recordings to our platform.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">7.2 Audio Data Handling</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Call recordings are stored in encrypted cloud storage scoped to your agency.</li>
                  <li>Recordings are accessible only to authorized users within your agency.</li>
                  <li>Transcriptions and AI analysis outputs are subject to the same access controls.</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">7.3 Audio Data Retention</h3>
                <p>Call recordings and associated transcriptions are retained for the duration of your active subscription. Upon account termination, audio files and transcriptions will be permanently deleted within 90 days.</p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  8. Data Retention
                </h2>
                <div className="space-y-4">
                  <div><strong className="text-white">Account Data:</strong> Retained for the duration of your account and for 30 days following account deletion.</div>
                  <div><strong className="text-white">Performance and KPI Data:</strong> Retained for the duration of the agency's active subscription. Deleted within 90 days of termination.</div>
                  <div><strong className="text-white">Call Recordings and Transcriptions:</strong> Retained for the duration of the agency's active subscription. Permanently deleted within 90 days of account termination.</div>
                  <div><strong className="text-white">AI-Generated Content:</strong> Retained for the duration of your account.</div>
                  <div><strong className="text-white">Community Content (The Exchange):</strong> Retained for the duration of the platform's operation. You may delete your own content at any time.</div>
                  <div><strong className="text-white">Usage and Technical Logs:</strong> Retained for up to 12 months, then anonymized or deleted.</div>
                  <div><strong className="text-white">Billing Records:</strong> Retained for 7 years as required by applicable tax and financial reporting regulations.</div>
                  <div><strong className="text-white">Documents (Process Vault):</strong> Retained until deleted by the user or upon account termination (deleted within 90 days).</div>
                </div>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  9. Your Privacy Rights
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">9.1 General Rights (All Users)</h3>
                <p>Regardless of your location, you have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Correct inaccurate or incomplete personal data</li>
                  <li>Delete your personal data, subject to our retention obligations</li>
                  <li>Export your data in a machine-readable format (data portability)</li>
                  <li>Withdraw consent for processing where consent is the legal basis</li>
                  <li>Object to processing of your personal data for certain purposes</li>
                </ul>
                <p className="mt-4">To exercise any of these rights, contact us at the email address in Section 17. We will respond within 30 days.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">9.2 California Residents (CCPA/CPRA)</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Right to Know:</strong> You may request the specific categories and pieces of personal information we have collected about you.</li>
                  <li><strong>Right to Delete:</strong> You may request deletion of your personal information.</li>
                  <li><strong>Right to Opt-Out of Sale or Sharing:</strong> We do not sell or share your personal information for cross-context behavioral advertising.</li>
                  <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> We use sensitive personal information only as necessary to provide the Service.</li>
                  <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-8">9.3 Additional State Privacy Rights</h3>
                <p>Residents of Virginia, Colorado, Connecticut, Utah, and other states with comprehensive privacy laws may have additional rights. Contact us at the email address in Section 17.</p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  10. Data Security
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All data is transmitted over TLS/SSL encryption (HTTPS)</li>
                  <li>Data at rest is encrypted using AES-256 encryption</li>
                  <li>Row Level Security (RLS) ensures complete data isolation between agencies</li>
                  <li>Role-based access controls restrict data visibility based on user role</li>
                  <li>Authentication credentials are hashed using industry-standard algorithms</li>
                  <li>Session tokens are cryptographically generated with defined expiration periods</li>
                  <li>Regular security audits of edge functions, database policies, and access controls</li>
                </ul>
                <p className="mt-4">No method of electronic transmission or storage is 100% secure. If you become aware of any unauthorized access, contact us immediately.</p>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  11. Data Breach Notification
                </h2>
                <p>In the event of a data breach, we will:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>Investigate and contain the breach as rapidly as possible</li>
                  <li>Notify affected users via email within 72 hours of confirming the breach</li>
                  <li>Notify applicable regulatory bodies as required by law</li>
                  <li>Provide a description of the breach, the types of data involved, and recommendations for affected individuals</li>
                </ul>
              </div>

              {/* Section 12 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  12. Children's Privacy
                </h2>
                <p>Agency Brain is a business platform designed for insurance professionals. The Service is not directed to, and we do not knowingly collect personal information from, anyone under the age of 18. If you believe a minor has provided us with personal data, please contact us immediately at the email address in Section 17.</p>
              </div>

              {/* Section 13 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  13. Cookies and Tracking Technologies
                </h2>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3">13.1 Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for authentication, session management, and core platform functionality.</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences such as dark/light mode, language settings, and dashboard configurations.</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform. First-party analytics only.</li>
                </ul>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">13.2 What We Do Not Use</h3>
                <p>We do not use third-party advertising cookies. We do not engage in cross-site tracking. We do not sell cookie data or browsing behavior to any third party.</p>

                <h3 className="font-rajdhani font-semibold text-xl text-white mb-3 mt-6">13.3 Managing Cookies</h3>
                <p>You can manage cookie preferences through your browser settings. Disabling essential cookies may impair platform functionality.</p>
              </div>

              {/* Section 14 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  14. International Data Transfers
                </h2>
                <p>Your data is processed and stored in the United States. If you access the Service from outside the United States, your data will be transferred to and processed in the United States. By using the Service, you consent to this transfer.</p>
              </div>

              {/* Section 15 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  15. Third-Party Links and Integrations
                </h2>
                <p>The Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies.</p>
              </div>

              {/* Section 16 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  16. Changes to This Privacy Policy
                </h2>
                <p>When we make material changes, we will:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>Post the updated policy with a revised "Last Updated" date</li>
                  <li>Notify you via email at least 30 days before material changes take effect</li>
                  <li>Provide a prominent in-app notification when you next log in</li>
                </ul>
                <p className="mt-4">Continued use of the Service after the effective date constitutes your acceptance of the updated terms.</p>
              </div>

              {/* Section 17 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  17. Contact Information
                </h2>
                <p>If you have questions about this Privacy Policy, wish to exercise your privacy rights, or need to report a data concern, contact us at:</p>
                <div className="bg-dark-card border border-primary/20 rounded-lg p-6 mt-4">
                  <p><strong>Standard Playbook INC</strong> (d/b/a Agency Brain)</p>
                  <p><strong>Email:</strong> info@standardplaybook.com</p>
                  <p><strong>Website:</strong> myagencybrain.com</p>
                </div>
                <p className="mt-4">For privacy rights requests, please include your full name, the email address associated with your account, and a description of your request.</p>
              </div>

              {/* Section 18 */}
              <div>
                <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
                  18. Do Not Sell or Share My Personal Information
                </h2>
                <p>We do not sell your personal information. We do not share your personal information for cross-context behavioral advertising. If you are a California resident and wish to submit a "Do Not Sell or Share" request, you may contact us at the email address above, although no action will be required on our part as we do not engage in these practices.</p>
              </div>

              <div className="border-t border-primary/20 pt-8">
                <p className="text-gray-400 text-center">
                  Last updated: February 7, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;

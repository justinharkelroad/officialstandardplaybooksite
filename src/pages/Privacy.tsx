import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const policySections = [
  {
    title: "1. Scope",
    content: (
      <>
        <p>
          This Privacy Policy applies to the Standard Playbook website and the
          Standard Playbook mobile companion app (the “Service”), operated by
          Standard Playbook INC. The mobile app is a login-only companion for
          existing Standard Playbook coaching members.
        </p>
      </>
    ),
  },
  {
    title: "2. Information we collect",
    content: (
      <>
        <p>Depending on how you use the Service, we may process:</p>
        <ul>
          <li>
            <strong>Account information,</strong> such as your name, email
            address, account identifier, membership status, and authentication
            records.
          </li>
          <li>
            <strong>Coaching content,</strong> including Daily entries, Weekly
            plans, Monthly missions, Quarterly targets, goals, reflections,
            Flows, Debriefs, affirmations, and other information you choose to
            submit.
          </li>
          <li>
            <strong>Voice and audio information</strong> when you deliberately
            use a voice-enabled feature, including spoken input, transcripts,
            generated scripts, audio files, and related metadata.
          </li>
          <li>
            <strong>Technical information,</strong> such as device and browser
            type, operating system, IP address, app version, network status,
            timestamps, feature usage, crash information, and security or
            diagnostic events.
          </li>
          <li>
            <strong>Support communications</strong> you send to us.
          </li>
        </ul>
        <p>
          We do not use the app to request your contacts, precise location, or
          camera. Microphone access is requested only when you choose a
          voice-enabled feature.
        </p>
      </>
    ),
  },
  {
    title: "3. How we use information",
    content: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>Authenticate users and provide member access.</li>
          <li>Save and synchronize coaching work across devices.</li>
          <li>
            Provide requested coaching, artificial-intelligence, voice,
            transcription, and audio-generation features.
          </li>
          <li>
            Operate, secure, troubleshoot, support, and improve the Service.
          </li>
          <li>
            Send account, security, support, and other service-related
            communications.
          </li>
          <li>Comply with law and protect users, the Service, and others.</li>
        </ul>
        <p>
          We do not sell personal information, and the Standard Playbook app
          does not display third-party advertising.
        </p>
      </>
    ),
  },
  {
    title: "4. Service providers and AI processing",
    content: (
      <>
        <p>
          We disclose information only as needed to operate the Service, comply
          with law, or protect rights and safety. Our service providers include:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> for authentication, database, file
            storage, server functions, and synchronization.
          </li>
          <li>
            <strong>Cloudflare and our web-hosting providers</strong> for
            delivery, reliability, and security.
          </li>
          <li>
            <strong>OpenAI and Anthropic</strong> for requested AI-assisted
            coaching and content features.
          </li>
          <li>
            <strong>ElevenLabs</strong> for requested voice, transcription, and
            audio-generation features.
          </li>
          <li>
            <strong>API.Bible</strong> for requested scripture lookups.
          </li>
          <li>
            <strong>Resend</strong> for transactional email delivery.
          </li>
        </ul>
        <p>
          When you use an AI or voice feature, the content needed to fulfill
          that request may be transmitted to the applicable provider. Do not
          submit information you do not want processed for that purpose. We do
          not use automated outputs as the sole basis for decisions that create
          legal or similarly significant effects.
        </p>
      </>
    ),
  },
  {
    title: "5. Storage and security",
    content: (
      <>
        <p>
          We use administrative, technical, and organizational safeguards
          designed to protect personal information. These include encrypted
          network connections, authenticated access, and database access
          controls. No method of storage or transmission is completely secure,
          so we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: "6. Retention and deletion",
    content: (
      <>
        <p>
          We retain account and coaching information while your account is
          active and as needed to provide the Service. You may request deletion
          at any time from our{" "}
          <Link to="/data-deletion">account and data deletion page</Link>.
        </p>
        <p>
          After verification, we aim to complete account deletion within 30
          days. Residual backup copies may remain for up to 90 days, and
          security or technical logs may be retained for up to 12 months before
          deletion or anonymization. We may retain limited records longer when
          required for legal, security, fraud-prevention, dispute-resolution,
          or financial-recordkeeping purposes.
        </p>
      </>
    ),
  },
  {
    title: "7. Your choices and rights",
    content: (
      <>
        <p>
          You may contact us to request access to, correction of, or deletion
          of personal information under our control. Depending on where you
          live, applicable law may provide additional privacy rights. We may
          need to verify your identity before completing a request.
        </p>
        <p>
          You can deny or revoke microphone permission in your device settings.
          Voice-enabled features will not work without that permission, but the
          rest of the app remains available.
        </p>
      </>
    ),
  },
  {
    title: "8. Children",
    content: (
      <p>
        The Service is intended for adults and is not directed to anyone under
        18. We do not knowingly collect personal information from children. If
        you believe a child has provided information, please contact us so we
        can investigate and delete it where appropriate.
      </p>
    ),
  },
  {
    title: "9. Changes to this policy",
    content: (
      <p>
        We may update this policy as the Service changes. We will post the
        revised policy here with a new “Last updated” date and provide
        additional notice when required by law.
      </p>
    ),
  },
];

const Privacy = () => (
  <main className="min-h-screen bg-black text-gray-300">
    <div className="container mx-auto px-4 pt-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Home
      </Link>
    </div>

    <section className="px-4 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 font-rajdhani text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Standard Playbook
        </p>
        <h1 className="font-rajdhani text-5xl font-bold uppercase tracking-wide text-white sm:text-7xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-lg leading-8">
          This policy explains how Standard Playbook INC collects, uses,
          discloses, and protects information when you use Standard Playbook.
        </p>

        <div className="mt-12 space-y-10">
          {policySections.map((section) => (
            <section
              key={section.title}
              className="space-y-4 leading-7 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-6 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2"
            >
              <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wide text-white">
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}

          <section className="border-t border-white/15 pt-8">
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wide text-white">
              Contact us
            </h2>
            <p className="mt-4 leading-7">
              For privacy questions or requests, contact Standard Playbook INC
              at:
            </p>
            <a
              href="mailto:info@standardplaybook.com?subject=Standard%20Playbook%20privacy%20request"
              className="mt-5 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 font-rajdhani font-semibold uppercase tracking-wider text-black transition-colors hover:bg-transparent hover:text-white"
            >
              <Mail className="h-4 w-4" />
              info@standardplaybook.com
            </a>
            <p className="mt-8 text-sm text-gray-400">
              Last updated: July 24, 2026
            </p>
          </section>
        </div>
      </div>
    </section>
  </main>
);

export default Privacy;

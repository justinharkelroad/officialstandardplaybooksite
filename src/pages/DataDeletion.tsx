import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const DataDeletion = () => (
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
          Standard Playbook mobile app
        </p>
        <h1 className="font-rajdhani text-4xl font-bold uppercase tracking-wide text-white sm:text-6xl">
          Request account and data deletion
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Standard Playbook members may request deletion of their account and
          associated personal data at any time. There is no charge to submit a
          request.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wide text-white">
              How to submit a request
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7">
              <li>
                Email{" "}
                <a
                  className="text-primary underline underline-offset-4 hover:text-white"
                  href="mailto:info@standardplaybook.com?subject=Standard%20Playbook%20data%20deletion%20request"
                >
                  info@standardplaybook.com
                </a>{" "}
                with the subject “Standard Playbook data deletion request.”
              </li>
              <li>
                Include your full name and the email address associated with
                your Standard Playbook account. Do not send your password.
              </li>
              <li>
                We may ask you to verify account ownership before processing
                the request. We will confirm receipt and respond within 30 days.
              </li>
            </ol>

            <a
              href="mailto:info@standardplaybook.com?subject=Standard%20Playbook%20data%20deletion%20request"
              className="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 font-rajdhani font-semibold uppercase tracking-wider text-black transition-colors hover:bg-transparent hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Email deletion request
            </a>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wide text-white">
              Data deleted
            </h2>
            <p className="mt-4 leading-7">
              After verification, we will delete or de-identify the member’s
              Standard Playbook account data, including profile and login-linked
              records, Daily entries, Weekly plans, Monthly missions, Quarterly
              targets, Flows, Debriefs, goals, reflections, and associated
              AI-generated content under our control.
            </p>
          </section>

          <section>
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wide text-white">
              Data that may be retained
            </h2>
            <p className="mt-4 leading-7">
              Limited information may be retained when required for legal,
              fraud-prevention, security, dispute-resolution, or financial
              recordkeeping purposes. Account data may remain for up to 30 days
              while a verified request is completed, residual backup copies may
              remain for up to 90 days, and security or technical logs may be
              retained for up to 12 months before deletion or anonymization.
              Records that law requires us to keep, such as applicable billing
              and tax records, may be retained for the legally required period.
            </p>
          </section>

          <section className="border-t border-white/15 pt-8 text-sm leading-6 text-gray-400">
            <p>
              This page applies to the Standard Playbook mobile app offered by
              Standard Playbook INC. For more information, review our{" "}
              <Link className="text-primary underline underline-offset-4" to="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-4">Last updated: July 16, 2026</p>
          </section>
        </div>
      </div>
    </section>
  </main>
);

export default DataDeletion;

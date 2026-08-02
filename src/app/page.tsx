import Link from "next/link";
import { GUMROAD_URL, PRO_PRICE_LABEL } from "@/lib/types";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold tracking-tight text-indigo-700">
            QuoteSnap
          </span>
          <nav className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
            >
              Pricing
            </a>
            <Link
              href="/app"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Create quote free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:pt-24">
          <p className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-800">
            Free forever · No signup · PDF in one click
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
            Send quotes that look like you already won the job
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            QuoteSnap is a browser quote & proposal generator for freelancers
            and small service businesses. Scope, line items, deposit, valid-until
            date — then Print → Save as PDF. Not accounting software. Just a
            clean way to get yes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Start free — no signup
            </Link>
            <a
              href="#pricing"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50"
            >
              See Pro {PRO_PRICE_LABEL}
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Your quotes stay on your device. We never see your clients.
          </p>
        </section>

        <section className="border-y border-slate-200 bg-white py-14">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            {[
              {
                title: "Close, don’t format",
                body: "Stop wrestling Word and Docs. Build a client-ready quote in about a minute.",
              },
              {
                title: "Scope + deposit built in",
                body: "Valid-until date, scope notes, payment terms, and deposit % so expectations are clear.",
              },
              {
                title: "Pro when you brand it",
                body: "Logo, no watermark, templates — optional. Free tier works for real client work.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-100 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Built for people who sell work, not run accounting depts
          </h2>
          <ul className="mx-auto mt-8 max-w-2xl space-y-3 text-slate-600">
            {[
              "Freelancers sending a price before the project starts",
              "Consultants who need a one-page proposal tonight",
              "Trades and repair shops quoting jobs without QuickBooks",
              "Agencies that want a lightweight fallback between big tools",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-indigo-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-500">
            Not a replacement for QuickBooks or Xero. A fast PDF quote when you
            just need the client to say yes.
          </p>
        </section>

        <section id="pricing" className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Simple pricing
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
              Start free. Upgrade once if you want branding. No subscription
              required.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Free
                </p>
                <p className="mt-2 text-3xl font-bold">$0</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>✓ Unlimited quotes</li>
                  <li>✓ Scope, tax, discount, deposit</li>
                  <li>✓ Multi-currency</li>
                  <li>✓ PDF / print export</li>
                  <li className="text-slate-400">Small QuoteSnap watermark</li>
                </ul>
                <Link
                  href="/app"
                  className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Use free
                </Link>
              </div>
              <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-800">
                  Pro · lifetime
                </p>
                <p className="mt-2 text-3xl font-bold">{PRO_PRICE_LABEL}</p>
                <p className="text-sm text-slate-500">One payment. Yours forever.</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>✓ Everything in Free</li>
                  <li>✓ Your logo on every quote</li>
                  <li>✓ No watermark</li>
                  <li>✓ Bold & minimal templates</li>
                  <li>✓ Custom brand color</li>
                  <li>✓ Save clients & history</li>
                </ul>
                <a
                  href={GUMROAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Buy Pro {PRO_PRICE_LABEL}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Your next client is waiting on a number
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Send a clear quote tonight. Get the yes. Invoice later.
          </p>
          <Link
            href="/app"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800"
          >
            Create your first quote
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} QuoteSnap. Built to help freelancers close
          deals.
        </p>
      </footer>
    </div>
  );
}

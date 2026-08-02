"use client";

import type { Quote } from "@/lib/types";
import { calcTotals, formatMoney } from "@/lib/types";

type Props = {
  quote: Quote;
  isPro: boolean;
};

export function QuotePreview({ quote, isPro }: Props) {
  const { subtotal, discount, tax, total, deposit } = calcTotals(quote);
  const accent = isPro ? quote.accentColor : "#4f46e5";
  const template = isPro ? quote.template : "classic";

  const shell =
    template === "bold"
      ? "border-0 shadow-lg"
      : template === "minimal"
        ? "border border-slate-200 shadow-none"
        : "border border-slate-300 shadow-sm";

  return (
    <div
      id="quote-preview"
      className={`relative overflow-hidden rounded-xl bg-white text-slate-900 ${shell}`}
    >
      {template === "bold" && (
        <div className="h-2.5 w-full" style={{ backgroundColor: accent }} />
      )}

      <div className="p-8 sm:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            {isPro && quote.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={quote.logoDataUrl}
                alt="Logo"
                className="mb-3 h-14 max-w-[180px] object-contain"
              />
            ) : null}
            <p
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Quote / Proposal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {quote.title || "Project proposal"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">#{quote.number}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900">
              {quote.from.name || "Your business"}
            </p>
            {quote.from.email && (
              <p className="text-slate-600">{quote.from.email}</p>
            )}
            {quote.from.phone && (
              <p className="text-slate-600">{quote.from.phone}</p>
            )}
            {quote.from.address && (
              <p className="mt-1 whitespace-pre-line text-slate-600">
                {quote.from.address}
              </p>
            )}
          </div>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p
              className="mb-1 text-xs font-semibold uppercase tracking-wider"
              style={{ color: accent }}
            >
              Prepared for
            </p>
            <p className="font-semibold">{quote.to.name || "Client name"}</p>
            {quote.to.email && (
              <p className="text-sm text-slate-600">{quote.to.email}</p>
            )}
            {quote.to.address && (
              <p className="whitespace-pre-line text-sm text-slate-600">
                {quote.to.address}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <div className="inline-block text-left text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{quote.date}</span>
              </div>
              <div className="mt-1 flex justify-between gap-8">
                <span className="text-slate-500">Valid until</span>
                <span className="font-medium">{quote.validUntil}</span>
              </div>
            </div>
          </div>
        </div>

        {quote.scope && (
          <div className="mb-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p
              className="mb-1 text-xs font-semibold uppercase tracking-wide"
              style={{ color: accent }}
            >
              Scope
            </p>
            <p className="whitespace-pre-line">{quote.scope}</p>
          </div>
        )}

        <table className="mb-6 w-full text-left text-sm">
          <thead>
            <tr
              className="border-b-2 text-xs uppercase tracking-wide"
              style={{ borderColor: accent, color: accent }}
            >
              <th className="pb-2 font-semibold">Description</th>
              <th className="pb-2 text-right font-semibold">Qty</th>
              <th className="pb-2 text-right font-semibold">Rate</th>
              <th className="pb-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-3 pr-2">{item.description || "—"}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">
                  {formatMoney(item.rate, quote.currency)}
                </td>
                <td className="py-3 text-right font-medium">
                  {formatMoney(item.quantity * item.rate, quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-8 flex justify-end">
          <div className="w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatMoney(subtotal, quote.currency)}</span>
            </div>
            {quote.discountPercent > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Discount ({quote.discountPercent}%)
                </span>
                <span>-{formatMoney(discount, quote.currency)}</span>
              </div>
            )}
            {quote.taxPercent > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Tax ({quote.taxPercent}%)</span>
                <span>{formatMoney(tax, quote.currency)}</span>
              </div>
            )}
            <div
              className="mt-2 flex justify-between border-t-2 pt-2 text-base font-bold"
              style={{ borderColor: accent }}
            >
              <span>Total</span>
              <span style={{ color: accent }}>
                {formatMoney(total, quote.currency)}
              </span>
            </div>
            {quote.depositPercent > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Deposit due ({quote.depositPercent}%)</span>
                <span className="font-semibold">
                  {formatMoney(deposit, quote.currency)}
                </span>
              </div>
            )}
          </div>
        </div>

        {(quote.paymentTerms || quote.notes) && (
          <div className="space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
            {quote.paymentTerms && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payment terms
                </p>
                <p className="mt-1 whitespace-pre-line">{quote.paymentTerms}</p>
              </div>
            )}
            {quote.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Next steps
                </p>
                <p className="mt-1 whitespace-pre-line">{quote.notes}</p>
              </div>
            )}
          </div>
        )}

        {!isPro && (
          <div className="pointer-events-none absolute bottom-6 right-6 rotate-[-12deg] select-none text-2xl font-bold tracking-widest text-slate-300/80">
            QuoteSnap
          </div>
        )}
      </div>
    </div>
  );
}

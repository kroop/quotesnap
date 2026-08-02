"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CURRENCIES,
  PRO_PRICE_LABEL,
  calcTotals,
  createEmptyQuote,
  formatMoney,
  type LineItem,
  type Quote,
} from "@/lib/types";
import {
  getClients,
  getHistory,
  loadBusinessProfile,
  loadDraft,
  pushHistory,
  saveBusinessProfile,
  saveClient,
  saveDraft,
} from "@/lib/storage";
import {
  deactivateLicense,
  getStoredLicense,
  isPro as checkPro,
} from "@/lib/license";
import { QuotePreview } from "./QuotePreview";
import { ProGate } from "./ProGate";

export function QuoteApp() {
  const [quote, setQuote] = useState<Quote>(() => createEmptyQuote());
  const [pro, setPro] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateFeature, setGateFeature] = useState("Pro features");
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [printNudge, setPrintNudge] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    const business = loadBusinessProfile();
    if (draft) {
      setQuote(draft);
    } else if (business) {
      setQuote((prev) => ({ ...prev, from: business }));
    }
    setPro(checkPro());
    setHistoryCount(getHistory().length);
    setClientCount(getClients().length);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(quote);
  }, [quote, hydrated]);

  const totals = calcTotals(quote);

  const requirePro = useCallback((feature: string, action?: () => void) => {
    if (checkPro()) {
      action?.();
      return true;
    }
    setGateFeature(feature);
    setGateOpen(true);
    return false;
  }, []);

  function update<K extends keyof Quote>(key: K, value: Quote[K]) {
    setQuote((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addItem() {
    setQuote((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    }));
  }

  function removeItem(id: string) {
    setQuote((prev) => ({
      ...prev,
      items:
        prev.items.length <= 1
          ? prev.items
          : prev.items.filter((item) => item.id !== id),
    }));
  }

  function handleLogo(file: File | null) {
    if (!file) return;
    if (!requirePro("logo upload")) return;
    const reader = new FileReader();
    reader.onload = () => {
      update("logoDataUrl", String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  function handlePrint() {
    window.print();
    if (!checkPro()) {
      setTimeout(() => setPrintNudge(true), 500);
    }
  }

  function handleSaveClient() {
    if (!quote.to.name.trim()) return;
    if (!requirePro("client library")) return;
    saveClient({
      id: crypto.randomUUID(),
      name: quote.to.name,
      email: quote.to.email,
      address: quote.to.address,
    });
    setClientCount(getClients().length);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleSaveHistory() {
    if (!requirePro("quote history")) return;
    pushHistory(quote);
    saveBusinessProfile(quote.from);
    setHistoryCount(getHistory().length);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function loadClientByIndex(index: number) {
    const clients = getClients();
    const c = clients[index];
    if (!c) return;
    setQuote((prev) => ({
      ...prev,
      to: { name: c.name, email: c.email, address: c.address },
    }));
  }

  function newQuote() {
    const business = loadBusinessProfile() || quote.from;
    const next = createEmptyQuote();
    next.from = business;
    if (pro) {
      next.template = quote.template;
      next.accentColor = quote.accentColor;
      next.logoDataUrl = quote.logoDataUrl;
    }
    setQuote(next);
  }

  const field =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600";
  const label = "mb-1 block text-xs font-medium text-slate-500";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="print:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-indigo-700"
            >
              QuoteSnap
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                pro
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {pro ? "PRO" : "FREE"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={newQuote}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              New
            </button>
            <button
              type="button"
              onClick={handleSaveHistory}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Save{pro ? ` (${historyCount})` : ""}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Download PDF / Print
            </button>
            {!pro ? (
              <button
                type="button"
                onClick={() => {
                  setGateFeature("QuoteSnap Pro");
                  setGateOpen(true);
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Upgrade {PRO_PRICE_LABEL}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Deactivate Pro on this browser?")) {
                    deactivateLicense();
                    setPro(false);
                    setQuote((prev) => ({
                      ...prev,
                      logoDataUrl: undefined,
                      template: "classic",
                      accentColor: "#4f46e5",
                    }));
                  }
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
                title={getStoredLicense() || ""}
              >
                Manage license
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-2">
        <section className="print:hidden space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Quote details
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label}>Title</label>
                <input
                  className={field}
                  value={quote.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Website redesign proposal"
                />
              </div>
              <div>
                <label className={label}>Quote number</label>
                <input
                  className={field}
                  value={quote.number}
                  onChange={(e) => update("number", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Currency</label>
                <select
                  className={field}
                  value={quote.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Date</label>
                <input
                  type="date"
                  className={field}
                  value={quote.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Valid until</label>
                <input
                  type="date"
                  className={field}
                  value={quote.validUntil}
                  onChange={(e) => update("validUntil", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              From (your business)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label}>Business name</label>
                <input
                  className={field}
                  value={quote.from.name}
                  onChange={(e) =>
                    update("from", { ...quote.from, name: e.target.value })
                  }
                  placeholder="Acme Studio LLC"
                />
              </div>
              <div>
                <label className={label}>Email</label>
                <input
                  className={field}
                  value={quote.from.email}
                  onChange={(e) =>
                    update("from", { ...quote.from, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Phone</label>
                <input
                  className={field}
                  value={quote.from.phone}
                  onChange={(e) =>
                    update("from", { ...quote.from, phone: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Address</label>
                <textarea
                  className={field}
                  rows={2}
                  value={quote.from.address}
                  onChange={(e) =>
                    update("from", { ...quote.from, address: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Logo {pro ? "" : "(Pro)"}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600"
                  onChange={(e) => handleLogo(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Client
              </h2>
              <div className="flex gap-2">
                {pro && clientCount > 0 && (
                  <select
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value !== "")
                        loadClientByIndex(Number(e.target.value));
                    }}
                  >
                    <option value="">Load saved client…</option>
                    {getClients().map((c, i) => (
                      <option key={c.id} value={i}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={handleSaveClient}
                  className="text-xs font-medium text-indigo-700 hover:underline"
                >
                  Save client{pro ? "" : " (Pro)"}
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label}>Client name</label>
                <input
                  className={field}
                  value={quote.to.name}
                  onChange={(e) =>
                    update("to", { ...quote.to, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={label}>Email</label>
                <input
                  className={field}
                  value={quote.to.email}
                  onChange={(e) =>
                    update("to", { ...quote.to, email: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Address</label>
                <textarea
                  className={field}
                  rows={2}
                  value={quote.to.address}
                  onChange={(e) =>
                    update("to", { ...quote.to, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Line items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="text-sm font-medium text-indigo-700 hover:underline"
              >
                + Add line
              </button>
            </div>
            <div className="space-y-3">
              {quote.items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-12"
                >
                  <div className="sm:col-span-6">
                    <label className={label}>Description</label>
                    <input
                      className={field}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Qty</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      className={field}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={label}>Rate</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      className={field}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, {
                          rate: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-end sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mb-0.5 rounded-lg px-2 py-2 text-slate-400 hover:bg-white hover:text-red-600"
                      aria-label="Remove line"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label}>Tax %</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={field}
                  value={quote.taxPercent}
                  onChange={(e) =>
                    update("taxPercent", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label className={label}>Discount %</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={field}
                  value={quote.discountPercent}
                  onChange={(e) =>
                    update("discountPercent", Number(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label className={label}>Deposit %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  className={field}
                  value={quote.depositPercent}
                  onChange={(e) =>
                    update("depositPercent", Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <p className="mt-4 text-right text-lg font-bold text-indigo-700">
              Total {formatMoney(totals.total, quote.currency)}
              {quote.depositPercent > 0 && (
                <span className="mt-1 block text-sm font-medium text-slate-500">
                  Deposit {formatMoney(totals.deposit, quote.currency)}
                </span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Scope, terms & branding
            </h2>
            <div className="grid gap-3">
              <div>
                <label className={label}>Scope</label>
                <textarea
                  className={field}
                  rows={3}
                  value={quote.scope}
                  onChange={(e) => update("scope", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Payment terms</label>
                <textarea
                  className={field}
                  rows={2}
                  value={quote.paymentTerms}
                  onChange={(e) => update("paymentTerms", e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Next steps / notes</label>
                <textarea
                  className={field}
                  rows={2}
                  value={quote.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>
                    Template {pro ? "" : "(Pro unlocks more)"}
                  </label>
                  <select
                    className={field}
                    value={quote.template}
                    onChange={(e) => {
                      const value = e.target.value as Quote["template"];
                      if (value !== "classic" && !requirePro("templates")) {
                        return;
                      }
                      update("template", value);
                    }}
                  >
                    <option value="classic">Classic</option>
                    <option value="bold">Bold (Pro)</option>
                    <option value="minimal">Minimal (Pro)</option>
                  </select>
                </div>
                <div>
                  <label className={label}>
                    Accent color {pro ? "" : "(Pro)"}
                  </label>
                  <input
                    type="color"
                    className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
                    value={quote.accentColor}
                    onChange={(e) => {
                      if (!requirePro("custom brand color")) return;
                      update("accentColor", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {saved && (
            <p className="text-center text-sm font-medium text-indigo-700">
              Saved locally on this device.
            </p>
          )}
        </section>

        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="print:hidden mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Live preview
            </h2>
            <p className="text-xs text-slate-400">Print → Save as PDF</p>
          </div>
          <QuotePreview quote={quote} isPro={pro} />
        </section>
      </main>

      {printNudge && !pro && (
        <div className="print:hidden fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-indigo-200 bg-white p-4 shadow-xl sm:left-auto">
          <p className="text-sm font-semibold text-slate-900">
            Quote looks good — close the deal looking branded
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Pro removes the watermark and adds your logo. {PRO_PRICE_LABEL}{" "}
            lifetime.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setPrintNudge(false);
                setGateOpen(true);
              }}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
            >
              See Pro
            </button>
            <button
              type="button"
              onClick={() => setPrintNudge(false)}
              className="rounded-lg px-3 py-2 text-xs text-slate-500"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      <ProGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onActivated={() => setPro(true)}
        feature={gateFeature}
      />

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #quote-preview,
          #quote-preview * {
            visibility: visible;
          }
          #quote-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

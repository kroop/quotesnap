"use client";

import { useState } from "react";
import { verifyAndActivateLicense } from "@/lib/license";
import { GUMROAD_URL, PRO_PRICE_LABEL } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onActivated: () => void;
  feature?: string;
};

export function ProGate({ open, onClose, onActivated, feature }: Props) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleActivate() {
    setError("");
    setOk(false);
    setLoading(true);
    try {
      const result = await verifyAndActivateLicense(key);
      if (result.success) {
        setOk(true);
        onActivated();
        setTimeout(onClose, 800);
      } else {
        setError(
          result.message ||
            "Invalid license. Buy Pro or use QUOTESNAP-PRO-DEMO-0001 to preview.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:hidden">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              QuoteSnap Pro
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Unlock {feature || "Pro features"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ul className="mb-5 space-y-2 text-sm text-slate-600">
          <li>✓ Your logo on every quote</li>
          <li>✓ Remove QuoteSnap watermark</li>
          <li>✓ Bold & minimal templates</li>
          <li>✓ Custom brand color</li>
          <li>✓ Save clients & quote history</li>
          <li>✓ Lifetime license — one payment</li>
        </ul>

        <a
          href={GUMROAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Buy Pro — {PRO_PRICE_LABEL} lifetime
        </a>

        <div className="border-t border-slate-100 pt-4">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Already purchased? Paste your Gumroad license key
          </label>
          <div className="flex gap-2">
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Paste key from Gumroad"
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-600 disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleActivate();
              }}
            />
            <button
              type="button"
              onClick={() => void handleActivate()}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "…" : "Activate"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {ok && (
            <p className="mt-2 text-xs text-indigo-700">
              Pro activated. Go close that deal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

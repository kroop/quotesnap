const LICENSE_KEY = "quotesnap_pro_license";
const LICENSE_STATUS_KEY = "quotesnap_pro_active";

export function isOfflineDemoKey(key: string): boolean {
  const k = key.trim().toUpperCase();
  if (k === "QUOTESNAP-PRO-DEMO-0001") return true;
  if (/^QUOTESNAP-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(k)) return true;
  if (k.startsWith("QS-PRO-") && k.length >= 12) return true;
  return false;
}

export function storeActivatedLicense(key: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LICENSE_KEY, key.trim());
  localStorage.setItem(LICENSE_STATUS_KEY, "1");
}

export function deactivateLicense() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(LICENSE_STATUS_KEY);
}

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LICENSE_STATUS_KEY) === "1";
}

export function getStoredLicense(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LICENSE_KEY);
}

export type VerifyResult = {
  success: boolean;
  message?: string;
  source?: string;
};

export async function verifyAndActivateLicense(
  key: string,
): Promise<VerifyResult> {
  const trimmed = key.trim();
  if (!trimmed) {
    return { success: false, message: "Enter a license key." };
  }

  if (isOfflineDemoKey(trimmed)) {
    storeActivatedLicense(trimmed);
    return { success: true, source: "local" };
  }

  try {
    const res = await fetch("/api/verify-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license_key: trimmed }),
    });
    const data = (await res.json()) as VerifyResult;
    if (data.success) {
      storeActivatedLicense(trimmed);
      return { success: true, source: data.source || "gumroad" };
    }
    return {
      success: false,
      message:
        data.message ||
        "License not recognized. Check the key from your Gumroad receipt.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach license server. Try again in a moment.",
    };
  }
}

import { NextResponse } from "next/server";

/**
 * Gumroad license verification.
 * Set GUMROAD_PRODUCT_ID on Vercel after creating the product.
 */
function isDemoKey(licenseKey: string): boolean {
  const upper = licenseKey.toUpperCase();
  return (
    upper === "QUOTESNAP-PRO-DEMO-0001" ||
    /^QUOTESNAP-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(upper) ||
    (upper.startsWith("QS-PRO-") && upper.length >= 12)
  );
}

async function verifyWithGumroad(licenseKey: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const productId = process.env.GUMROAD_PRODUCT_ID?.trim();
  const permalink = process.env.GUMROAD_PRODUCT_PERMALINK?.trim();

  if (!productId && !permalink) {
    return {
      success: false,
      message:
        "Gumroad not configured yet. Use QUOTESNAP-PRO-DEMO-0001 to preview, or set GUMROAD_PRODUCT_ID.",
    };
  }

  const form = new URLSearchParams();
  if (productId) form.set("product_id", productId);
  else if (permalink) form.set("product_permalink", permalink);
  form.set("license_key", licenseKey);
  form.set("increment_uses_count", "false");

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const data = (await res.json()) as {
    success?: boolean;
    message?: string;
    purchase?: { refunded?: boolean; chargebacked?: boolean };
  };

  if (
    data.success &&
    !data.purchase?.refunded &&
    !data.purchase?.chargebacked
  ) {
    return { success: true };
  }

  return { success: false, message: data.message || "License invalid" };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { license_key?: string };
    const licenseKey = body.license_key?.trim();
    if (!licenseKey) {
      return NextResponse.json(
        { success: false, message: "Missing license_key" },
        { status: 400 },
      );
    }

    if (isDemoKey(licenseKey)) {
      return NextResponse.json({ success: true, source: "local" });
    }

    const result = await verifyWithGumroad(licenseKey);
    if (result.success) {
      return NextResponse.json({ success: true, source: "gumroad" });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          result.message ||
          "License invalid. Use the key from your Gumroad library/receipt.",
      },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}

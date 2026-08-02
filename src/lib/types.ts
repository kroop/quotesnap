export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Quote = {
  id: string;
  number: string;
  title: string;
  date: string;
  validUntil: string;
  currency: string;
  from: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  to: {
    name: string;
    email: string;
    address: string;
  };
  items: LineItem[];
  taxPercent: number;
  discountPercent: number;
  depositPercent: number;
  scope: string;
  notes: string;
  paymentTerms: string;
  logoDataUrl?: string;
  accentColor: string;
  template: "classic" | "bold" | "minimal";
};

export type SavedClient = {
  id: string;
  name: string;
  email: string;
  address: string;
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
] as const;

export const PRO_PRICE_USD = 39;
export const PRO_PRICE_LABEL = "$39";
/** Live Gumroad product — override with NEXT_PUBLIC_GUMROAD_URL if needed */
export const GUMROAD_URL =
  process.env.NEXT_PUBLIC_GUMROAD_URL ||
  "https://kroop23.gumroad.com/l/zmttr";

export function createEmptyQuote(): Quote {
  const today = new Date();
  const valid = new Date(today);
  valid.setDate(valid.getDate() + 14);

  return {
    id: crypto.randomUUID(),
    number: `Q-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}-001`,
    title: "Project proposal",
    date: today.toISOString().slice(0, 10),
    validUntil: valid.toISOString().slice(0, 10),
    currency: "USD",
    from: { name: "", email: "", address: "", phone: "" },
    to: { name: "", email: "", address: "" },
    items: [
      {
        id: crypto.randomUUID(),
        description: "Discovery & planning",
        quantity: 1,
        rate: 0,
      },
      {
        id: crypto.randomUUID(),
        description: "Delivery & implementation",
        quantity: 1,
        rate: 0,
      },
    ],
    taxPercent: 0,
    discountPercent: 0,
    depositPercent: 50,
    scope:
      "This quote covers the scope listed in the line items. Work outside this scope may be billed separately at the agreed rate.",
    notes: "Reply to accept this quote, or request changes.",
    paymentTerms:
      "50% deposit to start. Balance due on delivery. Payment via bank transfer, card, or the method listed on the final invoice.",
    accentColor: "#4f46e5",
    template: "classic",
  };
}

export function calcTotals(quote: Quote) {
  const subtotal = quote.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const discount = subtotal * (quote.discountPercent / 100);
  const taxable = subtotal - discount;
  const tax = taxable * (quote.taxPercent / 100);
  const total = taxable + tax;
  const deposit = total * (quote.depositPercent / 100);
  return { subtotal, discount, tax, total, deposit };
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

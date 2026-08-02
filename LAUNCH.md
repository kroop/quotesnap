# QuoteSnap launch — first dollars

## Local

```bash
cd quotesnap
npm run dev
```

- Landing: http://localhost:3000  
- App: http://localhost:3000/app  
- Demo Pro: `QUOTESNAP-PRO-DEMO-0001`

## Day 1 — Sell

1. Gumroad → New digital product  
2. Name: **QuoteSnap Pro — Lifetime License**  
3. Price: **$39**  
4. Insert **License key** content block  
5. Content:

```text
Thanks for buying QuoteSnap Pro!

1. Open: https://YOUR-VERCEL-URL.vercel.app/app
2. Upgrade → paste license key → Activate

Logo, no watermark, templates, client save. Lifetime license.
```

6. Set env after deploy:

```env
NEXT_PUBLIC_GUMROAD_URL=https://yours.gumroad.com/l/xxxxx
GUMROAD_PRODUCT_ID=   # from verify error or Gumroad if needed
```

## Day 1 — Deploy

GitHub → Vercel import → free `*.vercel.app`

## Day 2+ — Traffic ($0)

- LinkedIn + X: free tool first  
- DM 10 freelancers  
- Owner/small-business threads (repair, design, consulting)  
- **Avoid** accounting-department subs  
- Show HN optional  

## Copy

```text
Free quote/proposal PDF in the browser — no signup.
Scope, deposit, valid-until. Print → Save as PDF.
https://YOUR-URL/app

Pro $39 lifetime if you want logo + no watermark.
```

## Don’t

- Spend the $100 on ads first  
- Pay $198 for Indie Hackers  
- Build QuickBooks sync before sales  

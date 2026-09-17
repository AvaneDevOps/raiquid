# Raiquid

**Turn waiting invoices into working capital.**

Live demo: https://raiquid.avane.online

## The problem

A Nigerian SME delivers goods or services, sends an invoice, and then
waits. Thirty days. Sixty. Sometimes ninety. The work is done, the
debt is real, but the cash isn't. That gap is what stalls small
businesses more than almost anything else.

Raiquid closes it. A business submits a confirmed invoice, and
investors fund it immediately, for a real return, backed by a
real, on-chain settlement.

## How it works

1. **A business submits an invoice.** Real signup, real form.
2. **The buyer confirms it, no account required.** A single-use
   magic link, sent by real email. The buyer isn't a Raiquid user,
   so they shouldn't have to become one just to confirm a debt.
3. **The invoice is tokenized on-chain**, through Brickken's sandbox
   on Ethereum Sepolia, real API calls, not simulated.
4. **Whitelisted investors fund it**, at a discount to face value.
   The discount rate is tiered by the buyer's provenance, their
   real, public payment history on the platform: better-behaved
   buyers unlock cheaper capital for the businesses that invoice
   them.
5. **The buyer repays the full face value.** The gap between what
   investors funded and what gets repaid is real yield, not a flat
   number pulled from nowhere.

## Provenance: the trust layer

Every buyer builds a public track record, acceptance rate, on-time
payment rate, invoices financed. That record is what lets an
investor size up risk before funding, and it's what determines the
discount rate on the next invoice. Good payment behavior compounds
into cheaper capital.

## Real Brickken integration, independently verifiable

Every on-chain action, tokenization, whitelisting, offering launch,
investment, runs through Brickken's Dapp API against the Ethereum
Sepolia testnet. This isn't mocked, and you don't have to take our
word for it:

- Open the **admin ledger** in the live demo. Every real on-chain
  event is logged there, each with a working link straight to
  Sepolia Etherscan. Click through, the transaction is sitting on a
  chain Raiquid doesn't control.
- Tokenization is the cleanest, most reproducible proof point,
  confirmed on-chain every time an invoice moves through the flow.
- Brickken's sandbox has a documented indexing lag between a
  transaction mining and their backend recognizing it in a
  follow-up call. Rather than treat that as a hard failure, Raiquid
  detects the specific error shape and retries automatically with
  escalating backoff, real engineering around a real vendor
  characteristic, not a workaround hidden from view.

## Four real roles, one real loop

- **Business** — submits invoices, tracks funding status, gets paid
- **Buyer** — confirms debts via magic link, no account needed
- **Investor** — browses the marketplace, completes real KYC,
  funds invoices, earns real yield
- **Admin** — reviews KYC, watches the on-chain ledger, monitors the
  reserve pool

## Stack

- **Frontend:** Next.js, TypeScript, Tailwind — deployed on Vercel
- **Backend:** NestJS, Prisma, PostgreSQL — deployed on Railway
- **Auth:** Clerk
- **Blockchain:** Brickken Dapp API, Ethereum Sepolia
- **Email:** Resend
- **Storage:** Cloudflare R2

## Running it locally

Backend (raiquid-api): copy `.env.example` to `.env`, fill in your
own Clerk, Brickken, R2, and Resend credentials, `npm install`,
`npx prisma migrate deploy`, `npm run start:dev`.

Frontend (this repo): copy `.env.example` to `.env.local`, point
`NEXT_PUBLIC_API_BASE_URL` at your backend, fill in your Clerk
publishable key, `npm install`, `npm run dev`.

Full architecture and open decisions are documented in
`docs/RAIQUID_CONTEXT.md`.

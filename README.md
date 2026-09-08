# Run2Win — UI Build

This is a **presentation-only** copy of 3 screens (Home, Buy Tickets, Wallet) for
client walkthroughs before the project is paid for. It is intentionally incomplete:

- No database, no `.env`, no server — every number on screen is hardcoded in the
  page files under `app/`.
- No authentication/login — the header is static.
- No payment gateway — "Buy" shows a notice instead of opening Razorpay.
- No withdrawal processing — "Request Withdrawal" shows a notice instead of
  submitting anywhere.
- None of the real project's `lib/` business logic (spin scheduling, draw
  selection, prize-tier rules, wallet ledger, Razorpay integration) is present in
  this folder at all — there's nothing here to reverse-engineer.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/home`. `/purchase` and
`/wallet` are reachable from the header nav.

## Do not

- Don't point this at production data or a real payment key.
- Don't hand out the main `run_2_win` repository alongside this — only this
  folder is meant to be shared pre-payment.

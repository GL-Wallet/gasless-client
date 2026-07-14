# Client-app integration guide — transfer behavior

**Golden rule:** a non-2xx response does **not** mean the on-chain transfer failed.
Never auto-resend on error/timeout without checking first. The server can take up
to ~125s (energy delegation up to 75s + confirmations).

## `POST /transfer` response contract

| HTTP | Meaning | Client action |
|------|---------|---------------|
| **200** | Accepted. Body `{ message, transactionId, feeTxHash, usdtTxHash, txid }`. May be `CONFIRMED` or `PENDING` (broadcast-accepted, not yet mined). Also returned on a duplicate replay (same body). | **Success.** Verify settlement via `usdtTxHash` on-chain; don't assume instant finality. |
| **409 Conflict** | Duplicate of an in-progress or already-submitted transfer. Two messages: `"…already being processed"` (in-flight) / `"…already submitted on-chain"` (needs reconcile). | **NOT a failure.** Do **not** resend / re-sign. Poll on-chain by the transfer hash / show "processing". |
| **400** | Genuine client-side problem (bad fee, undecodable tx, validation). | Safe to fix input and retry. |
| **500** | Energy failure, on-chain revert, or unexpected. Outcome **UNKNOWN** — tx may have landed. | Do **not** auto-resend. Show "processing/unknown"; verify on-chain before any retry. |

## Rules

1. **Never auto-retry by prompting a fresh send on error/timeout.** If you must retry,
   resubmit the *same* transfer (re-signing is safe — the server dedups on transfer
   *intent*, not txID, so a re-sign hits the same key → 200 replay or 409). Prefer:
   on timeout/5xx, **poll the chain by `usdtTxHash`, don't re-send.**
2. **Handle 409 as "in progress / already done", not an error.** Poll/backoff; surface
   "transfer processing". Do not show a failure that tempts a re-tap.
3. **HTTP client timeout ≥ 130s.** If your timeout fires earlier, treat it as UNKNOWN
   (not failure) — verify on-chain before resend.
4. **Deliberate identical repeat is currently blocked for ~5 min.** Two sends of the
   same from→to→amount within 300s → the 2nd is replayed (returns the 1st's hashes, no
   2nd transfer). If a user genuinely needs to send the same amount to the same address
   twice quickly, warn them / have them wait. Proper fix (server `Idempotency-Key`
   header) is planned — until then, this is a known limitation.
5. **`PENDING` is a 200.** A slow-confirming tx returns success with its hash. Track it
   by `usdtTxHash`; don't re-broadcast because it "looks unconfirmed."

## Why this changed

Client double-tap / auto-retry was re-signing and resubmitting → two on-chain USDT
transfers, sender debited twice. The server now dedups on the transfer intent and won't
broadcast the same transfer twice **via the relay**. The client's job: stop treating
slow/timeout/non-2xx as "failed → send again."

> ⚠️ **Caveat that shapes the client code:** the "retry with standard fee" fallback
> broadcasts **directly on-chain** (`sendUsdt`), which does **not** pass through the
> relay's intent-dedup. Therefore the client must only offer that retry when it has
> positive proof nothing was broadcast (an HTTP **400**). A **409/500/timeout** must
> never trigger the direct-send fallback.

## Client-side mapping (this app)

`useUsdtTransfer.transferUsdt` returns a discriminated `TransferOutcome`:

| Outcome | Trigger | UI |
|---------|---------|-----|
| `success` | 200 (incl. `PENDING` and 200 replay) | navigate to result with `txid` |
| `rejected` | pre-broadcast throw, or HTTP **4xx except 409** | offer standard-fee retry (safe — not broadcast) |
| `indeterminate` | **409**, **5xx**, gateway 502/504, timeout / no response, or a post-broadcast TronWeb `Error` | **no retry** — warn toast, user verifies on-chain |

A **module-scoped in-flight lock keyed by transfer intent** (`token:recipient:amount`)
blocks a duplicate dispatch of the same transfer while one is in flight. It is module-
scoped (not a component ref) so it survives the unmount/remount that the passcode-auth
and in-progress-screen navigations force — a back-nav re-tap of Send cannot double-send.
It does **not** cover a full page reload or a genuine sequential resend outside the
in-flight window; those rely on server-side intent-dedup (300s) and, ultimately, an
`Idempotency-Key`.

## Still needed from client (to fully close it)

- [x] Respect 409 (no resend) — mapped to `indeterminate`.
- [x] Guard concurrent double-dispatch across remount — module-scoped intent lock.
- [ ] Longer timeout + verify-before-retry. Current axios instance sets **no** timeout
      (effectively unbounded ≥ 130s, so it won't fire early) — compliant, but any
      explicit timeout added later must be **≥ 130s**.
- [ ] **Surface `usdtTxHash` / `PENDING` vs `CONFIRMED`.** `TransferResponse`
      (`src/kernel/api/model/types.ts`) currently models only `{ txid }`; the 200 body's
      `usdtTxHash`, `feeTxHash`, `transactionId`, and confirmation status are dropped at
      the API layer. Consequence: the app cannot "verify settlement via `usdtTxHash`" and
      shows a `PENDING` (not-yet-mined) tx as fully done. Model the full body and show a
      pending state. *(Additive — not a double-debit; no auto-rebroadcast happens.)*
- [ ] **Distinguish a duplicate replay from a fresh success.** A 200 replay and a real
      200 are identical to the client, so a legitimate second identical transfer within
      300s is silently collapsed into the first and reported as success — the user
      believes a payment landed that never happened. Needs the server to echo a replay
      flag / `Idempotency-Key`, or a client "you just sent an identical transfer" confirm.
- [ ] **(The clean fix)** send a per-send-action `Idempotency-Key` header once the
      server exposes it — removes the 5-min repeat limitation, lets the retry go through
      the relay safely, and closes the direct-send-bypasses-dedup gap structurally
      (the module lock only mitigates the concurrent case; a sequential direct resend
      outside the in-flight window is still un-deduped).

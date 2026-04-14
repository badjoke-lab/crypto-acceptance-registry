# Classification Rules v0

## Goal

Classification must be deterministic enough to re-run over the same dataset and produce materially consistent results.

## Modes

### direct
Use when the merchant evidence shows direct crypto acceptance behavior, such as:
- wallet address presented by the merchant
- lightning invoice or QR flow
- direct chain-specific payment instructions
- explicit merchant statement that crypto is accepted directly

### processor
Use when the merchant evidence shows processor-mediated acceptance, such as:
- processor checkout branding
- processor-hosted invoice or payment page
- processor documentation listing the merchant
- explicit processor integration statement

### bridge
Use when acceptance is only available through an indirect spend bridge, such as:
- card rails
- wallet-to-fiat conversion before spend
- cash-equivalent conversion before checkout
- exchange-linked payment card flow

### unknown
Use when the available evidence does not establish a reliable path.

## Confidence guidance

### high
At least one strong primary source clearly establishes the mode.

### medium
Evidence strongly suggests the mode, but the flow is partially inferred.

### low
The mode is weakly inferred or evidence is incomplete.

## Evidence priority

1. official merchant payment page or checkout
2. official merchant FAQ/help page
3. official processor merchant listing
4. merchant social proof with clear payment details
5. third-party directory or reporting source

## Publish rule

A record can be published if it has:
- a classification mode
- at least one evidence item
- a last_checked_at value
- a confidence value

Low-confidence records may still be published if clearly labeled.

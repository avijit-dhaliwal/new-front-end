# Stripe Billing Architecture

This document describes the Stripe subscription billing architecture for KobyAI's portal, implemented by Agent 3 as part of the 4-agent parallel plan.

## Overview

The billing system supports:
- **1:1 Stripe Customer per org** - Each organization has exactly one Stripe customer
- **1+ Stripe Subscription per org** - Organizations can have multiple subscriptions (e.g., chatbot + phone)
- **Webhook-driven reconciliation** - All billing state synced via Stripe webhooks
- **Org-scoped billing** - All billing data scoped to organizations

## Stripe Object Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         Stripe                                   │
│  ┌──────────────┐    ┌────────────────┐    ┌──────────────┐    │
│  │   Customer   │◄───│  Subscription  │───►│   Invoice    │    │
│  │  (per org)   │    │  (per plan)    │    │ (per period) │    │
│  └──────────────┘    └────────────────┘    └──────────────┘    │
│         │                    │                    │             │
│         │ metadata.org_id    │ metadata.org_id    │ customer    │
│         ▼                    ▼                    ▼             │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Webhooks  │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       D1 Database                                │
│  ┌──────────────────┐  ┌─────────────────────┐                  │
│  │ billing_customers│  │ billing_subscriptions│                  │
│  │ (1:1 with orgs)  │  │ (1+ per org)        │                  │
│  └────────┬─────────┘  └──────────┬──────────┘                  │
│           │                       │                              │
│           └───────────┬───────────┘                              │
│                       ▼                                          │
│            ┌─────────────────────┐                               │
│            │  billing_invoices   │                               │
│            │ + invoice_lines     │                               │
│            └─────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## D1 Schema

### billing_customers
Links Clerk organizations to Stripe customers (1:1 relationship).

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Internal UUID |
| org_id | TEXT UNIQUE | FK to orgs.id |
| stripe_customer_id | TEXT UNIQUE | Stripe customer ID (cus_xxx) |
| email | TEXT | Customer email |
| name | TEXT | Customer/company name |
| currency | TEXT | Default currency (usd) |
| balance_cents | INTEGER | Account balance |
| delinquent | INTEGER | Delinquent status (0/1) |
| default_payment_method_id | TEXT | Default payment method |
| invoice_settings | JSON | Invoice settings from Stripe |
| metadata | JSON | Custom metadata |

### billing_subscriptions
Tracks Stripe subscriptions per org.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Internal UUID |
| org_id | TEXT | FK to orgs.id |
| billing_customer_id | TEXT | FK to billing_customers.id |
| stripe_subscription_id | TEXT UNIQUE | Stripe subscription ID (sub_xxx) |
| stripe_price_id | TEXT | Stripe price ID (price_xxx) |
| status | TEXT | incomplete, trialing, active, past_due, canceled, unpaid, paused |
| plan_nickname | TEXT | Human-readable plan name |
| quantity | INTEGER | Subscription quantity |
| cancel_at_period_end | INTEGER | Whether canceling at period end |
| current_period_start | TEXT | Current billing period start |
| current_period_end | TEXT | Current billing period end |
| trial_start/end | TEXT | Trial period dates |
| canceled_at | TEXT | Cancellation timestamp |
| ended_at | TEXT | End timestamp |

### billing_invoices
Synced from Stripe invoice webhooks.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Internal UUID |
| org_id | TEXT | FK to orgs.id |
| billing_customer_id | TEXT | FK to billing_customers.id |
| billing_subscription_id | TEXT | FK to billing_subscriptions.id (nullable) |
| stripe_invoice_id | TEXT UNIQUE | Stripe invoice ID (in_xxx) |
| stripe_invoice_number | TEXT | Invoice number |
| status | TEXT | draft, open, paid, uncollectible, void |
| subtotal_cents | INTEGER | Subtotal in cents |
| tax_cents | INTEGER | Tax in cents |
| total_cents | INTEGER | Total in cents |
| amount_due/paid/remaining_cents | INTEGER | Payment amounts |
| hosted_invoice_url | TEXT | Stripe hosted invoice URL |
| invoice_pdf | TEXT | PDF download URL |
| period_start/end | TEXT | Invoice period |
| due_date | TEXT | Payment due date |
| paid_at | TEXT | Payment timestamp |

### billing_invoice_lines
Individual line items on invoices.

### stripe_events
Stores all incoming Stripe webhook events for:
- Idempotent processing (prevents duplicate processing)
- Audit trail
- Debugging/replay capability

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Internal UUID |
| stripe_event_id | TEXT UNIQUE | Stripe event ID (evt_xxx) |
| event_type | TEXT | Event type (e.g., invoice.paid) |
| status | TEXT | pending, processed, failed, skipped |
| processing_error | TEXT | Error message if failed |
| payload | JSON | Full event payload |

### billing_checkout_sessions
Tracks Stripe Checkout sessions for new subscriptions.

### billing_portal_sessions
Tracks Stripe Billing Portal sessions for customer self-service.

## API Endpoints

### GET /billing/overview
Returns complete billing overview for the authenticated org.

**Response:**
```json
{
  "customer": { ... },
  "subscriptions": [ ... ],
  "currentPlan": {
    "name": "Bundle Pack",
    "status": "active",
    "currentPeriodEnd": "2025-01-26T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "upcomingInvoice": {
    "amountDueCents": 42500,
    "dueDate": "2025-01-26"
  },
  "recentInvoices": [ ... ]
}
```

### GET /billing/subscriptions
Lists all subscriptions for the org.

### GET /billing/invoices
Lists invoices with pagination and status filtering.

**Query params:**
- `limit` (default: 25, max: 100)
- `offset` (default: 0)
- `status` (optional: draft, open, paid, uncollectible, void)

### GET /billing/invoices/:id
Returns invoice detail with line items.

### POST /billing/checkout-session
Creates a Stripe Checkout Session for new subscription.

**Request:**
```json
{
  "priceId": "price_xxx",
  "successUrl": "https://koby.ai/portal?checkout=success",
  "cancelUrl": "https://koby.ai/portal?checkout=canceled",
  "quantity": 1,
  "trialPeriodDays": 14,
  "metadata": {}
}
```

**Response:**
```json
{
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

### POST /billing/portal-session
Creates a Stripe Billing Portal session for customer self-service.

**Request:**
```json
{
  "returnUrl": "https://koby.ai/portal"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### POST /webhooks/stripe
Stripe webhook receiver with signature verification.

**Headers:**
- `stripe-signature`: Stripe webhook signature

**Processed Events:**
- `customer.created`, `customer.updated`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- `invoice.created`, `invoice.updated`, `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`
- `checkout.session.completed`, `checkout.session.expired`

## Portal UI Integration Points

### 1. Billing Overview Card (Portal Dashboard)
Show current plan status on the main portal overview.

```tsx
// In portal/page.tsx
<BillingStatusCard 
  plan={billingData.currentPlan}
  nextInvoice={billingData.upcomingInvoice}
/>
```

### 2. Manage Billing Button
Button that opens Stripe Billing Portal for self-service management.

```tsx
// In portal/settings/page.tsx or dedicated billing page
const handleManageBilling = async () => {
  const response = await fetch('/billing/portal-session', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      returnUrl: window.location.href 
    })
  })
  const { url } = await response.json()
  window.location.href = url
}

<button onClick={handleManageBilling}>
  Manage Billing
</button>
```

### 3. Subscription Status Display
Show subscription status in portal header or sidebar.

```tsx
// Status pill showing subscription state
<StatusPill 
  status={subscription.status} 
  label={subscription.planNickname}
/>

// Status mappings:
// 'active' -> green
// 'trialing' -> blue  
// 'past_due' -> yellow
// 'canceled' -> gray
// 'unpaid' -> red
```

### 4. Invoice History
List of past invoices with download links.

```tsx
// Dedicated invoices page or tab
{invoices.map(invoice => (
  <InvoiceRow 
    key={invoice.id}
    number={invoice.stripeInvoiceNumber}
    date={invoice.createdAt}
    amount={formatCurrency(invoice.totalCents)}
    status={invoice.status}
    pdfUrl={invoice.invoicePdf}
    viewUrl={invoice.hostedInvoiceUrl}
  />
))}
```

### 5. Upgrade/Subscribe CTA
For orgs without active subscription.

```tsx
const handleSubscribe = async (priceId: string) => {
  const response = await fetch('/billing/checkout-session', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      priceId,
      successUrl: `${window.location.origin}/portal?checkout=success`,
      cancelUrl: `${window.location.origin}/portal?checkout=canceled`,
    })
  })
  const { url } = await response.json()
  window.location.href = url
}
```

## Environment Variables

Required environment variables for the portal worker:

```bash
# Stripe API keys
STRIPE_SECRET_KEY=sk_live_xxx        # or sk_test_xxx for test mode
STRIPE_WEBHOOK_SECRET=whsec_xxx      # Webhook signing secret

# Existing
CLERK_DOMAIN=xxx.clerk.accounts.dev
```

## Stripe Dashboard Configuration

### 1. Products & Prices
Create products and prices in Stripe Dashboard:

| Product | Price ID | Amount | Billing |
|---------|----------|--------|---------|
| AI Chatbot | price_chatbot_monthly | $50/mo | Monthly |
| AI Phone Service | price_phone_monthly | $400/mo | Monthly |
| Bundle Pack | price_bundle_monthly | $425/mo | Monthly |
| Custom AI Suite | price_enterprise_monthly | Custom | Monthly |

### 2. Webhook Endpoint
Configure webhook endpoint in Stripe Dashboard:
- **URL:** `https://portal-worker.koby.ai/webhooks/stripe`
- **Events:**
  - `customer.created`, `customer.updated`
  - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
  - `invoice.created`, `invoice.updated`, `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`
  - `checkout.session.completed`, `checkout.session.expired`

### 3. Customer Portal
Configure Stripe Customer Portal:
- Enable subscription cancellation
- Enable plan switching (if applicable)
- Enable invoice history
- Enable payment method updates

## Migration Path

### From Sample Data
The existing `billing_records` table contains usage-based sample data. The new Stripe tables will:
1. Replace `billing_records` for subscription billing
2. Keep `billing_records` for usage tracking/ledger (optional)

### Webhook Setup
1. Deploy portal worker with Stripe endpoints
2. Configure webhook in Stripe Dashboard
3. Verify webhook with test events
4. Begin processing real events

## Security Considerations

1. **Webhook Signature Verification:** All Stripe webhooks verified using HMAC-SHA256
2. **Org Scoping:** All billing data scoped to authenticated org
3. **No Secrets in Client:** All Stripe calls server-side via worker
4. **Idempotent Processing:** Duplicate events rejected via stripe_event_id

## Testing

### Test Mode
Use Stripe test mode keys (`sk_test_xxx`) for development.

### Test Cards
- `4242424242424242` - Successful payment
- `4000000000000341` - Attach succeeds, charge fails
- `4000000000000002` - Card declined

### Webhook Testing
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:8787/webhooks/stripe
```

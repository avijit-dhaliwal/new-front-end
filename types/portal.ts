/**
 * Portal Data Types
 * These types match the D1 schema and portal-worker API responses
 */

// =============================================================================
// Database Entity Types (matching D1 schema)
// =============================================================================

export interface Org {
  id: string
  clerk_org_id?: string
  name: string
  slug?: string
  status: 'active' | 'inactive' | 'at_risk' | 'churned'
  plan: 'chatbot' | 'phone' | 'bundle' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface PortalSite {
  id: string
  org_id: string
  site_key: string
  name: string
  type: 'chatbot' | 'voice' | 'automation'
  domain?: string
  system_prompt?: string
  config?: Record<string, unknown>
  status: 'active' | 'inactive' | 'paused'
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  site_id: string
  org_id: string
  visitor_id?: string
  started_at: string
  ended_at?: string
  message_count: number
  status: 'active' | 'completed' | 'abandoned'
  metadata?: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  session_id: string
  site_id: string
  org_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  latency_ms?: number
  tokens_used?: number
  created_at: string
}

export interface MetricsDaily {
  id: string
  org_id: string
  site_id?: string
  date: string
  total_sessions: number
  total_messages: number
  avg_latency_ms: number
  total_tokens: number
  unique_visitors: number
  leads_captured: number
  appointments_booked: number
}

// =============================================================================
// API Response Types (from portal-worker.js)
// =============================================================================

export interface PortalOverviewResponse {
  org: Org | null
  sites: PortalSite[]
  stats: {
    totalSessions: number
    totalMessages: number
    avgLatency: number
    leadsCapture: number
    appointmentsBooked: number
    activeSessions: number
  }
  period: {
    start: string
    end: string
  }
}

export interface PortalEngine {
  id: string
  name: string
  type: 'chatbot' | 'voice' | 'automation'
  domain?: string
  status: 'active' | 'inactive' | 'paused'
  activeSessions: number
  todaySessions: number
  orgName?: string
  createdAt: string
}

export interface PortalEnginesResponse {
  engines: PortalEngine[]
}

export interface PortalWorkflowsResponse {
  workflows: Workflow[]
  message?: string
}

export interface DailyMetric {
  date: string
  total_sessions: number
  total_messages: number
  avg_latency_ms: number
  leads_captured: number
}

export interface PortalInsight {
  type: 'tip' | 'alert' | 'warning'
  message: string
}

export interface PortalInsightsResponse {
  dailyMetrics: DailyMetric[]
  peakHours: { hour: number; sessions: number }[]
  insights: PortalInsight[]
}

export interface PortalTeamResponse {
  team: TeamMember[]
  message?: string
  manageUrl?: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  lastActive?: string
}

// =============================================================================
// Koby Staff Client List Types
// =============================================================================

export interface PortalClient {
  id: string
  name: string
  slug?: string
  status: 'active' | 'inactive' | 'at_risk' | 'churned'
  plan: 'chatbot' | 'phone' | 'bundle' | 'enterprise'
  siteCount: number
  todaySessions: number
  lastActivity?: string
  createdAt: string
}

export interface PortalClientsResponse {
  clients: PortalClient[]
}

// =============================================================================
// Action + Integration Types
// =============================================================================

export type RetryPolicy = 'none' | 'fixed' | 'exponential'
export type ActionStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'canceled'

export interface ActionDefinition {
  id: string
  orgId: string
  key: string
  name: string
  description?: string
  version: string
  handlerUrl?: string
  timeoutMs: number
  retryPolicy: RetryPolicy
  maxRetries: number
  metadata?: Record<string, unknown>
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface ActionRun {
  id: string
  actionId: string
  orgId: string
  status: ActionStatus
  attempt: number
  maxRetries: number
  retryPolicy: RetryPolicy
  triggerSource?: string
  idempotencyKey?: string
  flowId?: string
  flowRunId?: string
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  startedAt?: string
  completedAt?: string
  lastErrorAt?: string
  nextRetryAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export type IntegrationConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending'
export type IntegrationConnectionHealth = 'healthy' | 'warning' | 'error'

export interface IntegrationConnection {
  id: string
  orgId: string
  connector: string
  status: IntegrationConnectionStatus
  credentials?: Record<string, unknown>
  lastRefreshedAt?: string
  expiresAt?: string
  healthStatus: IntegrationConnectionHealth
  healthDetail?: string
  createdAt: string
  updatedAt: string
}

export type WebhookStatus = 'pending' | 'processed' | 'failed' | 'rejected'

export interface WebhookEvent {
  id: string
  orgId?: string
  connector: string
  eventType?: string
  status: WebhookStatus
  signatureValid: boolean
  payload?: Record<string, unknown>
  headers?: Record<string, unknown>
  receivedAt: string
  processedAt?: string
  actionRunId?: string
  error?: string
}

export interface AuditLog {
  id: string
  orgId?: string
  actorType?: 'user' | 'system' | 'integration'
  actorId?: string
  eventType: string
  targetType?: string
  targetId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface OutcomeEvent {
  id: string
  orgId: string
  actionRunId?: string
  outcomeType: string
  label?: string
  amountCents?: number
  currency?: string
  recordedAt: string
  metadata?: Record<string, unknown>
}

export type BillingStatus = 'pending' | 'invoiced' | 'paid' | 'written_off'

export interface BillingRecord {
  id: string
  orgId: string
  usageType: string
  quantity: number
  unitPriceCents: number
  amountCents: number
  status: BillingStatus
  periodStart: string
  periodEnd: string
  externalInvoiceId?: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// Stripe Billing Types (Agent 3: Subscription Architecture)
// =============================================================================

/**
 * Stripe subscription status values
 * @see https://stripe.com/docs/api/subscriptions/object#subscription_object-status
 */
export type StripeSubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'

/**
 * Stripe invoice status values
 * @see https://stripe.com/docs/api/invoices/object#invoice_object-status
 */
export type StripeInvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void'

/**
 * Stripe checkout session mode
 */
export type StripeCheckoutMode = 'payment' | 'setup' | 'subscription'

/**
 * Stripe event processing status
 */
export type StripeEventStatus = 'pending' | 'processed' | 'failed' | 'skipped'

/**
 * Billing customer - links org to Stripe customer
 * 1:1 relationship between org and Stripe customer
 */
export interface BillingCustomer {
  id: string
  orgId: string
  stripeCustomerId: string
  email?: string
  name?: string
  currency: string
  balanceCents: number
  delinquent: boolean
  defaultPaymentMethodId?: string
  invoiceSettings?: Record<string, unknown>
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Billing subscription - Stripe subscription per org
 * Supports multiple subscriptions per org (e.g., chatbot + phone)
 */
export interface BillingSubscription {
  id: string
  orgId: string
  billingCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  status: StripeSubscriptionStatus
  planNickname?: string
  quantity: number
  cancelAtPeriodEnd: boolean
  currentPeriodStart?: string
  currentPeriodEnd?: string
  canceledAt?: string
  endedAt?: string
  trialStart?: string
  trialEnd?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Billing invoice - synced from Stripe webhooks
 */
export interface BillingInvoice {
  id: string
  orgId: string
  billingCustomerId: string
  billingSubscriptionId?: string
  stripeInvoiceId: string
  stripeInvoiceNumber?: string
  status: StripeInvoiceStatus
  currency: string
  subtotalCents: number
  taxCents: number
  totalCents: number
  amountDueCents: number
  amountPaidCents: number
  amountRemainingCents: number
  hostedInvoiceUrl?: string
  invoicePdf?: string
  periodStart?: string
  periodEnd?: string
  dueDate?: string
  paidAt?: string
  finalizedAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Invoice line item - individual charge on an invoice
 */
export interface BillingInvoiceLine {
  id: string
  billingInvoiceId: string
  orgId: string
  stripeLineItemId: string
  description?: string
  quantity: number
  unitAmountCents: number
  amountCents: number
  currency: string
  priceId?: string
  productId?: string
  periodStart?: string
  periodEnd?: string
  proration: boolean
  metadata?: Record<string, unknown>
  createdAt: string
}

/**
 * Stripe webhook event - for idempotent processing + audit
 */
export interface StripeEvent {
  id: string
  stripeEventId: string
  eventType: string
  apiVersion?: string
  livemode: boolean
  orgId?: string
  objectType?: string
  objectId?: string
  status: StripeEventStatus
  processingError?: string
  payload: Record<string, unknown>
  receivedAt: string
  processedAt?: string
}

/**
 * Checkout session - tracks pending purchases
 */
export interface BillingCheckoutSession {
  id: string
  orgId: string
  stripeSessionId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  status: 'open' | 'complete' | 'expired'
  mode: StripeCheckoutMode
  successUrl?: string
  cancelUrl?: string
  expiresAt?: string
  completedAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Billing portal session - Stripe Customer Portal access
 */
export interface BillingPortalSession {
  id: string
  orgId: string
  billingCustomerId: string
  stripeSessionId: string
  stripeSessionUrl: string
  returnUrl?: string
  createdBy?: string
  createdAt: string
}

// =============================================================================
// Stripe Billing API Response Types
// =============================================================================

export interface BillingCustomerResponse {
  customer: BillingCustomer
}

export interface BillingSubscriptionResponse {
  subscription: BillingSubscription
}

export interface BillingSubscriptionsResponse {
  subscriptions: BillingSubscription[]
}

export interface BillingInvoicesResponse {
  invoices: BillingInvoice[]
  hasMore?: boolean
}

export interface BillingInvoiceDetailResponse {
  invoice: BillingInvoice
  lines: BillingInvoiceLine[]
}

export interface CreateCheckoutSessionRequest {
  priceId: string
  successUrl: string
  cancelUrl: string
  quantity?: number
  trialPeriodDays?: number
  metadata?: Record<string, unknown>
}

export interface CreateCheckoutSessionResponse {
  sessionId: string
  url: string
}

export interface CreateBillingPortalSessionRequest {
  returnUrl: string
}

export interface CreateBillingPortalSessionResponse {
  url: string
}

export interface BillingOverviewResponse {
  customer: BillingCustomer | null
  subscriptions: BillingSubscription[]
  currentPlan: {
    name: string
    status: StripeSubscriptionStatus
    currentPeriodEnd?: string
    cancelAtPeriodEnd: boolean
  } | null
  upcomingInvoice: {
    amountDueCents: number
    dueDate?: string
  } | null
  recentInvoices: BillingInvoice[]
}

export interface StripeWebhookPayload {
  id: string
  type: string
  api_version: string
  livemode: boolean
  data: {
    object: Record<string, unknown>
  }
}

export interface RetentionPolicy {
  id: string
  orgId: string
  dataType: string
  ttlDays: number
  applyAnonymization: boolean
  enforcedAt?: string
  createdAt: string
  updatedAt: string
}

// API Responses for Agent 4 endpoints
export interface ActionRegisterResponse {
  action: ActionDefinition
}

export interface ActionRunResponse {
  run: ActionRun
}

export interface WebhookIngestResponse {
  received: boolean
  eventId?: string
}

export interface OutcomesResponse {
  outcomes: OutcomeEvent[]
  totals?: {
    count: number
    amountCents: number
  }
}

export interface BillingUsageResponse {
  records: BillingRecord[]
  totals?: {
    amountCents: number
    periodStart: string
    periodEnd: string
  }
}

// =============================================================================
// Portal Config Types
// =============================================================================

export interface PortalBranding {
  logo_url?: string
  primary_color?: string
  company_name?: string
}

export type PortalModule =
  | 'overview'
  | 'engines'        // Live Ops
  | 'workflows'      // Automations
  | 'knowledge'
  | 'integrations'
  | 'outcomes'
  | 'insights'
  | 'team'

export interface CustomCard {
  id: string
  title: string
  value: string
  note?: string
  order: number
}

export interface PortalConfig {
  orgId: string
  branding: PortalBranding
  enabled_modules: PortalModule[]
  custom_cards: CustomCard[]
  settings: Record<string, unknown>
  updated_at?: string
}

export interface PortalConfigResponse {
  config: PortalConfig | null
}

// =============================================================================
// Integrations & Outcomes
// =============================================================================

export interface PortalIntegrationsResponse {
  integrations: IntegrationConnection[]
}

export interface OutcomeMetric {
  id: string
  title: string
  value: string
  change?: string
  horizon?: string
  status?: 'up' | 'down' | 'flat'
  note?: string
}

// =============================================================================
// Event Model
// =============================================================================

export type PortalEventType =
  | 'session_started'
  | 'user_message'
  | 'assistant_message'
  | 'session_ended'
  | 'lead_captured'
  | 'appointment_booked'
  | 'action_run'
  | 'outcome_recorded'

export interface PortalEvent {
  id: string
  org_id: string
  site_id: string
  session_id: string
  type: PortalEventType
  content: string | null
  created_at: string
  metadata?: Record<string, unknown>
}

export interface PortalEventsResponse {
  events: PortalEvent[]
}

export interface ActionRunsResponse {
  runs: ActionRun[]
}

// =============================================================================
// Legacy Types (for backwards compatibility)
// =============================================================================

export interface MetricCard {
  label: string
  value: string
  change?: string
  note?: string
}

export interface EngineStatus {
  title: string
  status: 'Healthy' | 'Degraded' | 'Down' | 'Synced' | 'Active'
  detail: string
  metric: string
}

export interface Workflow {
  id: string
  name: string
  lastRun: string
  outcome: string
}

export interface QualitySignal {
  title: string
  value: string
  note: string
}

export interface TrendDataPoint {
  label: string
  value: number
}

export interface TeamAccess {
  role: string
  count: number
}

// =============================================================================
// Compliance + Observability
// =============================================================================



export interface AuditLogsResponse {
  logs: AuditLog[]
}

export interface RetentionPoliciesResponse {
  policies: RetentionPolicy[]
}

// =============================================================================
// Cloudflare Analytics Types (for koby.ai internal dashboard)
// =============================================================================

export interface CloudflareAnalyticsData {
  uniqueVisitors: number
  totalRequests: number
  percentCached: number
  totalDataServedMB: number
  dataCachedMB: number
  period: {
    start: string
    end: string
  }
  timeseries?: CloudflareTimeseriesPoint[]
}

export interface CloudflareTimeseriesPoint {
  timestamp: string
  requests: number
  visitors: number
  cachedRequests: number
  bytesServed: number
}

export interface CloudflareAnalyticsResponse {
  analytics: CloudflareAnalyticsData
  zone: string
  lastUpdated: string
}

// =============================================================================
// Loading States
// =============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PortalState {
  loadingState: LoadingState
  error: string | null
  data: PortalOverviewResponse | null
}

export interface ClientsState {
  loadingState: LoadingState
  error: string | null
  clients: PortalClient[]
  filter: 'all' | 'active' | 'at-risk'
}

// =============================================================================
// Widget/Embed Types (Agent 4)
// =============================================================================

export type DeploymentEnvironment = 'development' | 'staging' | 'production'
export type DeploymentStatus = 'active' | 'paused' | 'disabled'
export type WidgetVersionStatus = 'canary' | 'beta' | 'stable' | 'deprecated'
export type VersionPinType = 'specific' | 'channel'
export type VersionChannel = 'stable' | 'beta' | 'canary'

export interface WidgetTheme {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  primaryColor: string
  fontFamily: string
  borderRadius: string
  headerText: string
  placeholderText: string
  sendButtonIcon: string
  showBranding: boolean
  darkMode: 'auto' | 'light' | 'dark'
}

export interface WidgetBehavior {
  autoOpen: boolean
  autoOpenDelay: number
  triggerMessages: string[]
  persistSession: boolean
  sessionTimeout: number
  showTypingIndicator: boolean
  enableSounds: boolean
  enableAttachments: boolean
  maxMessageLength: number
}

export interface WidgetLocale {
  greeting: string
  offlineMessage: string
  errorMessage: string
  sendLabel: string
  minimizeLabel: string
}

export interface WidgetAnalytics {
  trackEvents: boolean
  trackConversions: boolean
  customEvents: string[]
}

export interface WidgetProfile {
  id: string
  orgId: string
  name: string
  description?: string
  theme: WidgetTheme
  behavior: WidgetBehavior
  locale: WidgetLocale
  analytics: WidgetAnalytics
  createdAt: string
  updatedAt: string
}

export interface SiteDeployment {
  id: string
  siteId: string
  orgId: string
  environment: DeploymentEnvironment
  deployKey: string
  widgetProfileId?: string
  allowedOrigins: string[]
  rateLimitRpm: number
  rateLimitDaily: number
  previousKey?: string
  keyRotatedAt?: string
  keyExpiresAt?: string
  status: DeploymentStatus
  createdAt: string
  updatedAt: string
  deployedAt?: string
}

export interface WidgetVersion {
  id: string
  version: string
  changelog?: string
  releaseNotes?: string
  scriptUrl: string
  stylesUrl?: string
  integrityHash?: string
  minProfileVersion: number
  status: WidgetVersionStatus
  releasedAt: string
  deprecatedAt?: string
}

export interface DeploymentVersionPin {
  id: string
  deploymentId: string
  widgetVersionId: string
  pinType: VersionPinType
  channel?: VersionChannel
  rolloutPercentage: number
  createdAt: string
  updatedAt: string
}

// Public config returned by GET /widget/config/:deploy_key
export interface PublicWidgetConfig {
  deployKey: string
  orgSlug: string
  siteName: string
  theme: WidgetTheme
  behavior: WidgetBehavior
  locale: WidgetLocale
  analytics: Pick<WidgetAnalytics, 'trackEvents' | 'trackConversions'>
  endpoints: {
    chat: string
    session: string
  }
  widgetVersion: string
  widgetIntegrity?: string
}

export interface PublicWidgetConfigResponse {
  config: PublicWidgetConfig
}

// API responses for widget management
export interface WidgetProfilesResponse {
  profiles: WidgetProfile[]
}

export interface WidgetProfileResponse {
  profile: WidgetProfile
}

export interface SiteDeploymentsResponse {
  deployments: SiteDeployment[]
}

export interface SiteDeploymentResponse {
  deployment: SiteDeployment
}

export interface WidgetVersionsResponse {
  versions: WidgetVersion[]
}

export interface RotateKeyResponse {
  deployment: SiteDeployment
  previousKey: string
  expiresAt: string
}

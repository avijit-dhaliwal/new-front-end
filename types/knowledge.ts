/**
 * Knowledge + Flow Engine Types
 * Canonical contract for ingestion, versioning, citations, and deterministic flows
 */

// =============================================================================
// Knowledge Graph Entities
// =============================================================================

export type KnowledgeSourceType = 'file' | 'url' | 'notion' | 'google_drive' | 's3' | 'webhook'
export type KnowledgeSourceStatus = 'connected' | 'syncing' | 'error' | 'paused'

export interface KnowledgeSource {
  id: string
  org_id: string
  name: string
  type: KnowledgeSourceType
  status: KnowledgeSourceStatus
  sync_cursor?: string
  last_synced_at?: string
  created_at: string
  updated_at: string
  config?: Record<string, unknown>
  error_message?: string
}

export type KnowledgeDocumentStatus = 'processing' | 'ready' | 'failed' | 'archived'

export interface KnowledgeDocument {
  id: string
  org_id: string
  source_id: string
  title: string
  path?: string
  external_id?: string
  status: KnowledgeDocumentStatus
  live_version_id?: string
  checksum?: string
  mime_type?: string
  size_bytes?: number
  created_at: string
  updated_at: string
}

export interface KnowledgeVersion {
  id: string
  document_id: string
  org_id: string
  version_number: number
  stage?: 'draft' | 'live' | 'archived'
  is_live?: boolean
  checksum: string
  chunk_count: number
  token_count: number
  created_at: string
  created_by?: string
  change_note?: string
}

export interface KnowledgeChunk {
  id: string
  version_id: string
  org_id: string
  content: string
  token_count: number
  embedding?: number[]
  page_label?: string
  metadata?: Record<string, unknown>
}

export interface KnowledgeEmbedding {
  id: string
  org_id: string
  version_id: string
  chunk_id: string
  model: string
  vector: number[]
  created_at: string
}

export type KnowledgeJobStatus = 'pending' | 'processing' | 'succeeded' | 'failed'
export type KnowledgeJobType = 'ingest_source' | 'ingest_document' | 'rechunk' | 'embed' | 'sync'

export interface KnowledgeIngestionJob {
  id: string
  org_id: string
  source_id?: string
  document_id?: string
  version_id?: string
  type: KnowledgeJobType
  status: KnowledgeJobStatus
  error_message?: string
  created_at: string
  updated_at: string
}

export type KnowledgePolicyEnforcement = 'block' | 'warn' | 'mask' | 'handoff'

export interface KnowledgePolicyRule {
  id: string
  type: 'redact' | 'restrict' | 'handoff'
  match: 'pii' | 'phi' | 'secrets' | 'regex' | 'keyword'
  pattern?: string
  applies_to: 'sources' | 'documents' | 'chunks' | 'responses'
  enforcement: KnowledgePolicyEnforcement
  action?: string
}

export interface KnowledgePolicy {
  id: string
  org_id: string
  name: string
  description?: string
  rules: KnowledgePolicyRule[]
  created_at: string
  updated_at: string
}

export interface KnowledgeCitation {
  chunk_id: string
  source_id: string
  version_id: string
  url?: string
  pointer?: string
}

export interface KnowledgeAnswer {
  answer: string
  citations: KnowledgeCitation[]
  policies_triggered?: KnowledgePolicyRule[]
}

export interface KnowledgeRetrievalResult {
  chunkId: string
  documentId: string
  sourceId: string
  versionId: string
  content: string
  score: number
  citations: KnowledgeCitation[]
  policiesTriggered?: KnowledgePolicyRule[]
}

export interface KnowledgeRetrieveResponse {
  query: string
  results: KnowledgeRetrievalResult[]
}

// =============================================================================
// Flow Engine Entities
// =============================================================================

export type FlowStatus = 'draft' | 'active' | 'paused' | 'archived'
export type FlowTriggerType = 'api' | 'webhook' | 'schedule' | 'inbound_call' | 'chat'

export interface FlowTrigger {
  type: FlowTriggerType
  config?: Record<string, unknown>
}

export interface Flow {
  id: string
  org_id: string
  name: string
  description?: string
  status: FlowStatus
  trigger: FlowTrigger
  entry_step_id: string
  last_published_at?: string
  created_at: string
  updated_at: string
  version?: number
}

export type FlowStepKind =
  | 'collector'
  | 'router'
  | 'llm'
  | 'action'
  | 'handoff'
  | 'end'

export interface FlowStep {
  id: string
  flow_id: string
  kind: FlowStepKind
  name: string
  config: Record<string, unknown>
  next_step_id?: string
  created_at: string
  updated_at: string
}

export interface FlowRule {
  id: string
  flow_id: string
  step_id?: string
  condition: string
  action: 'goto' | 'end' | 'handoff' | 'invoke_action'
  target_step_id?: string
  created_at: string
  updated_at: string
}

export interface FlowTestCase {
  id: string
  flow_id: string
  name: string
  input: Record<string, unknown>
  expected_outcome: string
  last_run_at?: string
  last_result?: 'passed' | 'failed' | 'blocked'
}

export interface FlowExecutionPreview {
  flow: Flow
  steps: FlowStep[]
  rules: FlowRule[]
  policies: KnowledgePolicy[]
}

export interface FlowRunInsight {
  flow_id: string
  run_id: string
  started_at: string
  duration_ms: number
  outcome: 'success' | 'failed' | 'handoff' | 'cancelled'
  triggered_policy_ids?: string[]
}

export interface FlowRun {
  id: string
  flowId: string
  orgId: string
  startedAt: string
  durationMs?: number
  outcome?: 'success' | 'failed' | 'handoff' | 'cancelled'
  triggeredPolicyIds?: string[]
  metadata?: Record<string, unknown>
  actionRunId?: string
  outcomeEventId?: string
}

export interface FlowRunResponse {
  run: FlowRun
}

// =============================================================================
// API Response Shapes
// =============================================================================

export interface KnowledgeOverviewResponse {
  sources: KnowledgeSource[]
  documents: KnowledgeDocument[]
  policies: KnowledgePolicy[]
  jobs?: KnowledgeIngestionJob[]
  message?: string
}

export interface FlowListResponse {
  flows: Flow[]
  tests: FlowTestCase[]
  insights?: FlowRunInsight[]
}

export interface FlowDetailResponse {
  flow: Flow
  steps: FlowStep[]
  rules: FlowRule[]
  tests: FlowTestCase[]
  preview?: FlowExecutionPreview
}

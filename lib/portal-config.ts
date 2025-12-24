import type { 
  PortalBranding, 
  PortalConfig, 
  PortalModule, 
  CustomCard, 
  PortalConfigResponse 
} from '@/types/portal'

// Re-export core contract types for convenience
export type { PortalBranding, PortalConfig, PortalModule, CustomCard } from '@/types/portal'

// ============================================================================
// Preset Configurations
// ============================================================================

/**
 * Default configuration for clients using only the chatbot service.
 * Shows a minimal set of modules focused on chat operations.
 */
export const CHATBOT_ONLY_PRESET: Omit<PortalConfig, 'orgId' | 'updated_at'> = {
  branding: {
    logo_url: null,
    primary_color: null,
    company_name: null,
  },
  enabled_modules: [
    'overview',
    'engines',
    'insights',
    'team',
  ],
  settings: {},
  custom_cards: [
    {
      id: 'chat_volume',
      title: 'Chat volume',
      value: '--',
      note: 'Messages this month',
      order: 0,
    },
    {
      id: 'resolution_rate',
      title: 'Resolution rate',
      value: '--',
      note: 'Without escalation',
      order: 1,
    },
    {
      id: 'avg_response',
      title: 'Avg response time',
      value: '--',
      note: 'First response',
      order: 2,
    },
  ],
}

/**
 * Default configuration for clients using the full AI suite.
 * Shows all modules with comprehensive metrics.
 */
export const FULL_SUITE_PRESET: Omit<PortalConfig, 'orgId' | 'updated_at'> = {
  branding: {
    logo_url: null,
    primary_color: null,
    company_name: null,
  },
  enabled_modules: [
    'overview',
    'engines',
    'workflows',
    'outcomes',
    'knowledge',
    'integrations',
    'insights',
    'team',
  ],
  settings: {},
  custom_cards: [
    {
      id: 'calls_handled',
      title: 'Calls handled',
      value: '--',
      note: 'This month',
      order: 0,
    },
    {
      id: 'chats_resolved',
      title: 'Chats resolved',
      value: '--',
      note: 'This month',
      order: 1,
    },
    {
      id: 'leads_qualified',
      title: 'Leads qualified',
      value: '--',
      note: 'This month',
      order: 2,
    },
    {
      id: 'appointments',
      title: 'Appointments booked',
      value: '--',
      note: 'This month',
      order: 3,
    },
    {
      id: 'automation_hours',
      title: 'Automation hours saved',
      value: '--',
      note: 'Across all workflows',
      order: 4,
    },
    {
      id: 'response_time',
      title: 'Avg response time',
      value: '--',
      note: 'Voice and chat combined',
      order: 5,
    },
  ],
}

// ============================================================================
// Module Metadata
// ============================================================================

export interface ModuleInfo {
  id: PortalModule
  label: string
  description: string
  icon: string  // lucide icon name
}

export const MODULE_INFO: ModuleInfo[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Key metrics and status at a glance',
    icon: 'LayoutDashboard',
  },
  {
    id: 'engines',
    label: 'Live Ops',
    description: 'Real-time engine status and health',
    icon: 'Activity',
  },
  {
    id: 'workflows',
    label: 'Automations',
    description: 'Active workflows and their outcomes',
    icon: 'Workflow',
  },
  {
    id: 'outcomes',
    label: 'Outcomes',
    description: 'Tracked results across inbox, booking, and revenue',
    icon: 'Flag',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    description: 'RAG performance and guardrail triggers',
    icon: 'BookOpen',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Connected systems and sync status',
    icon: 'Plug',
  },
  {
    id: 'insights',
    label: 'Insights',
    description: 'Trends and analytics over time',
    icon: 'TrendingUp',
  },
  {
    id: 'team',
    label: 'Team & Access',
    description: 'User management and permissions',
    icon: 'Users',
  },
]

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get default config based on client type
 */
export function getDefaultConfig(clientType: 'chatbot_only' | 'full_suite'): Omit<PortalConfig, 'orgId' | 'updated_at'> {
  return clientType === 'chatbot_only' ? CHATBOT_ONLY_PRESET : FULL_SUITE_PRESET
}

/**
 * Check if a module is enabled in the config
 */
export function isModuleEnabled(config: PortalConfig, module: PortalModule): boolean {
  return config.enabled_modules.includes(module)
}

/**
 * Get sorted custom cards
 */
export function getSortedCards(config: PortalConfig): CustomCard[] {
  return [...config.custom_cards].sort((a, b) => a.order - b.order)
}

/**
 * Generate a new card ID
 */
export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Validate portal config structure
 */
export function validateConfig(config: Partial<PortalConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (config.branding) {
    if (config.branding.primary_color && !/^#[0-9A-Fa-f]{6}$/.test(config.branding.primary_color)) {
      errors.push('Primary color must be a valid hex color (e.g., #f97316)')
    }
  }

  if (config.enabled_modules) {
    const validModules: PortalModule[] = ['overview', 'engines', 'workflows', 'outcomes', 'knowledge', 'integrations', 'insights', 'team']
    for (const mod of config.enabled_modules) {
      if (!validModules.includes(mod)) {
        errors.push(`Invalid module: ${mod}`)
      }
    }
  }

  if (config.custom_cards) {
    for (const card of config.custom_cards) {
      if (!card.id || !card.title) {
        errors.push('Each custom card must have an id and title')
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

// ============================================================================
// API Helpers
// ============================================================================

const PORTAL_WORKER_URL = process.env.NEXT_PUBLIC_PORTAL_WORKER_URL || ''

/**
 * Fetch portal config for an organization
 */
export async function fetchPortalConfig(orgId: string, token: string): Promise<PortalConfig | null> {
  if (!PORTAL_WORKER_URL) {
    console.warn('PORTAL_WORKER_URL not configured')
    return null
  }

  try {
    const response = await fetch(`${PORTAL_WORKER_URL}/portal/config?orgId=${orgId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch config: ${response.status}`)
    }

    const data: PortalConfigResponse = await response.json()
    return data.config ?? null
  } catch (error) {
    console.error('Error fetching portal config:', error)
    return null
  }
}

/**
 * Update portal config for an organization
 */
export async function updatePortalConfig(
  orgId: string,
  updates: Partial<Omit<PortalConfig, 'orgId' | 'updated_at'>>,
  token: string
): Promise<PortalConfig | null> {
  if (!PORTAL_WORKER_URL) {
    console.warn('PORTAL_WORKER_URL not configured')
    return null
  }

  try {
    const response = await fetch(`${PORTAL_WORKER_URL}/portal/config?orgId=${orgId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.status}`)
    }

    const data: PortalConfigResponse = await response.json()
    return data.config ?? null
  } catch (error) {
    console.error('Error updating portal config:', error)
    return null
  }
}

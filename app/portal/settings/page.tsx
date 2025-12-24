'use client'

import { useEffect, useState, type ComponentType } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth, useOrganization, useUser } from '@clerk/nextjs'
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  LayoutDashboard,
  Activity,
  Workflow,
  BookOpen,
  Plug,
  TrendingUp,
  Users,
  Flag,
  AlertCircle,
  Check,
} from 'lucide-react'
import {
  type PortalConfig,
  type PortalModule,
  type CustomCard,
  MODULE_INFO,
  CHATBOT_ONLY_PRESET,
  FULL_SUITE_PRESET,
  generateCardId,
  validateConfig,
  fetchPortalConfig,
  updatePortalConfig,
  getDefaultConfig,
} from '@/lib/portal-config'

// Icon mapping for modules
const moduleIcons: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Activity,
  Workflow,
  BookOpen,
  Plug,
  TrendingUp,
  Users,
  Flag,
}

// Demo config for UI development (will be replaced with API fetch)
const DEMO_CONFIG: PortalConfig = {
  orgId: 'demo_org',
  ...FULL_SUITE_PRESET,
  updated_at: new Date().toISOString(),
}

export default function PortalSettingsPage() {
  const searchParams = useSearchParams()
  const { getToken } = useAuth()
  const { organization } = useOrganization()
  const { user } = useUser()
  const viewingOrgId = searchParams.get('orgId')
  const activeOrgId = viewingOrgId || organization?.id || null

  // State management
  const [config, setConfig] = useState<PortalConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<string[]>([])

  // Load portal config
  useEffect(() => {
    const loadConfig = async () => {
      if (!activeOrgId || !user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrors([])

      try {
        const token = await getToken()
        if (!token) {
          throw new Error('Not authenticated')
        }

        const remoteConfig = await fetchPortalConfig(activeOrgId, token)
        if (remoteConfig) {
          setConfig(remoteConfig)
        } else {
          const preset = getDefaultConfig('full_suite')
          setConfig({
            orgId: activeOrgId,
            ...preset,
            settings: {},
            updated_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error('Failed to load portal config', error)
        setErrors([error instanceof Error ? error.message : 'Failed to load configuration'])
        setConfig(DEMO_CONFIG)
      } finally {
        setIsLoading(false)
      }
    }

    void loadConfig()
  }, [activeOrgId, getToken, user])

  // Branding handlers
  const handleBrandingChange = (field: keyof PortalConfig['branding'], value: string | null) => {
    setConfig(prev => prev ? ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value || null,
      },
    }) : prev)
    setSaveStatus('idle')
  }

  // Module toggle handler
  const handleModuleToggle = (module: PortalModule) => {
    setConfig(prev => {
      if (!prev) return prev
      const isEnabled = prev.enabled_modules.includes(module)
      return {
        ...prev,
        enabled_modules: isEnabled
          ? prev.enabled_modules.filter(m => m !== module)
          : [...prev.enabled_modules, module],
      }
    })
    setSaveStatus('idle')
  }

  // Custom card handlers
  const handleCardChange = (cardId: string, field: keyof CustomCard, value: string | number) => {
    setConfig(prev => prev ? ({
      ...prev,
      custom_cards: prev.custom_cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }) : prev)
    setSaveStatus('idle')
  }

  const handleAddCard = () => {
    if (!config) return
    const newCard: CustomCard = {
      id: generateCardId(),
      title: 'New metric',
      value: '--',
      note: '',
      order: config.custom_cards.length,
    }
    setConfig(prev => prev ? ({
      ...prev,
      custom_cards: [...prev.custom_cards, newCard],
    }) : prev)
    setSaveStatus('idle')
  }

  const handleRemoveCard = (cardId: string) => {
    setConfig(prev => prev ? ({
      ...prev,
      custom_cards: prev.custom_cards
        .filter(card => card.id !== cardId)
        .map((card, index) => ({ ...card, order: index })),
    }) : prev)
    setSaveStatus('idle')
  }

  const handleMoveCard = (cardId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      if (!prev) return prev
      const cards = [...prev.custom_cards].sort((a, b) => a.order - b.order)
      const index = cards.findIndex(c => c.id === cardId)
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === cards.length - 1)
      ) {
        return prev
      }
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      const temp = cards[index].order
      cards[index].order = cards[swapIndex].order
      cards[swapIndex].order = temp
      return { ...prev, custom_cards: cards }
    })
    setSaveStatus('idle')
  }

  // Preset handlers
  const handleApplyPreset = (preset: 'chatbot_only' | 'full_suite') => {
    const presetConfig = preset === 'chatbot_only' ? CHATBOT_ONLY_PRESET : FULL_SUITE_PRESET
    setConfig(prev => prev ? ({
      ...prev,
      ...presetConfig,
    }) : prev)
    setSaveStatus('idle')
  }

  // Save handler
  const handleSave = async () => {
    if (!config || !activeOrgId) {
      setErrors(['Select an organization before saving configuration.'])
      setSaveStatus('error')
      return
    }

    const validation = validateConfig(config)
    if (!validation.valid) {
      setErrors(validation.errors)
      setSaveStatus('error')
      return
    }

    setIsSaving(true)
    setErrors([])

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const updated = await updatePortalConfig(
        activeOrgId,
        {
          branding: config.branding,
          enabled_modules: config.enabled_modules,
          custom_cards: config.custom_cards,
          settings: config.settings || {},
        },
        token
      )

      if (updated) {
        setConfig(updated)
      }
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setErrors([error instanceof Error ? error.message : 'Failed to save configuration. Please try again.'])
    } finally {
      setIsSaving(false)
    }
  }

  if (!activeOrgId) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-4">
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-sm font-semibold text-[var(--ink)]">Select an organization</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Choose a client from the portal before configuring settings.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading || !config) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-[var(--paper-muted)] rounded" />
        <div className="h-10 w-48 bg-[var(--paper-muted)] rounded" />
        <div className="h-64 bg-[var(--paper-muted)] rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--ink)]">
            Portal Settings
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Configure branding, modules, and custom metrics for this client.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            'Saving...'
          ) : saveStatus === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Error display */}
      {errors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Please fix the following errors:</p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Presets */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Quick Presets</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleApplyPreset('chatbot_only')}
            className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
          >
            Chatbot Only
          </button>
          <button
            onClick={() => handleApplyPreset('full_suite')}
            className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
          >
            Full AI Suite
          </button>
        </div>
      </section>

      {/* Branding */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-6">Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={config.branding.company_name || ''}
              onChange={(e) => handleBrandingChange('company_name', e.target.value)}
              placeholder="Enter company name"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.branding.primary_color || '#f97316'}
                onChange={(e) => handleBrandingChange('primary_color', e.target.value)}
                className="w-12 h-10 rounded-lg border border-[var(--line)] cursor-pointer"
              />
              <input
                type="text"
                value={config.branding.primary_color || '#f97316'}
                onChange={(e) => handleBrandingChange('primary_color', e.target.value)}
                placeholder="#f97316"
                className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent font-mono"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--ink)] mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={config.branding.logo_url || ''}
              onChange={(e) => handleBrandingChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Enabled Modules */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-2">Enabled Modules</h2>
        <p className="text-sm text-[var(--ink-muted)] mb-6">
          Toggle which sections appear in this client&apos;s portal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULE_INFO.map((module) => {
            const Icon = moduleIcons[module.icon] || LayoutDashboard
            const isEnabled = config.enabled_modules.includes(module.id)
            return (
              <button
                key={module.id}
                onClick={() => handleModuleToggle(module.id)}
                className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  isEnabled
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--paper-muted)]'
                }`}
              >
                <div className={`rounded-xl p-2 ${isEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--paper-muted)]'}`}>
                  <Icon className={`w-5 h-5 ${isEnabled ? 'text-white' : 'text-[var(--ink-muted)]'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isEnabled ? 'text-[var(--accent-strong)]' : 'text-[var(--ink)]'}`}>
                    {module.label}
                  </p>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5">{module.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isEnabled ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)]'
                }`}>
                  {isEnabled && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Custom Cards */}
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Custom Metric Cards</h2>
            <p className="text-sm text-[var(--ink-muted)] mt-1">
              Configure the metrics shown in the Overview section.
            </p>
          </div>
          <button
            onClick={handleAddCard}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        <div className="space-y-3">
          {config.custom_cards
            .sort((a, b) => a.order - b.order)
            .map((card, index) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveCard(card.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                    placeholder="Metric title"
                    className="rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <input
                    type="text"
                    value={card.value}
                    onChange={(e) => handleCardChange(card.id, 'value', e.target.value)}
                    placeholder="Value"
                    className="rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <input
                    type="text"
                    value={card.note || ''}
                    onChange={(e) => handleCardChange(card.id, 'note', e.target.value)}
                    placeholder="Note (optional)"
                    className="rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  className="p-2 text-[var(--ink-muted)] hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>

        {config.custom_cards.length === 0 && (
          <div className="text-center py-8 text-[var(--ink-muted)]">
            <p className="text-sm">No custom cards configured.</p>
            <p className="text-xs mt-1">Click &quot;Add Card&quot; to create one.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/portal"
          className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--paper-muted)] transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PortalClient } from '@/types/portal'
import { Activity, AlertTriangle, Clock, Search, ChevronRight, Layers } from 'lucide-react'

interface KobyClientsListProps {
  clients: PortalClient[]
  isLoading?: boolean
  error?: string | null
}

function getStatusBadge(status: PortalClient['status']) {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Active
        </span>
      )
    case 'inactive':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Inactive
        </span>
      )
    case 'at_risk':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3" />
          At Risk
        </span>
      )
    case 'churned':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
          Churned
        </span>
      )
  }
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
  return volume.toString()
}

export default function KobyClientsList({ clients, isLoading, error }: KobyClientsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'at_risk'>('all')

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && client.status === 'active') ||
      (filter === 'at_risk' && client.status === 'at_risk')
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-[var(--paper-muted)] rounded-xl animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-[var(--paper-muted)] rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-3" />
        <p className="text-sm font-medium text-red-800 dark:text-red-300">Failed to load clients</p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-muted)]">Clients</p>
          <h2 className="mt-2 text-2xl font-display font-semibold text-[var(--ink)]">
            All Organizations
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-muted)]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] pb-3">
        {(['all', 'active', 'at_risk'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
                : 'text-[var(--ink-muted)] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]'
            }`}
          >
            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'At Risk'}
            {filter === f && (
              <span className="ml-2 text-xs">
                ({f === 'all' ? clients.length : filteredClients.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-12 text-center">
          <Activity className="mx-auto h-10 w-10 text-[var(--ink-muted)] mb-4" />
          <p className="text-sm font-medium text-[var(--ink)]">No clients found</p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            {searchQuery ? 'Try adjusting your search' : 'No clients match the current filter'}
          </p>
        </div>
      )}

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/portal?orgId=${client.id}`}
            className="block rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-soft)] hover:shadow-lg hover:border-[var(--ink-muted)]/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent-strong)] transition-colors">
                    {client.name}
                  </h3>
                  {getStatusBadge(client.status)}
                </div>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  {client.plan} plan
                </p>
              </div>

              {/* Metrics */}
              <div className="hidden sm:flex items-center gap-8">
                {/* Last Activity */}
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">Last Activity</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                    {client.lastActivity || 'N/A'}
                  </p>
                </div>

                {/* Sessions Today */}
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                    <Activity className="h-3.5 w-3.5" />
                    <span className="text-xs">Today</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                    {formatVolume(client.todaySessions)} sessions
                  </p>
                </div>

                {/* Sites */}
                <div className="text-center">
                  <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
                    <Layers className="h-3.5 w-3.5" />
                    <span className="text-xs">Sites</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                    {client.siteCount}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 text-[var(--ink-muted)] group-hover:text-[var(--accent-strong)] group-hover:translate-x-1 transition-all" />
            </div>

            {/* Mobile Metrics */}
            <div className="sm:hidden mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-[var(--line)]">
              <div>
                <p className="text-xs text-[var(--ink-muted)]">Last Activity</p>
                <p className="text-sm font-medium text-[var(--ink)]">{client.lastActivity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ink-muted)]">Sessions</p>
                <p className="text-sm font-medium text-[var(--ink)]">{formatVolume(client.todaySessions)}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ink-muted)]">Sites</p>
                <p className="text-sm font-bold text-[var(--ink)]">{client.siteCount}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

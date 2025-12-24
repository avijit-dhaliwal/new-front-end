const internalOrgIds = (process.env.NEXT_PUBLIC_KOBY_INTERNAL_ORG_ID || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

export const isKobyInternalOrg = (orgId?: string | null): boolean => {
  if (!orgId) return false
  return internalOrgIds.includes(orgId)
}

export const getKobyInternalOrgIds = (): string[] => [...internalOrgIds]

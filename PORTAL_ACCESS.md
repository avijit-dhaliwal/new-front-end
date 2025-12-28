# Koby AI Portal Access Control

This document describes the invite-only onboarding model and permission system for the Koby AI portal.

## Overview

The Koby AI portal uses an **invite-only access model**. Clients cannot self-register; they must be invited by Koby AI staff or their organization admin.

## Clerk Configuration Checklist

Before deploying, ensure these settings are configured in the Clerk Dashboard:

### 1. Disable Public Sign-ups
- Go to **User & Authentication > Email, Phone, Username**
- Under "Sign-up restrictions", set to **Restrict sign-ups**
- Only users with invitations can create accounts

### 2. Organization Settings
- Go to **Organizations > Settings**
- Enable "Allow members to invite others" - allows client admins to invite teammates
- Disable "Allow members to create organizations" - only staff can create orgs
- Set default org role to `client_viewer` for invited members

### 3. Define Organization Roles
Create these roles in **Organizations > Roles**:

| Role | Key | Permissions |
|------|-----|-------------|
| Client Admin | `client_admin` | Invite members, manage roles, view all data |
| Client Viewer | `client_viewer` | Read-only access to portal data |

### 4. Staff Role Configuration
Koby AI staff members are identified by their user metadata:
```json
{
  "publicMetadata": {
    "kobyRole": "staff"
  }
}
```

Set this in the Clerk Dashboard under **Users > [user] > Metadata**.

## Permission Model

### User Types

1. **Koby Staff** (`publicMetadata.kobyRole === 'staff'`)
   - Can create organizations
   - Can access any organization via `?orgId=` parameter
   - Can invite users to any organization
   - Full cross-org visibility

2. **Client Admin** (`org:client_admin` role)
   - Can invite teammates to their organization
   - Can manage roles within their organization
   - Cannot create new organizations
   - Cannot view other organizations

3. **Client Viewer** (`org:client_viewer` role)
   - Read-only access to portal data
   - Cannot invite members or change settings
   - Cannot create organizations

### Route Protection

| Route | Access Level |
|-------|-------------|
| `/portal/*` | Requires authentication + org membership (or staff) |
| `/portal/select-org` | Authenticated users only |
| `/portal?orgId=xxx` | Staff only (cross-org viewing) |
| `/portal/team` | Org members (invites require admin/staff) |
| `/portal/settings` | Org members (changes require admin/staff) |
| `/demo/*` | Public access |
| `/sign-up` | Blocked (shows invite-only message) |
| `/sign-in` | Public |

## Onboarding Flow

### Staff Onboarding a New Client

1. **Create Organization in Clerk Dashboard**
   - Go to Organizations > Create organization
   - Set organization name (client company name)
   - Note the org ID for internal reference

2. **Configure Organization Settings** (optional)
   - Set billing settings if applicable
   - Configure allowed domains
   - Set default member role

3. **Invite Client Admin**
   - Go to Organizations > [org] > Members
   - Click "Invite member"
   - Enter client admin's email
   - Set role to `client_admin`

4. **Client Receives Invitation**
   - Email sent to client with invitation link
   - Client clicks link and creates account
   - Client is automatically added to organization

5. **Client Accesses Portal**
   - Client signs in at `/sign-in`
   - If multiple orgs, selects org at `/portal/select-org`
   - Client sees their portal dashboard

### Client Admin Inviting Teammates

1. Client admin navigates to `/portal/team`
2. Uses Clerk's OrganizationProfile to invite members
3. Sets role (`client_admin` or `client_viewer`)
4. Teammate receives invitation email
5. Teammate creates account and joins org

## Security Controls

### Middleware Enforcement

The middleware (`middleware.ts`) enforces:

1. **Authentication**: All `/portal/*` routes require sign-in
2. **Organization Requirement**: Users need org membership (except staff)
3. **Cross-Org Protection**: Only staff can use `?orgId=` parameter
4. **Staff Detection**: Checks `publicMetadata.kobyRole`

### UI Enforcement

Component-level access controls:

1. **OrganizationList/OrganizationSwitcher**: Hide "Create organization" for non-staff
2. **Team page**: Hide invite button for non-admins
3. **Settings page**: Restrict configuration changes to admins/staff
4. **Sign-up page**: Replaced with invite-only message

### API Enforcement

Portal worker endpoints should verify:

1. Valid Clerk JWT token
2. User's organization membership
3. Staff status for cross-org access
4. Role-based action permissions

## Environment Variables

```bash
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# Koby internal org IDs (comma-separated)
NEXT_PUBLIC_KOBY_INTERNAL_ORG_ID=org_xxx,org_yyy
```

## Testing Access Controls

### Non-Invited User
1. Navigate to `/sign-up`
2. Should see invite-only message
3. Navigate to `/portal` directly
4. Should redirect to `/sign-in`

### Invited User (No Org)
1. Sign in at `/sign-in`
2. Should redirect to `/portal/select-org`
3. Should not see "Create organization" option

### Client User
1. Sign in and select org
2. Access `/portal` - should see dashboard
3. Try `?orgId=other_org` - should strip parameter
4. Access `/portal/team` - should see members
5. Cannot invite if `client_viewer` role

### Koby Staff
1. Sign in (has `kobyRole: 'staff'` in metadata)
2. Access `/portal` - should see portfolio view
3. Use `?orgId=xxx` - should see client portal
4. Can create organizations
5. Can invite to any org

## Future Considerations

### Self-Serve Onboarding (Deferred)
When implementing self-serve in the future:
1. Enable public sign-ups in Clerk
2. Add guided onboarding flow
3. Require Stripe subscription before activation
4. Auto-create personal organization on sign-up
5. Maintain staff override capabilities

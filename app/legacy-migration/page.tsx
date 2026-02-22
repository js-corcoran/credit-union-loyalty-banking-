import { redirect } from 'next/navigation'

// SCR-15: Legacy Migration Onboarding — redirects to canonical route
export default function LegacyMigrationPage() {
  redirect('/loyalty/migration')
}

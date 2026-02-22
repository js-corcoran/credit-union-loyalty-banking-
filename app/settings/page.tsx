'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getNotificationPreferences, updateNotificationPreferences, sendTestNotification, NotificationPreferencesResponse } from '@/lib/api'
import { Button } from '@/components/shared/Button'

interface ToggleItem {
  key: string
  label: string
  description: string
  isCritical?: boolean
}

const TIER_NOTIFICATIONS: ToggleItem[] = [
  { key: 'tierAchievement', label: 'Tier Achievement', description: 'When you reach a new tier' },
  { key: 'tierAtRisk', label: 'Tier at Risk', description: 'When your tier is at risk — 30/14 day warning', isCritical: true },
  { key: 'tierLost', label: 'Tier Lost', description: 'When you drop to a lower tier', isCritical: true },
]

const BENEFIT_NOTIFICATIONS: ToggleItem[] = [
  { key: 'benefitEarned', label: 'Benefit Earned', description: 'You saved money via fee waivers, APY boost, etc.' },
  { key: 'newBenefitsAdded', label: 'New Benefits Added', description: 'Credit union launches new benefits' },
  { key: 'benefitExpiration', label: 'Benefit Expiration', description: 'Limited-time benefits about to end' },
]

const ACCOUNT_NOTIFICATIONS: ToggleItem[] = [
  { key: 'autopayExpiring', label: 'Autopay Expiring Soon', description: 'When autopay expires in 30 days' },
  { key: 'unusualActivity', label: 'Unusual Activity', description: 'Potential fraud alerts', isCritical: true },
]

const MARKETING_NOTIFICATIONS: ToggleItem[] = [
  { key: 'newProducts', label: 'New Products', description: 'New credit union offerings' },
  { key: 'promotions', label: 'Promotions', description: 'Limited-time promotions' },
]

function Toggle({
  enabled,
  onChange,
  disabled,
  label,
}: {
  enabled: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-emerald-500' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferencesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [channelError, setChannelError] = useState<string | null>(null)
  const [testSending, setTestSending] = useState(false)

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await getNotificationPreferences('MEMBER-001')
        setPrefs(data)
      } catch {
        setToast({ message: 'Unable to load preferences.', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchPrefs()
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleToggleNotification = (category: string, key: string) => {
    if (!prefs) return
    setPrefs((prev) => {
      if (!prev) return prev
      const updated = { ...prev }
      const cat = updated.preferences[category as keyof typeof updated.preferences] as Record<string, { enabled: boolean; channels: string[] }>
      if (cat[key]) {
        cat[key] = { ...cat[key], enabled: !cat[key].enabled }
      }
      return { ...updated }
    })
    showToast('Preference saved')
  }

  const handleToggleChannel = (channel: 'inApp' | 'email' | 'sms') => {
    if (!prefs) return
    const current = prefs.deliveryChannels
    const newEnabled = !current[channel].enabled

    // Prevent disabling last channel
    if (!newEnabled) {
      const othersEnabled = Object.entries(current)
        .filter(([key]) => key !== channel)
        .some(([, val]) => val.enabled)
      if (!othersEnabled) {
        setChannelError('At least one notification channel must be enabled for critical alerts.')
        setTimeout(() => setChannelError(null), 4000)
        return
      }
    }

    setChannelError(null)
    setPrefs((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        deliveryChannels: {
          ...prev.deliveryChannels,
          [channel]: { ...prev.deliveryChannels[channel], enabled: newEnabled },
        },
      }
    })
    showToast(newEnabled ? 'Channel enabled' : 'Channel disabled')
  }

  const handleFrequencyChange = (freq: 'as-it-happens' | 'daily' | 'weekly') => {
    if (!prefs) return
    setPrefs((prev) => (prev ? { ...prev, emailFrequency: freq } : prev))
    const labels: Record<string, string> = {
      'as-it-happens': 'As it happens',
      daily: 'Daily summaries',
      weekly: 'Weekly summaries',
    }
    showToast(`Frequency updated to: ${labels[freq]}`)
  }

  const handleSave = async () => {
    if (!prefs) return
    setSaving(true)
    try {
      await updateNotificationPreferences('MEMBER-001', prefs)
      showToast('Your notification preferences have been saved.')
    } catch {
      showToast('We couldn\'t save your preferences. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTestNotification = async () => {
    setTestSending(true)
    try {
      await sendTestNotification('MEMBER-001')
      const channels: string[] = []
      if (prefs?.deliveryChannels.inApp.enabled) channels.push('in-app')
      if (prefs?.deliveryChannels.email.enabled) channels.push('email')
      if (prefs?.deliveryChannels.sms.enabled) channels.push('SMS')
      showToast(`Test notification sent to: ${channels.join(', ')}`)
    } catch {
      showToast('Failed to send test notification.', 'error')
    } finally {
      setTestSending(false)
    }
  }

  const handleReset = () => {
    if (!prefs) return
    setPrefs((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        preferences: {
          tierStatus: {
            tierAchievement: { enabled: true, channels: ['in_app', 'email'] },
            tierAtRisk: { enabled: true, channels: ['in_app', 'email', 'sms'] },
            tierLost: { enabled: true, channels: ['in_app', 'email'] },
          },
          benefits: {
            benefitEarned: { enabled: true, channels: ['in_app', 'email'] },
            newBenefitsAdded: { enabled: false, channels: [] },
            benefitExpiration: { enabled: true, channels: ['in_app', 'email'] },
          },
          account: {
            autopayExpiring: { enabled: true, channels: ['in_app', 'email'] },
            unusualActivity: { enabled: true, channels: ['in_app', 'email', 'sms'] },
          },
          marketing: {
            newProducts: { enabled: false, channels: [] },
            promotions: { enabled: false, channels: [] },
          },
        },
        deliveryChannels: {
          inApp: { enabled: true },
          email: { ...prev.deliveryChannels.email, enabled: true },
          sms: { ...prev.deliveryChannels.sms, enabled: false },
        },
        emailFrequency: 'daily',
      }
    })
    showToast('Preferences reset to defaults')
  }

  const renderNotificationSection = (
    title: string,
    items: ToggleItem[],
    category: string
  ) => {
    if (!prefs) return null
    const catPrefs = prefs.preferences[category as keyof typeof prefs.preferences] as Record<string, { enabled: boolean; channels: string[] }>

    return (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
        <div className="space-y-4">
          {items.map((item) => {
            const pref = catPrefs[item.key]
            if (!pref) return null
            return (
              <div key={item.key} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900 flex items-center gap-2">
                    {item.label}
                    {item.isCritical && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Required</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <Toggle
                  enabled={pref.enabled}
                  onChange={() => handleToggleNotification(category, item.key)}
                  disabled={item.isCritical}
                  label={`Toggle ${item.label}`}
                />
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <>
      <main className="max-w-[600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700 hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/notifications" className="hover:text-gray-700 hover:underline">Notifications</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Settings</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h1>
        <p className="text-base text-gray-600 mb-8">
          Control which notifications you receive and how
        </p>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-pulse space-y-8" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex justify-between">
                      <div>
                        <div className="h-5 w-32 bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-48 bg-gray-100 rounded" />
                      </div>
                      <div className="h-6 w-11 bg-gray-200 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && prefs && (
          <>
            {/* Critical Alert Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8" role="alert">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Important:</span> We always send tier-at-risk alerts and security notifications via at least one enabled channel. You can&apos;t disable these for your safety.
                </p>
              </div>
            </div>

            {/* Notification Type Sections */}
            {renderNotificationSection('Tier Status Notifications', TIER_NOTIFICATIONS, 'tierStatus')}
            {renderNotificationSection('Benefits Notifications', BENEFIT_NOTIFICATIONS, 'benefits')}
            {renderNotificationSection('Account Notifications', ACCOUNT_NOTIFICATIONS, 'account')}
            {renderNotificationSection('Marketing & News', MARKETING_NOTIFICATIONS, 'marketing')}

            {/* Delivery Channels */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">How would you like to receive notifications?</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-900">In-App Notifications</p>
                    <p className="text-sm text-gray-500">See alerts in your notification center</p>
                  </div>
                  <Toggle
                    enabled={prefs.deliveryChannels.inApp.enabled}
                    onChange={() => handleToggleChannel('inApp')}
                    label="Toggle in-app notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{prefs.deliveryChannels.email.address}</p>
                  </div>
                  <Toggle
                    enabled={prefs.deliveryChannels.email.enabled}
                    onChange={() => handleToggleChannel('email')}
                    label="Toggle email notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-900">SMS Text Message</p>
                    <p className="text-sm text-gray-500">
                      {prefs.deliveryChannels.sms.enabled
                        ? prefs.deliveryChannels.sms.phone
                        : 'Standard message rates may apply'}
                    </p>
                  </div>
                  <Toggle
                    enabled={prefs.deliveryChannels.sms.enabled}
                    onChange={() => handleToggleChannel('sms')}
                    label="Toggle SMS notifications"
                  />
                </div>
              </div>

              {channelError && (
                <p className="mt-3 text-sm text-red-600 font-medium" role="alert">{channelError}</p>
              )}
            </section>

            {/* Email Frequency */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Email frequency</h2>
              <p className="text-sm text-gray-500 mb-3">
                Critical alerts (tier changes, security) are always sent immediately.
              </p>
              <div className="space-y-2">
                {([
                  { value: 'as-it-happens', label: 'As it happens' },
                  { value: 'daily', label: 'Daily summary' },
                  { value: 'weekly', label: 'Weekly summary' },
                ] as const).map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer min-h-[48px] transition-colors ${
                      prefs.emailFrequency === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!prefs.deliveryChannels.email.enabled ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name="emailFrequency"
                      value={opt.value}
                      checked={prefs.emailFrequency === opt.value}
                      onChange={() => handleFrequencyChange(opt.value)}
                      disabled={!prefs.deliveryChannels.email.enabled}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-base text-gray-900">{opt.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleTestNotification}
                disabled={testSending}
              >
                {testSending ? 'Sending...' : 'Send Test Notification'}
              </Button>
              <button
                onClick={handleReset}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 hover:underline font-medium min-h-[48px] inline-flex items-center justify-center"
              >
                Reset to defaults
              </button>
            </div>
          </>
        )}
      </main>
    </>
  )
}

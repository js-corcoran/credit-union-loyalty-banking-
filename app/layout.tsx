import type { Metadata } from 'next'
import '@/styles/globals.css'
import { MemberProvider } from '@/context/MemberContext'
import { TierProvider } from '@/context/TierContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { TransferProvider } from '@/context/TransferContext'
import { LoyaltyTransferProvider } from '@/context/LoyaltyTransferContext'
import { NavigationShell } from '@/components/navigation/NavigationShell'

export const metadata: Metadata = {
  title: 'Home - Credit Union Banking',
  description: 'Three-tier loyalty program for credit union members',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <MemberProvider>
          <TierProvider>
            <NotificationProvider>
              <TransferProvider>
                <LoyaltyTransferProvider>
                  <NavigationShell>
                    {children}
                  </NavigationShell>
                </LoyaltyTransferProvider>
              </TransferProvider>
            </NotificationProvider>
          </TierProvider>
        </MemberProvider>
      </body>
    </html>
  )
}

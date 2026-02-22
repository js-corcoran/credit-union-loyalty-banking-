import { NavigationConfig } from './types'

/**
 * Navigation configuration mapping all 17 screens to 5 primary sections.
 * Routes adapted to match the actual codebase (not spec idealized routes).
 */
export const NAVIGATION_CONFIG: NavigationConfig = {
  sections: [
    {
      id: 'home',
      label: 'Home',
      route: '/',
      icon: 'home',
      screens: ['SCR-01', 'SCR-08', 'SCR-09'],
      routePrefixes: ['/accounts', '/transactions'],
      visible: true,
    },
    {
      id: 'loyalty',
      label: 'Loyalty',
      route: '/loyalty',
      icon: 'gift',
      screens: ['SCR-02', 'SCR-03', 'SCR-04', 'SCR-05', 'SCR-06'],
      routePrefixes: ['/loyalty'],
      visible: true,
    },
    {
      id: 'move-money',
      label: 'Move Money',
      route: '/transfer',
      icon: 'send',
      screens: ['SCR-10', 'SCR-11', 'SCR-12', 'SCR-13', 'SCR-14'],
      routePrefixes: ['/transfer', '/autopay'],
      visible: true,
    },
    {
      id: 'loans',
      label: 'Loans',
      route: '/loans',
      icon: 'trending-down',
      screens: ['SCR-12'],
      routePrefixes: ['/loans'],
      visible: true,
    },
  ],
  moreMenuItems: [
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: 'settings',
      description: 'Account preferences and security',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      route: '/notifications',
      icon: 'bell',
      description: 'Alerts and notification preferences',
    },
    {
      id: 'help',
      label: 'Help & FAQ',
      route: '/help',
      icon: 'help-circle',
      description: 'Support and frequently asked questions',
    },
  ],
}

export const loyaltyTransferTokens = {
  colors: {
    bannerBg: '#f0fdf4',
    bannerBorder: '#16a34a',
    bannerText: '#1f2937',

    preFilledBg: '#f3f4f6',
    preFilledBorder: '#0891b2',
    preFilledText: '#111827',

    warningBg: '#fefce8',
    warningBorder: '#ca8a04',
    warningText: '#78350f',

    successBg: '#dcfce7',
    successBorder: '#22c55e',
    successText: '#166534',

    errorBg: '#fee2e2',
    errorBorder: '#dc2626',
    errorText: '#7f1d1d',
  },

  typography: {
    bannerFont: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.5',
    },
    fieldLabelFont: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    fieldHelpFont: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    buttonFont: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.5',
    },
  },

  spacing: {
    bannerPadding: '16px 20px',
    bannerGap: '12px',
    fieldGap: '12px',
    sectionGap: '20px',
    buttonGap: '12px',
  },

  sizes: {
    bannerHeight: '64px',
    bannerIconSize: '24px',
    dismissButtonSize: '32px',
    fieldHeight: '48px',
    buttonHeight: '48px',
    buttonPadding: '12px 24px',
  },

  borderRadius: {
    banner: '8px',
    field: '6px',
    button: '6px',
  },
} as const

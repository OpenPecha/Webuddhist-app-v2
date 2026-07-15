export const dialogColors = {
  surface: '#FDFDFC',
  border: '#e8e8e4',
  destructive: '#f87171',
  text: '#000',
  textSecondary: '#8a8a8a',
  backdrop: 'rgba(0,0,0,0.4)',
} as const;

export const dialogLayout = {
  radiusCard: 16,
  radiusButton: 30,
  buttonHeight: 48,
  paddingCard: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
} as const;

export const dialogTypography = {
  title: {
    fontSize: 17,
    fontWeight: '700' as const,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
    color: dialogColors.text,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter-Regular',
    color: dialogColors.text,
  },
  button: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
};

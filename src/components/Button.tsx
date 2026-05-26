import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../styles/theme';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[`${variant}Button` as keyof typeof styles] as ViewStyle,
    styles[`${size}Button` as keyof typeof styles] as ViewStyle,
    ...(fullWidth ? [styles.fullWidth] : []),
    ...(disabled || loading ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.primary}
          style={styles.loader}
        />
      )}
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  smallButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 6,
    height: 32,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: 10,
    height: 44,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    height: 56,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '500',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  dangerText: {
    color: theme.colors.white,
  },
  smallText: {
    fontSize: theme.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.fontSize.base,
  },
  largeText: {
    fontSize: theme.fontSize.lg,
  },
  loader: {
    marginRight: theme.spacing.sm,
  },
});

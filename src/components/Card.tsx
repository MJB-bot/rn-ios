import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  hoverable = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[styles.card, hoverable && styles.hoverable, style]}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  hoverable: {
    ...theme.shadows.md,
  },
});

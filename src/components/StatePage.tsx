import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { theme } from '../styles/theme';

interface StatePageProps {
  type: 'loading' | 'empty' | 'error';
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const config = {
  loading: {
    title: '加载中',
    description: '请稍候...',
  },
  empty: {
    title: '当前列表为空',
    description: '暂无数据',
  },
  error: {
    title: '网络错误',
    description: '请检查网络连接后重试',
  },
};

export const StatePage: React.FC<StatePageProps> = ({
  type,
  title,
  description,
  onRetry,
}) => {
  const { title: defaultTitle, description: defaultDescription } = config[type];

  return (
    <View style={styles.container}>
      {type === 'loading' ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={styles.iconContainer}>
          <Ionicons
            name={type === 'empty' ? 'folder-open-outline' : 'cloud-offline-outline'}
            size={48}
            color={type === 'empty' ? '#D1D5DB' : '#FCA5A5'}
          />
        </View>
      )}
      <Text style={styles.title}>{title || defaultTitle}</Text>
      <Text style={styles.description}>{description || defaultDescription}</Text>
      {type === 'error' && onRetry && (
        <View style={styles.buttonContainer}>
          <Button onPress={onRetry} size="medium">
            重试
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101928',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6A7282',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
});

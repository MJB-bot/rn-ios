import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { theme } from '../styles/theme';

interface AlertProps {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF4D4F" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttons}>
            <View style={styles.buttonWrapper}>
              <Button
                variant="secondary"
                onPress={onCancel}
                fullWidth
                size="medium"
              >
                {cancelText}
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
                onPress={onConfirm}
                fullWidth
                size="medium"
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 40,
    alignItems: 'center',
    width: 300,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101928',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6A7282',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const NavBar: React.FC<NavBarProps> = ({ title, onBack, rightAction }) => {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#101928" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  side: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    color: '#101928',
    textAlign: 'center',
  },
});

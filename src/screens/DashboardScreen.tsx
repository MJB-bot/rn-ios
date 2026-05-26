import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ employee_count: 0, category_count: 0, device_count: 0 });

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        try {
          const res: any = await dashboardAPI.getStats();
          if (res.success) {
            setStats(res.data);
          }
        } catch {
          // keep defaults
        }
      })();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1677FF" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
          <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>企业办公助手</Text>
              <Text style={styles.headerSubtitle}>管理员工作台</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.employee_count}</Text>
              <Text style={styles.statLabel}>员工总数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.category_count}</Text>
              <Text style={styles.statLabel}>分类数量</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.device_count}</Text>
              <Text style={styles.statLabel}>设备数量</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="people-outline"
              title="员工管理"
              subtitle="管理员工信息"
              color="#E6F4FF"
              iconColor="#1677FF"
              onPress={() => navigation.navigate('EmployeeList')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="folder-outline"
              title="分类管理"
              subtitle="管理设备分类"
              color="#FFF7E6"
              iconColor="#FA8C16"
              onPress={() => navigation.navigate('CategoryList')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="hardware-chip-outline"
              title="设备管理"
              subtitle="管理设备信息"
              color="#F0F5FF"
              iconColor="#1677FF"
              onPress={() => navigation.navigate('DeviceList')}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>快速操作</Text>
            </View>
            <View style={styles.activityCard}>
              <ActivityItem icon="person-add-outline" text="新增员工" color="#52C41A" bg="#F0FDF4" onPress={() => navigation.navigate('EmployeeForm')} />
              <ActivityItem icon="folder-outline" text="新增分类" color="#FA8C16" bg="#FFF7ED" onPress={() => navigation.navigate('CategoryForm')} />
              <ActivityItem icon="hardware-chip-outline" text="新增设备" color="#1677FF" bg="#E6F4FF" onPress={() => navigation.navigate('DeviceForm')} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  iconColor: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, color, iconColor, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

interface ActivityItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  bg: string;
  onPress: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, text, color, bg, onPress }) => (
  <TouchableOpacity style={styles.activityItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.activityContent}>
      <View style={[styles.dot, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <Text style={styles.activityText}>{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1677FF' },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  containerContent: { backgroundColor: '#F5F8FA', minHeight: '100%' },
  header: { backgroundColor: '#1677FF', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  logoutButton: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14, padding: 16, alignItems: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  content: { paddingHorizontal: 20, marginTop: -16, paddingBottom: 24 },
  menuCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: {
    width: 44, height: 44, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#101928' },
  menuSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 72 },
  section: { marginTop: 20 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#101928' },
  activityCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#F3F4F6', padding: 16,
  },
  activityItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  activityContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: {
    width: 28, height: 28, borderRadius: 8, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  activityText: { fontSize: 14, color: '#101928', flex: 1 },
});

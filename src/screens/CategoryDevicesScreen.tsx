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
import { NavBar } from '../components/NavBar';
import { StatePage } from '../components/StatePage';
import { categoryAPI } from '../services/api';

interface CategoryDevicesScreenProps {
  navigation: any;
  route: any;
}

export const CategoryDevicesScreen: React.FC<CategoryDevicesScreenProps> = ({ navigation, route }) => {
  const categoryId = route.params?.id;
  const [category, setCategory] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await categoryAPI.getDevices(categoryId);
      setCategory(res.data.category);
      setDevices(res.data.devices);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation, categoryId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
        <NavBar title="分类设备" onBack={() => navigation.goBack()} />
        <StatePage type="loading" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
        <NavBar title="分类设备" onBack={() => navigation.goBack()} />
        <StatePage type="error" description={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  const categoryName = category?.name || route.params?.name || '分类设备';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
      <NavBar title="分类设备列表" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {devices.length === 0 ? (
          <StatePage type="empty" description="该分类下暂无设备" />
        ) : (
          <View style={styles.list}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DeviceForm', { id: device.id, name: device.name, model: device.model || '', category_id: device.category_id })}
              >
                <View style={styles.deviceIcon}>
                  <Ionicons name="hardware-chip-outline" size={22} color="#1677FF" />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceMeta}>
                    {device.model || '-'} {device.category_name ? `· ${device.category_name}` : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>{categoryName}</Text>
        <Text style={styles.footerSubtitle}>共 {devices.length} 台设备</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  list: { gap: 12 },
  deviceCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F3F4F6',
  },
  deviceIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#E6F4FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 15, fontWeight: '500', color: '#101928', marginBottom: 2 },
  deviceMeta: { fontSize: 13, color: '#9CA3AF' },
  footer: {
    paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1,
    borderTopColor: '#F3F4F6', backgroundColor: '#FFFFFF',
  },
  footerTitle: { fontSize: 14, fontWeight: '600', color: '#101928' },
  footerSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
});

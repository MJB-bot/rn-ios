import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert as RNAlert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavBar } from '../components/NavBar';
import { StatePage } from '../components/StatePage';
import { deviceAPI } from '../services/api';

interface DeviceListScreenProps {
  navigation: any;
}

export const DeviceListScreen: React.FC<DeviceListScreenProps> = ({ navigation }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchDevices = useCallback(async (s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await deviceAPI.getList({ page: 1, page_size: pageSize, name: s || undefined });
      setDevices(res.data.list);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDevices(search);
    });
    return unsubscribe;
  }, [navigation, fetchDevices, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevices(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchDevices]);

  const handleDelete = (id: number, name: string) => {
    RNAlert.alert('确认删除', `确定要删除设备「${name}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deviceAPI.delete(id);
            fetchDevices(search);
          } catch (err: any) {
            RNAlert.alert('错误', err.message || '删除失败');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
      <NavBar title="设备管理" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#99A1AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索设备名称"
            placeholderTextColor="#99A1AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <StatePage type="loading" />
        ) : error ? (
          <StatePage type="error" description={error} onRetry={() => fetchDevices(search)} />
        ) : devices.length === 0 ? (
          <StatePage type="empty" description="暂无设备数据" />
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
                    {device.model || '-'} · {device.category_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DeviceForm', { id: device.id, name: device.name, model: device.model || '', category_id: device.category_id })}
                  style={styles.editTouch}
                >
                  <Ionicons name="create-outline" size={18} color="#6A7282" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(device.id, device.name)} style={styles.deleteTouch}>
                  <Ionicons name="trash-outline" size={18} color="#FF4D4F" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('DeviceForm')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 16, height: 50, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#101928', paddingVertical: 0 },
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
  deviceName: { fontSize: 15, fontWeight: '600', color: '#101928', marginBottom: 2 },
  deviceMeta: { fontSize: 13, color: '#9CA3AF' },
  editTouch: { padding: 6, marginRight: 2 },
  deleteTouch: { padding: 6 },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56,
    borderRadius: 16, backgroundColor: '#1677FF', alignItems: 'center',
    justifyContent: 'center', shadowColor: '#1677FF',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 8, elevation: 8,
  },
});

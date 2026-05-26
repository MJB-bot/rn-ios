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
import { employeeAPI } from '../services/api';

interface EmployeeListScreenProps {
  navigation: any;
}

const AVATAR_COLORS = ['#1677FF', '#52C41A', '#FA8C16', '#722ED1'];

export const EmployeeListScreen: React.FC<EmployeeListScreenProps> = ({ navigation }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchEmployees = useCallback(async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await employeeAPI.getList({ page: p, page_size: pageSize, name: s || undefined });
      setEmployees(res.data.list);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEmployees(page, search);
    });
    return unsubscribe;
  }, [navigation, fetchEmployees, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchEmployees(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchEmployees]);

  const handleDelete = (id: number, name: string) => {
    RNAlert.alert('确认删除', `确定要删除员工「${name}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await employeeAPI.delete(id);
            fetchEmployees(page, search);
          } catch (err: any) {
            RNAlert.alert('错误', err.message || '删除失败');
          }
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
      <NavBar title="员工管理" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#99A1AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索员工姓名"
            placeholderTextColor="#99A1AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <StatePage type="loading" />
        ) : error ? (
          <StatePage type="error" description={error} onRetry={() => fetchEmployees(page, search)} />
        ) : employees.length === 0 ? (
          <StatePage type="empty" description="暂无员工数据" />
        ) : (
          <View style={styles.list}>
            {employees.map((employee, index) => (
              <TouchableOpacity
                key={employee.id}
                style={styles.employeeCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('EmployeeDetail', { id: employee.id })}
              >
                <View style={styles.employeeHeader}>
                  <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
                    <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={14} color="#9CA3AF" style={styles.infoIcon} />
                      <Text style={styles.infoText}>{employee.age} 岁</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="mail-outline" size={14} color="#9CA3AF" style={styles.infoIcon} />
                      <Text style={styles.infoText} numberOfLines={1}>{employee.email}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => navigation.navigate('EmployeeDetail', { id: employee.id })}
                  >
                    <Ionicons name="eye-outline" size={14} color="#1677FF" style={styles.actionIcon} />
                    <Text style={[styles.actionText, styles.viewText]}>查看</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EmployeeForm', { id: employee.id, name: employee.name, age: employee.age, email: employee.email })}
                  >
                    <Ionicons name="create-outline" size={14} color="#364153" style={styles.actionIcon} />
                    <Text style={[styles.actionText, styles.editText]}>编辑</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(employee.id, employee.name)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#FF4D4F" style={styles.actionIcon} />
                    <Text style={[styles.actionText, styles.deleteText]}>删除</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EmployeeForm')}
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
  employeeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  employeeHeader: { flexDirection: 'row', marginBottom: 16 },
  avatar: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  employeeInfo: { flex: 1, justifyContent: 'center' },
  employeeName: { fontSize: 18, fontWeight: '600', lineHeight: 24, color: '#101828', marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  infoIcon: { marginRight: 4 },
  infoText: { fontSize: 14, lineHeight: 20, color: '#6A7282', flex: 1 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: 70, height: 32, borderRadius: 10,
  },
  viewButton: { backgroundColor: '#E6F4FF' },
  editButton: { backgroundColor: '#F3F4F6' },
  deleteButton: { backgroundColor: '#FFF1F0' },
  actionIcon: { marginRight: 2 },
  actionText: { fontSize: 14 },
  viewText: { color: '#1677FF' },
  editText: { color: '#364153' },
  deleteText: { color: '#FF4D4F' },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56,
    borderRadius: 16, backgroundColor: '#1677FF', alignItems: 'center',
    justifyContent: 'center', shadowColor: '#1677FF',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 8, elevation: 8,
  },
});

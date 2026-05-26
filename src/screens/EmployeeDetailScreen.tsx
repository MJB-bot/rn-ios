import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { StatePage } from '../components/StatePage';
import { employeeAPI } from '../services/api';

interface EmployeeDetailScreenProps {
  navigation: any;
  route: any;
}

export const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({ navigation, route }) => {
  const employeeId = route.params?.id;
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await employeeAPI.getById(employeeId);
      setEmployee(res.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEmployee();
    });
    return unsubscribe;
  }, [navigation, employeeId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeAPI.delete(employeeId);
      setShowDeleteAlert(false);
      navigation.goBack();
    } catch (err: any) {
      setShowDeleteAlert(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
        <NavBar title="员工详情" onBack={() => navigation.goBack()} />
        <StatePage type="loading" />
      </SafeAreaView>
    );
  }

  if (error || !employee) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
        <NavBar title="员工详情" onBack={() => navigation.goBack()} />
        <StatePage type="error" description={error || '员工不存在'} onRetry={fetchEmployee} />
      </SafeAreaView>
    );
  }

  const initials = employee.name ? employee.name.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
      <NavBar title="员工详情" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{employee.name}</Text>
              <Text style={styles.subtitle}>ID: {employee.id}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={16} color="#9CA3AF" />
              <Text style={styles.infoLabel}>年龄</Text>
              <Text style={styles.infoValue}>{employee.age} 岁</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={16} color="#9CA3AF" />
              <Text style={styles.infoLabel}>邮箱</Text>
              <Text style={styles.infoValue}>{employee.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text style={styles.infoLabel}>创建时间</Text>
              <Text style={styles.infoValue}>{employee.created_at}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <View style={styles.buttonWrapper}>
          <Button
            variant="primary"
            onPress={() => navigation.navigate('EmployeeForm', { id: employee.id, name: employee.name, age: String(employee.age), email: employee.email })}
            fullWidth
            size="large"
          >
            编辑
          </Button>
        </View>
        <View style={styles.buttonWrapper}>
          <Button variant="danger" onPress={() => setShowDeleteAlert(true)} fullWidth size="large">
            删除
          </Button>
        </View>
      </View>

      <Alert
        visible={showDeleteAlert}
        title="删除"
        description="确定要删除该员工吗？删除后数据将无法恢复。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteAlert(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 64, height: 64, borderRadius: 18, backgroundColor: '#1677FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '700', color: '#101928', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6A7282' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  infoGrid: { gap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { fontSize: 14, color: '#9CA3AF', marginLeft: 8, width: 80 },
  infoValue: { fontSize: 14, color: '#101928', marginLeft: 8, flex: 1 },
  bottomButtons: { flexDirection: 'row', padding: 20, gap: 12 },
  buttonWrapper: { flex: 1 },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert as RNAlert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavBar } from '../components/NavBar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { employeeAPI } from '../services/api';

interface EmployeeFormScreenProps {
  navigation: any;
  route: any;
}

export const EmployeeFormScreen: React.FC<EmployeeFormScreenProps> = ({ navigation, route }) => {
  const isEdit = !!route.params?.id;

  const [name, setName] = useState(route.params?.name || '');
  const [age, setAge] = useState(route.params?.age || '');
  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return '姓名不能为空';
    if (name.trim().length > 20) return '姓名长度不能超过20个字符';
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 60) return '年龄范围18~60';
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email.trim())) return '邮箱格式不正确';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      RNAlert.alert('提示', err);
      return;
    }

    setLoading(true);
    try {
      const data = { name: name.trim(), age: parseInt(age, 10), email: email.trim() };
      if (isEdit) {
        await employeeAPI.update(route.params.id, data);
      } else {
        await employeeAPI.create(data);
      }
      navigation.goBack();
    } catch (err: any) {
      RNAlert.alert('错误', err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />
      <NavBar title={isEdit ? '编辑员工' : '新增员工'} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Input
            label="姓名"
            placeholder="请输入员工姓名"
            value={name}
            onChangeText={setName}
            icon={<Ionicons name="person-outline" size={18} color="#9A9FA9" />}
          />
          <Input
            label="年龄"
            placeholder="请输入年龄 (18-60)"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            icon={<Ionicons name="calendar-outline" size={18} color="#9A9FA9" />}
          />
          <Input
            label="邮箱"
            placeholder="请输入邮箱地址"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color="#9A9FA9" />}
          />
        </View>

        <View style={styles.buttons}>
          <View style={styles.buttonWrapper}>
            <Button onPress={handleSave} loading={loading} fullWidth size="large">
              保存
            </Button>
          </View>
          <View style={styles.buttonWrapper}>
            <Button variant="secondary" onPress={() => navigation.goBack()} fullWidth size="large">
              取消
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: '#F3F4F6', gap: 16,
  },
  buttons: { flexDirection: 'row', marginTop: 24, gap: 12 },
  buttonWrapper: { flex: 1 },
});

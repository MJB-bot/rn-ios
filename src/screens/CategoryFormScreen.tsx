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
import { categoryAPI } from '../services/api';

interface CategoryFormScreenProps {
  navigation: any;
  route: any;
}

export const CategoryFormScreen: React.FC<CategoryFormScreenProps> = ({
  navigation,
  route,
}) => {
  const isEdit = !!route.params?.id;
  const existingName = route.params?.name || '';

  const [name, setName] = useState(existingName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      RNAlert.alert('提示', '分类名称不能为空');
      return;
    }
    if (name.trim().length > 20) {
      RNAlert.alert('提示', '分类名称不能超过20个字符');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await categoryAPI.update(route.params.id, { name: name.trim() });
      } else {
        await categoryAPI.create({ name: name.trim() });
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
      <NavBar
        title={isEdit ? '编辑分类' : '新增分类'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Input
            label="分类名称"
            placeholder="请输入分类名称"
            value={name}
            onChangeText={setName}
            icon={<Ionicons name="folder-outline" size={18} color="#9A9FA9" />}
          />
        </View>

        <View style={styles.buttons}>
          <View style={styles.buttonWrapper}>
            <Button onPress={handleSave} loading={loading} fullWidth size="large">
              保存
            </Button>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              variant="secondary"
              onPress={() => navigation.goBack()}
              fullWidth
              size="large"
            >
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  buttons: { flexDirection: 'row', marginTop: 24, gap: 12 },
  buttonWrapper: { flex: 1 },
});

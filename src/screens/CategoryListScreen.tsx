import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert as RNAlert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { StatePage } from '../components/StatePage';
import { categoryAPI } from '../services/api';

interface CategoryListScreenProps {
  navigation: any;
}

const CATEGORY_COLORS = ['#1677FF', '#52C41A', '#FA8C16', '#722ED1'];

export const CategoryListScreen: React.FC<CategoryListScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await categoryAPI.getList();
      setCategories(res.data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCategories);
    return unsubscribe;
  }, [navigation, fetchCategories]);

  const handleDelete = (id: number, name: string) => {
    RNAlert.alert('确认删除', `确定要删除分类「${name}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await categoryAPI.delete(id);
            fetchCategories();
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
      <NavBar title="分类管理" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Button onPress={() => navigation.navigate('CategoryForm')} fullWidth size="large">
          新增分类
        </Button>

        {loading ? (
          <StatePage type="loading" />
        ) : error ? (
          <StatePage type="error" description={error} onRetry={fetchCategories} />
        ) : categories.length === 0 ? (
          <StatePage type="empty" description="暂无分类数据" />
        ) : (
          <View style={styles.list}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CategoryDevices', { id: category.id, name: category.name })}
              >
                <View style={[styles.iconBox, { backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] + '14' }]}>
                  <Ionicons name="folder-outline" size={24} color={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{category.device_count}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CategoryForm', { id: category.id, name: category.name })}
                  style={styles.editTouch}
                >
                  <Ionicons name="create-outline" size={18} color="#6A7282" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(category.id, category.name)} style={styles.deleteTouch}>
                  <Ionicons name="trash-outline" size={18} color="#FF4D4F" />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F8FA' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  list: { marginTop: 16, gap: 12 },
  categoryCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F3F4F6',
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#101928' },
  countBadge: {
    backgroundColor: '#F3F4F6', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4, marginRight: 4,
  },
  countText: { fontSize: 13, fontWeight: '500', color: '#364153' },
  editTouch: { padding: 6, marginRight: 2 },
  deleteTouch: { padding: 6, marginRight: 4 },
});

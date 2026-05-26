import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert as RNAlert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavBar } from '../components/NavBar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { deviceAPI, categoryAPI } from '../services/api';

interface DeviceFormScreenProps {
  navigation: any;
  route: any;
}

export const DeviceFormScreen: React.FC<DeviceFormScreenProps> = ({ navigation, route }) => {
  const isEdit = !!route.params?.id;

  const [name, setName] = useState(route.params?.name || '');
  const [model, setModel] = useState(route.params?.model || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(route.params?.category_id || null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await categoryAPI.getList();
        setCategories(res.data);
      } catch {
        // ignore
      }
    })();
  }, []);

  const validate = (): string | null => {
    if (!name.trim()) return '设备名称不能为空';
    if (name.trim().length > 100) return '设备名称不能超过100个字符';
    if (model.trim().length > 100) return '型号不能超过100个字符';
    if (!categoryId) return '请选择分类';
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
      const data = {
        name: name.trim(),
        model: model.trim() || '',
        category_id: categoryId!,
      };
      if (isEdit) {
        await deviceAPI.update(route.params.id, data);
      } else {
        await deviceAPI.create(data);
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
      <NavBar title={isEdit ? '编辑设备' : '新增设备'} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Input
            label="设备名称"
            placeholder="请输入设备名称"
            value={name}
            onChangeText={setName}
            icon={<Ionicons name="hardware-chip-outline" size={18} color="#9A9FA9" />}
          />
          <Input
            label="设备型号"
            placeholder="请输入设备型号（可选）"
            value={model}
            onChangeText={setModel}
            icon={<Ionicons name="document-text-outline" size={18} color="#9A9FA9" />}
          />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>分类</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="folder-outline" size={18} color="#9A9FA9" style={styles.pickerIcon} />
              <Text style={[styles.pickerText, !categoryId && styles.pickerPlaceholder]}>
                {categoryId ? categories.find(c => c.id === categoryId)?.name || '未知分类' : '请选择分类'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Modal visible={showCategoryPicker} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>选择分类</Text>
                  <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                    <Ionicons name="close" size={24} color="#101928" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.categoryItem, categoryId === item.id && styles.categoryItemActive]}
                      onPress={() => {
                        setCategoryId(item.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View style={styles.categoryItemLeft}>
                        <View style={styles.categoryDot}>
                          <Ionicons name="folder-outline" size={16} color="#1677FF" />
                        </View>
                        <Text style={[styles.categoryItemText, categoryId === item.id && styles.categoryItemTextActive]}>
                          {item.name}
                        </Text>
                      </View>
                      {categoryId === item.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#1677FF" />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
                />
              </View>
            </View>
          </Modal>
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
  fieldContainer: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#364153' },
  pickerButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14,
    paddingHorizontal: 16, height: 50,
  },
  pickerIcon: { marginRight: 8 },
  pickerText: { flex: 1, fontSize: 16, color: '#101928' },
  pickerPlaceholder: { color: '#99A1AF' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '60%', paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#101928' },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  categoryItemActive: { backgroundColor: '#E6F4FF' },
  categoryItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryDot: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#E6F4FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  categoryItemText: { fontSize: 16, color: '#101928' },
  categoryItemTextActive: { color: '#1677FF', fontWeight: '600' },
  modalDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 68 },
});

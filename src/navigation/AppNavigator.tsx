import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EmployeeListScreen } from '../screens/EmployeeListScreen';
import { EmployeeDetailScreen } from '../screens/EmployeeDetailScreen';
import { EmployeeFormScreen } from '../screens/EmployeeFormScreen';
import { CategoryListScreen } from '../screens/CategoryListScreen';
import { CategoryFormScreen } from '../screens/CategoryFormScreen';
import { CategoryDevicesScreen } from '../screens/CategoryDevicesScreen';
import { DeviceListScreen } from '../screens/DeviceListScreen';
import { DeviceFormScreen } from '../screens/DeviceFormScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F8FA' }}>
        <ActivityIndicator size="large" color="#1677FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
          <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
          <Stack.Screen name="EmployeeForm" component={EmployeeFormScreen} />
          <Stack.Screen name="CategoryList" component={CategoryListScreen} />
          <Stack.Screen name="CategoryForm" component={CategoryFormScreen} />
          <Stack.Screen name="CategoryDevices" component={CategoryDevicesScreen} />
          <Stack.Screen name="DeviceList" component={DeviceListScreen} />
          <Stack.Screen name="DeviceForm" component={DeviceFormScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

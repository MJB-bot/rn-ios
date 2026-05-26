import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert as RNAlert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../contexts/AuthContext";

const BG_GRADIENT: readonly [string, string, ...string[]] = [
  "#F0F5FF", "#F2F6FF", "#F4F8FF", "#F6F9FF",
  "#F9FBFF", "#FBFDFF", "#FDFEFF", "#FFFFFF",
] as const;

const BG_LOCATIONS: readonly [number, number, ...number[]] = [
  0, 0.14, 0.29, 0.43, 0.57, 0.71, 0.86, 1,
] as const;

// 涓巉igma 璁捐绋夸竴镊寸殑浜虹墿锲炬爣
const PersonIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M14.25 15.75V14.25C14.25 13.4544 13.9339 12.6913 13.3713 12.1287C12.8087 11.5661 12.0456 11.25 11.25 11.25H6.75C5.95435 11.25 5.19129 11.5661 4.62868 12.1287C4.06607 12.6913 3.75 13.4544 3.75 14.25V15.75"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 涓巉igma 璁捐绋夸竴镊寸殑阌佸浘镙?
const LockIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25"
      stroke="#99A1AF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username) newErrors.username = "请输入用户名";
    if (!password) newErrors.password = "请输入密码";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      RNAlert.alert("登录失败", err.message || "用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <LinearGradient colors={[...BG_GRADIENT]} locations={[...BG_LOCATIONS]} style={styles.bg} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[
                  "#1677FF", "#1575FC", "#1472F9", "#1370F6",
                  "#126DF3", "#116BF0", "#1069ED", "#0F66EA",
                  "#0E64E7", "#0D62E5", "#0C5FE2", "#0B5DDF",
                  "#0A5ADC", "#0958D9",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logo}
              >
                <Svg width={40} height={40} viewBox="0 0 64 64" fill="none">
                  <Path
                    d="M32 5L16 16V37C16 47.54 22.56 57.42 32 60C41.44 57.42 48 47.54 48 37V16L32 5Z"
                    fill="white"
                  />
                </Svg>
              </LinearGradient>
            </View>

            <Text style={styles.title}>企业办公助手</Text>
            <Text style={styles.subtitle}>管理员登录</Text>

            <View style={styles.form}>
              <Input
                label="用户名"
                placeholder="请输入用户名"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                error={errors.username}
                icon={<PersonIcon />}
              />

              <Input
                label="密码"
                placeholder="请输入密码"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                error={errors.password}
                icon={<LockIcon />}
              />

              <View style={styles.buttonWrap}>
                <Button onPress={handleLogin} loading={loading} fullWidth size="large">
                  登录
                </Button>
              </View>
            </View>

            <Text style={styles.footer}>© 2026 企业办公助手 v1.0.0</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F5FF" },
  bg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  safeArea: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    // Figma double shadow approximation: 0px 4px 6px -4px + 0px 10px 15px -3px
    shadowColor: "#1677FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    color: "#101828",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "#6A7282",
    textAlign: "center",
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  buttonWrap: {
    paddingTop: 8,
  },
  footer: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: "#99A1AF",
    textAlign: "center",
    paddingTop: 24,
  },
});

# React Native 项目运行指南

## 环境要求

### 必需工具

1. **Node.js** (v18+)
   ```bash
   node --version  # 检查版本
   ```

2. **npm** 或 **yarn**
   ```bash
   npm --version
   ```

3. **Expo CLI**（可选，推荐用于快速开发）
   ```bash
   npm install -g expo-cli
   ```

### iOS 开发（仅 macOS）

1. **Xcode** (14+)
   - 从 App Store 安装
   - 安装 Command Line Tools

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### Android 开发

1. **Android Studio**
   - 下载并安装
   - 安装 Android SDK (API 33+)
   - 配置环境变量：
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

2. **Java Development Kit (JDK 17)**
   ```bash
   java -version
   ```

## 快速开始

### 方式一：使用 Expo（推荐新手）

1. **进入项目目录**
   ```bash
   cd react-native-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   ```

4. **在设备上运行**
   - 手机安装 **Expo Go** App
   - 扫描终端显示的二维码
   - 或按 `i` 打开 iOS 模拟器
   - 或按 `a` 打开 Android 模拟器

### 方式二：不使用 Expo（原生开发）

1. **初始化 React Native CLI 项目**（如果是从 Expo 迁移）
   ```bash
   npx react-native init EnterpriseApp --template react-native-template-typescript
   ```

2. **复制源代码**
   - 将 `src/` 目录复制到新项目
   - 安装相同的依赖

3. **iOS 运行**
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

4. **Android 运行**
   ```bash
   npx react-native run-android
   ```

## 连接后端 API

### 1. 配置 API 地址

编辑 `src/services/api.ts`：

```typescript
const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

**注意事项：**
- iOS 模拟器：使用 `http://localhost:5000`
- Android 模拟器：使用 `http://10.0.2.2:5000`
- 真机调试：使用电脑的局域网 IP，如 `http://192.168.1.100:5000`

### 2. 允许 HTTP 请求（仅开发环境）

**iOS** - 编辑 `ios/EnterpriseApp/Info.plist`：
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

**Android** - 编辑 `android/app/src/main/AndroidManifest.xml`：
```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

## 常见问题

### Q1: Metro Bundler 端口冲突

```bash
# 杀死占用 8081 端口的进程
lsof -ti:8081 | xargs kill -9

# 或使用其他端口
npm start -- --port 8088
```

### Q2: iOS 模拟器白屏

```bash
# 清除缓存
npm start -- --reset-cache

# 重新构建
cd ios && pod install && cd ..
npx react-native run-ios
```

### Q3: Android 构建失败

```bash
# 清除 Gradle 缓存
cd android
./gradlew clean
cd ..

# 重新构建
npx react-native run-android
```

### Q4: 找不到 AsyncStorage

```bash
# 重新安装依赖
npm install @react-native-async-storage/async-storage

# iOS 需要重新安装 pods
cd ios && pod install && cd ..
```

### Q5: Cannot connect to Metro

- 确保手机和电脑在同一 Wi-Fi
- 摇晃手机 → Dev Settings → Change Bundle Location
- 输入电脑 IP:8081

## 调试工具

### React Native Debugger

1. 下载安装：https://github.com/jhen0409/react-native-debugger
2. 启动 RN Debugger
3. 在 App 中按 `Cmd+D` (iOS) 或 `Cmd+M` (Android)
4. 选择 "Debug"

### Flipper（推荐）

1. 下载：https://fbflipper.com/
2. 自动检测正在运行的 App
3. 提供网络、日志、布局检查等功能

## 发布构建

### iOS

```bash
# 生成 release 版本
npx react-native run-ios --configuration Release
```

### Android

```bash
# 生成签名 APK
cd android
./gradlew assembleRelease

# APK 输出路径
# android/app/build/outputs/apk/release/app-release.apk
```

## 性能优化建议

1. **启用 Hermes 引擎**（Android）
   - 编辑 `android/app/build.gradle`
   - 设置 `enableHermes: true`

2. **使用 FlatList 替代 ScrollView**
   - 对大列表使用虚拟化

3. **图片优化**
   - 使用 FastImage 库
   - 压缩图片资源

4. **减少不必要的重渲染**
   - 使用 React.memo
   - 使用 useMemo 和 useCallback

## 下一步

- 完成所有页面开发
- 集成真实 API
- 添加错误边界
- 编写单元测试
- 配置 CI/CD

## 相关文档

- [React Native 官方文档](https://reactnative.dev/)
- [Expo 文档](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

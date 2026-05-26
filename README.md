# 企业办公助手 React Native App

基于 React Native + Expo 的企业内部移动办公助手应用。

## 技术栈

- **React Native** 0.76.5
- **Expo** ~52.0.0
- **React Navigation** 7.0 (导航管理)
- **TypeScript** 5.3
- **Axios** (HTTP 请求)
- **AsyncStorage** (本地存储)

## 项目结构

```
react-native-app/
├── App.tsx                      # 应用入口
├── package.json                 # 依赖配置
├── src/
│   ├── components/              # UI 组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── NavBar.tsx
│   ├── screens/                 # 页面组件
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── EmployeeListScreen.tsx
│   │   ├── EmployeeFormScreen.tsx
│   │   └── ...
│   ├── navigation/              # 导航配置
│   │   └── AuthNavigator.tsx
│   ├── styles/                  # 样式主题
│   │   └── theme.ts
│   └── services/                # API 服务
│       └── api.ts
```

## 快速开始

### 1. 安装依赖

```bash
cd react-native-app
npm install
```

### 2. 启动开发服务器

```bash
# 启动 Expo 开发服务器
npm start

# 或者直接在特定平台运行
npm run ios      # iOS 模拟器
npm run android  # Android 模拟器
npm run web      # Web 浏览器
```

### 3. 在手机上运行

1. 在手机上安装 **Expo Go** App
2. 扫描终端显示的二维码
3. 应用将在手机上加载运行

## 功能模块

### ✅ 已实现

1. **登录模块**
   - 用户名/密码登录
   - 表单验证
   - JWT Token 存储

2. **首页 Dashboard**
   - 数据统计
   - 快捷入口
   - 最近操作日志

3. **UI 组件库**
   - Button（多种样式、尺寸）
   - Input（带图标、错误提示）
   - Card（卡片容器）
   - NavBar（导航栏）

### 🚧 待实现

- 员工管理（列表、新增、编辑、详情、删除）
- 分类管理（列表、新增、编辑、删除）
- 设备管理（列表、新增、编辑、删除、筛选）
- 分类设备关联查询
- 全局异常处理
- API 请求拦截器（自动添加 JWT）
- 下拉刷新
- 加载状态
- 空状态页面

## 设计规范

### 配色方案

- **主色**: `#1677FF` (Ant Design Blue)
- **成功色**: `#52C41A`
- **警告色**: `#FAAD14`
- **危险色**: `#FF4D4F`
- **背景色**: `#F5F7FA`

### 间距系统

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **xxl**: 24px

### 圆角规范

- **sm**: 8px
- **md**: 12px (默认)
- **lg**: 16px
- **xl**: 20px

## API 对接

后端 API 基础地址需要配置在 `src/services/api.ts` 中：

```typescript
const API_BASE_URL = 'http://your-backend-url:port/api';
```

### API 接口示例

```typescript
// 登录
POST /api/auth/login
Body: { username: string, password: string }
Response: { code: 200, message: "成功", data: { token: string } }

// 获取员工列表
GET /api/employees
Headers: { Authorization: "Bearer {token}" }
Response: { code: 200, message: "成功", data: [...] }
```

## 调试技巧

### 1. 查看日志

```bash
# 查看完整日志
npx react-native log-ios      # iOS
npx react-native log-android  # Android
```

### 2. 清除缓存

```bash
npm start -- --clear
```

### 3. React Native Debugger

推荐使用 **Flipper** 或 **React Native Debugger** 进行调试。

## 常见问题

### Q: 如何连接真机调试？

A: 确保手机和电脑在同一 Wi-Fi 网络下，使用 Expo Go 扫码即可。

### Q: iOS 模拟器无法启动？

A: 确保安装了 Xcode 并配置了模拟器，运行 `xcode-select --install`。

### Q: Android 模拟器无法启动？

A: 确保安装了 Android Studio 和 AVD，配置环境变量 `ANDROID_HOME`。

## 下一步开发

1. 完成所有页面组件（参考设计稿）
2. 集成后端 API
3. 添加 JWT 认证拦截器
4. 实现下拉刷新和上拉加载
5. 添加全局错误处理
6. 优化性能和用户体验

## License

MIT

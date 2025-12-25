# LinkMe - AI 交友聊天社交软件前端

## 🎨 设计特色

- **亮色主题**: 采用明亮背景配紫色强调色的现代设计风格
- **三栏布局**: 侧边栏导航 + 主内容区 + 右侧推荐栏
- **动态流**: 类似 Instagram 的 Home Feed 设计
- **响应式设计**: 支持移动端和桌面端

## ✨ 功能特性

### 🎯 核心功能

- **Home Feed**: 显示用户动态和内容流
- **用户推荐**: 右侧栏显示推荐创作者
- **消息中心**: 聊天界面支持 AI 助手
- **匹配功能**: 用户匹配和推荐
- **个人中心**: 用户资料管理

### 🚀 技术栈

- **Vue 3**: 使用 Composition API
- **Vue Router**: 单页面应用路由
- **Pinia**: 状态管理
- **Tailwind CSS**: 样式框架
- **Iconify**: 图标库
- **Vite**: 构建工具

### 🎨 界面特色

- 亮色主题设计，时尚现代
- 紫色品牌色，增加活力
- 简洁大方的布局设计
- 流畅的交互动画效果

## 项目结构

```
LinkMe-frontend/
├── src/
│   ├── api/                     # API接口
│   │   ├── posts.js             # 帖子相关API
│   │   ├── request.js           # 请求封装
│   │   └── user.js              # 用户相关API
│   ├── components/              # 组件
│   │   └── Sidebar.vue          # 侧边栏导航组件
│   ├── data/                    # 数据文件
│   │   └── posts.js             # 帖子数据
│   ├── router/                  # 路由配置
│   │   └── index.js             # 路由配置
│   ├── stores/                  # 状态管理
│   │   └── auth.js              # 认证状态管理
│   ├── views/                   # 页面视图
│   │   ├── ChatPage.vue         # 聊天页面
│   │   ├── CreatePost.vue       # 创建帖子页面
│   │   ├── DiscoverPage.vue     # 发现页面
│   │   ├── HomePage.vue         # 首页
│   │   ├── LoginPage.vue        # 登录页面
│   │   ├── MatchPage.vue        # 匹配页面
│   │   ├── PostDetail.vue       # 帖子详情页面
│   │   ├── ProfilePage.vue      # 个人中心页面
│   │   ├── RegisterPage.vue     # 注册页面
│   │   └── SettingsPage.vue     # 设置页面
│   ├── App.vue                  # 主应用组件
│   ├── main.js                  # 应用入口
│   └── style.css                # 全局样式
├── index.html                   # HTML模板
├── package.json                 # 项目配置
├── vite.config.js              # Vite配置
├── auto-imports.d.ts           # 自动导入类型定义
├── components.d.ts              # 组件类型定义
└── README.md                   # 项目说明
```

## 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
cd LinkMe-frontend
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 主要页面说明

### 1. 首页 (HomePage)

- 用户动态流展示
- 帖子浏览和互动
- 用户推荐

### 2. 登录页面 (LoginPage)

- 用户登录功能
- 表单验证

### 3. 注册页面 (RegisterPage)

- 新用户注册
- 表单验证

### 4. 发现页面 (DiscoverPage)

- 展示推荐内容卡片
- 支持内容分类和搜索
- 热门话题展示
- 用户互动功能（点赞、评论、分享）

### 5. 匹配页面 (MatchPage)

- 用户卡片滑动匹配
- AI 匹配度分析
- 匹配统计图表
- 推荐用户列表

### 6. 聊天页面 (ChatPage)

- 聊天列表管理
- 实时消息发送
- AI 助手建议
- 消息搜索功能

### 7. 创建帖子页面 (CreatePost)

- 发布新帖子
- 图片上传
- 内容编辑

### 8. 帖子详情页面 (PostDetail)

- 帖子详细内容展示
- 评论功能
- 互动功能（点赞、收藏等）

### 9. 个人中心页面 (ProfilePage)

- 用户资料展示
- 数据统计图表
- 账户设置选项
- 互动趋势分析

### 10. 设置页面 (SettingsPage)

- 用户设置管理
- 隐私设置
- 账户配置

## 技术亮点

### Vue 3 Composition API

使用最新的 Vue 3 Composition API，提供更好的代码组织和复用性。

### 响应式数据管理

利用 Vue 的响应式系统，实现数据的自动更新和 UI 同步。

### 组件化设计

将复杂页面拆分为可复用的组件，提高代码的可维护性。

### 图表集成

集成 ECharts 实现数据可视化，包括饼图和折线图。

### 现代化样式

使用 Tailwind CSS 和自定义 CSS 变量，实现现代化的界面设计。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: <huangy837@mail2.sysu.edu.cn>
- GitHub: Helina-cloud

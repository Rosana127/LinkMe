# Snapgram - AI私聊交友恋爱社交平台

这是一个基于Vue 3的AI私聊交友恋爱社交平台，采用现代化的暗色主题设计，参考Instagram风格。

## 🎨 设计特色

- **暗色主题**: 采用黑色背景配紫色强调色的现代设计风格
- **三栏布局**: 侧边栏导航 + 主内容区 + 右侧推荐栏
- **动态流**: 类似Instagram的Home Feed设计
- **响应式设计**: 支持移动端和桌面端

## ✨ 功能特性

### 🎯 核心功能
- **Home Feed**: 显示用户动态和内容流
- **用户推荐**: 右侧栏显示推荐创作者
- **消息中心**: 聊天界面支持AI助手
- **匹配功能**: 用户匹配和推荐
- **个人中心**: 用户资料管理

### 🚀 技术栈
- **Vue 3**: 使用Composition API
- **Vue Router**: 单页面应用路由
- **Pinia**: 状态管理
- **Tailwind CSS**: 样式框架
- **Iconify**: 图标库
- **Vite**: 构建工具

### 🎨 界面特色
- 暗色主题设计，时尚现代
- 紫色品牌色，增加活力
- 简洁大方的布局设计
- 流畅的交互动画效果

## 项目结构

```
AI私聊交友恋爱社交平台设计_原型界面_V2_vue/
├── src/
│   ├── components/
│   │   └── Sidebar.vue          # 侧边栏导航组件
│   ├── views/
│   │   ├── DiscoverPage.vue     # 发现页面
│   │   ├── MatchPage.vue        # 匹配页面
│   │   ├── ChatPage.vue         # 聊天页面
│   │   └── ProfilePage.vue      # 个人中心页面
│   ├── router/
│   │   └── index.js             # 路由配置
│   ├── App.vue                  # 主应用组件
│   └── main.js                  # 应用入口
├── index.html                   # HTML模板
├── package.json                 # 项目配置
├── vite.config.js              # Vite配置
└── README.md                   # 项目说明
```

## 安装和运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
cd AI私聊交友恋爱社交平台设计_原型界面_V2_vue
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

### 1. 发现页面 (DiscoverPage)
- 展示推荐内容卡片
- 支持内容分类和搜索
- 热门话题展示
- 用户互动功能（点赞、评论、分享）

### 2. 匹配页面 (MatchPage)
- 用户卡片滑动匹配
- AI匹配度分析
- 匹配统计图表
- 推荐用户列表

### 3. 聊天页面 (ChatPage)
- 聊天列表管理
- 实时消息发送
- AI助手建议
- 消息搜索功能

### 4. 个人中心页面 (ProfilePage)
- 用户资料展示
- 数据统计图表
- 账户设置选项
- 互动趋势分析

## 技术亮点

### Vue 3 Composition API
使用最新的Vue 3 Composition API，提供更好的代码组织和复用性。

### 响应式数据管理
利用Vue的响应式系统，实现数据的自动更新和UI同步。

### 组件化设计
将复杂页面拆分为可复用的组件，提高代码的可维护性。

### 图表集成
集成ECharts实现数据可视化，包括饼图和折线图。

### 现代化样式
使用Tailwind CSS和自定义CSS变量，实现现代化的界面设计。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: your-email@example.com
- GitHub: your-github-username

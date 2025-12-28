# 问卷系统API使用说明

## 概述

LinKMe项目的问卷系统提供了完整的保存和拉取功能，支持用户分步填写问卷、自动保存草稿、以及数据恢复。

## 功能特性

### 1. 数据保存
- **最终提交**：用户完成问卷后提交完整数据
- **自动保存**：填写过程中每5秒自动保存草稿
- **部分更新**：支持更新部分问卷数据

### 2. 数据拉取
- **自动加载**：页面加载时检查并加载已有数据
- **数据恢复**：支持断点续传，用户可继续之前的填写

### 3. 用户体验
- **进度提示**：显示保存状态和进度
- **错误处理**：友好的错误提示和恢复机制
- **防抖机制**：避免频繁的API调用

## API接口

### 提交问卷数据 (POST)
```javascript
// 提交完整的问卷数据
await submitQuestionnaire(questionnaireData)

// 数据格式示例
{
  userId: 123,
  interests: ['reading', 'travel'],
  socialEnergy: 'extroverted',
  decisionMaking: 'careful',
  lifeRhythm: 'regular',
  communicationStyle: 'direct',
  preferredSocialStyle: 'small_groups',
  preferredLifestyle: 'balanced',
  preferredInterests: 'intellectual',
  relationshipQualities: ['trustworthy', 'supportive'],
  preferredRelationshipMode: 'gradual',
  communicationExpectation: 'frequent',
  ageRequirement: {
    unlimited: false,
    minAge: 25,
    maxAge: 35
  },
  distanceRequirement: 'same_city_priority',
  mustHaveQualities: ['age_range', 'distance'],
  priorityQualities: ['interest_overlap', 'personality_compatibility'],
  additionalRequirements: '希望找一个喜欢旅行的伴侣'
}
```

### 获取问卷数据 (GET)
```javascript
// 获取当前用户的数据
const data = await getQuestionnaire()

// 获取指定用户的数据
const data = await getQuestionnaire(userId)
```

### 更新问卷数据 (PUT)
```javascript
// 用于自动保存，更新部分数据
await updateQuestionnaire(questionnaireData)
```

## 前端实现

### 自动保存机制
```javascript
// 监控表单数据变化
watch: {
  formData: {
    handler() {
      const authStore = useAuthStore()
      if (!this.isLoading && authStore.isAuthenticated) {
        this.debounceAutoSave() // 5秒后执行自动保存
      }
    },
    deep: true
  }
}

// 检查是否有数据需要保存
hasPartialData() {
  const data = this.formData
  return (
    data.interests.length > 0 ||
    data.socialEnergy ||
    // ... 其他字段检查
  )
}
```

### 数据加载逻辑
```javascript
async loadExistingQuestionnaire() {
  try {
    const authStore = useAuthStore()
    const userId = authStore.userId
    
    if (!userId) return
    
    // 获取已有数据
    const existingData = await getQuestionnaire(userId)
    
    // 填充表单数据
    if (existingData) {
      this.formData.interests = existingData.interests || []
      this.formData.socialEnergy = existingData.socialEnergy || ''
      // ... 其他字段映射
    }
  } catch (error) {
    // 404错误表示用户还没有填写过问卷，这是正常的
    if (error.response?.status !== 404) {
      console.warn('获取问卷数据失败:', error)
    }
  }
}
```

## 数据结构

### 表单数据结构
```javascript
formData: {
  interests: [],                    // 兴趣爱好（多选）
  socialEnergy: '',                 // 社交能量
  decisionMaking: '',               // 决策方式
  lifeRhythm: '',                   // 生活节奏
  communicationStyle: '',           // 沟通风格
  preferredSocialStyle: '',         // 偏好社交方式
  preferredLifestyle: '',           // 偏好生活方式
  preferredInterests: '',           // 偏好兴趣类型
  relationshipQualities: [],        // 关系品质（多选）
  preferredRelationshipMode: '',    // 偏好关系模式
  communicationExpectation: '',     // 沟通期望
  ageRequirement: {                 // 年龄要求
    unlimited: false,
    minAge: 18,
    maxAge: 30
  },
  distanceRequirement: '',          // 距离要求
  mustHaveQualities: [],           // 必须满足的维度（1-2个）
  priorityQualities: [],           // 优先考虑的维度（1-3个）
  additionalRequirements: ''       // 额外要求
}
```

## 验证规则

### 第12页（必须维度）
- 必须选择1-2个维度
- 支持"无要求"选项
- 选择"无要求"会清除其他选择

### 第13页（优先维度）
- 必须选择1-3个维度
- 支持"无要求"选项
- 选择"无要求"会清除其他选择

## 错误处理

### 常见错误类型
1. **网络错误**：显示重试提示
2. **认证错误**：跳转到登录页面
3. **验证错误**：显示具体错误信息
4. **服务器错误**：显示通用错误提示

### 自动保存失败
- 自动保存失败不会显示错误给用户
- 避免干扰用户的填写体验
- 会在控制台记录错误日志

## 性能优化

### 防抖机制
- 5秒延迟的自动保存
- 清除之前的定时器避免重复保存
- 只在有实际数据变化时保存

### 数据验证
- 前端验证减少无效请求
- 分步验证避免一次性处理大量数据
- 智能的数据结构检测

## 部署注意事项

### 后端API要求
- 支持RESTful风格的API
- 需要处理认证和授权
- 需要数据验证和错误处理

### 数据库设计
- 用户ID作为外键
- 支持部分数据更新
- 需要创建时间戳和更新时间戳

### 安全考虑
- 用户只能访问自己的问卷数据
- 需要token验证
- 敏感数据需要加密存储
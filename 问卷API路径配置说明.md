# 问卷API路径配置说明

## 当前配置

### 前端配置
- **baseURL**: `/api` (在 `src/api/request.js` 中)
- **问卷API路径**: `/questionnaire` (在 `src/api/questionnaire.js` 中)
- **实际请求路径**: `/api/questionnaire`

### Vite Proxy 配置
```javascript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),  // 去掉 /api 前缀
  },
}
```

### 实际发送到后端的请求
- 前端请求: `POST /api/questionnaire`
- 经过 proxy 后: `POST http://localhost:8080/questionnaire`

## 如果后端路径是 `/api/questionnaire`

如果后端实际路径是 `/api/questionnaire`（带 `/api` 前缀），需要修改 Vite proxy 配置：

### 方案1：修改 proxy 配置，不重写路径

修改 `vite.config.js`:

```javascript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true,
    // 不重写路径，保留 /api 前缀
    // rewrite: (path) => path.replace(/^\/api/, ""),  // 注释掉或删除这行
  },
}
```

这样：
- 前端请求: `POST /api/questionnaire`
- 经过 proxy 后: `POST http://localhost:8080/api/questionnaire` ✅

### 方案2：为问卷API单独配置 proxy

修改 `vite.config.js`:

```javascript
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
  "/api/questionnaire": {
    target: "http://localhost:8080",
    changeOrigin: true,
    // 不重写路径，保留 /api/questionnaire
  },
}
```

## 数据格式要求

根据 `后端问卷API需求.md`，后端期望的数据格式：

```json
{
  "userId": 123,
  "interests": ["reading", "travel", "photography"],
  "socialEnergy": "extroverted",
  "decisionMaking": "rational",
  "lifeRhythm": "planned",
  "communicationStyle": "direct",
  "preferredSocialStyle": "warm_talkative",
  "preferredLifestyle": "meticulous",
  "preferredInterests": "optimistic_positive",
  "relationshipQualities": ["sincere_frank", "mutual_trust"],
  "preferredRelationshipMode": "high_frequency",
  "communicationExpectation": "instant_reply",
  "ageRequirement": {
    "unlimited": false,
    "minAge": 25,
    "maxAge": 35
  },
  "distanceRequirement": "same_city_priority",
  "mustHaveQualities": ["age_range", "distance"],
  "priorityQualities": ["interest_overlap", "personality_compatibility"],
  "additionalRequirements": "希望找一个喜欢旅行的伴侣"
}
```

## 已修复的问题

1. ✅ 字段名修复：`hobbies` → `interests`
2. ✅ 年龄要求格式修复：扁平字段 → `ageRequirement` 对象
3. ✅ API路径修复：确保路径正确

## 测试步骤

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 填写并提交问卷
4. 查看实际发送的请求：
   - **请求URL**: 应该是 `http://localhost:8080/questionnaire` 或 `http://localhost:8080/api/questionnaire`
   - **请求方法**: POST
   - **请求体**: 检查数据格式是否正确
   - **响应状态**: 检查是否成功（200）或错误（400/404/500）

## 常见问题

### 问题1: 404 Not Found
- **原因**: 后端路径不匹配
- **解决**: 根据后端实际路径调整 proxy 配置（见上方）

### 问题2: 400 Bad Request
- **原因**: 数据格式不正确
- **解决**: 检查请求体中的数据格式，确保字段名和格式与后端期望一致

### 问题3: 401 Unauthorized
- **原因**: Token 过期或未提供
- **解决**: 检查登录状态，重新登录

### 问题4: 500 Internal Server Error
- **原因**: 后端服务器错误
- **解决**: 检查后端日志，查看具体错误信息


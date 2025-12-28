# 后端问卷API需求文档

## 问题说明

前端问卷功能需要后端提供以下API接口。当前所有问卷相关的API请求都返回404错误，说明后端尚未实现这些接口。

## 必需的API接口

### 1. 创建/提交问卷 (POST /questionnaire)

**请求路径**: `POST /questionnaire`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体**:
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

**响应格式** (成功时):
```json
{
  "code": 200,
  "message": "问卷提交成功",
  "data": {
    "id": 1,
    "userId": 123,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. 获取问卷数据 (GET /questionnaire)

**请求路径**: `GET /questionnaire` (获取当前登录用户的问卷)

**请求头**:
```
Authorization: Bearer {token}
```

**响应格式** (成功时):
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "userId": 123,
    "interests": ["reading", "travel"],
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
    "additionalRequirements": "希望找一个喜欢旅行的伴侣",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**如果用户没有填写过问卷，返回404或空数据**:
```json
{
  "code": 404,
  "message": "未找到问卷数据"
}
```

### 3. 更新问卷数据 (PUT /questionnaire)

**请求路径**: `PUT /questionnaire`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体**: 与POST相同，但可以只包含部分字段（部分更新）

**响应格式**: 与POST相同

**注意**: 如果问卷不存在，应该返回404，前端会自动使用POST创建

### 4. 获取指定用户的问卷 (GET /questionnaire/{userId})

**请求路径**: `GET /questionnaire/{userId}`

**请求头**:
```
Authorization: Bearer {token}
```

**响应格式**: 与GET /questionnaire相同

## 数据字段说明

### interests (数组)
兴趣爱好列表，可能的值包括：
- 艺术文娱类: art, photography, calligraphy, writing, singing, dance, theater, instrument, graphic_design, video_editing
- 学习知识类: reading, programming, teaching, psychology, language_learning, philosophy, history_research, investment, public_speaking, entrepreneurship
- 运动户外类: running, fitness, swimming, cycling, fishing, yoga, camping, martial_arts, mountaineering, climbing, frisbee, team_sports
- 休闲娱乐类: board_games, card_games, magic, collecting, tv_shows, movies, music, script_killing, escape_room, gaming
- 生活技能类: cooking_baking, coffee_tea_mixology, handicraft_diy, sewing, home_decoration, organizing, floristry_gardening
- 社交体验类: travel, bird_watching, music_festival, concert, restaurant_hopping, exhibition, astronomy, volunteering, petting, city_walk

### socialEnergy (字符串)
- extroverted: 外向型
- introverted: 内向型
- ambivert: 中间型

### decisionMaking (字符串)
- rational: 理性型
- emotional: 感性型
- balanced: 平衡型

### lifeRhythm (字符串)
- planned: 计划型
- spontaneous: 随性型
- flexible: 弹性型

### communicationStyle (字符串)
- direct: 直接坦率型
- tactful: 委婉体贴型
- humorous: 幽默风趣型
- listening: 倾听为主型
- quiet: 偶尔沉默型

### preferredSocialStyle (字符串)
- warm_talkative: 热情健谈
- calm_introverted: 沉稳内敛
- in_sync: 同频即可

### preferredLifestyle (字符串)
- meticulous: 严谨细致
- efficient_action: 高效行动
- flexible_adaptable: 灵活变通
- reliable_steady: 踏实靠谱

### preferredInterests (字符串)
- optimistic_positive: 乐观积极
- calm_rational: 冷静理智
- sensitive_empathetic: 敏感共情
- emotionally_stable: 情绪稳定

### relationshipQualities (数组)
- sincere_frank: 真诚坦率
- mutual_understanding: 相互理解
- mutual_trust: 彼此信任
- tolerant_respectful: 包容尊重
- interesting_compatible: 有趣合拍
- shared_values: 三观一致

### preferredRelationshipMode (字符串)
- high_frequency: 高频互动型
- deep_communication: 深度交流型
- casual_companion: 佛系陪伴型
- interest_buddy: 兴趣搭子型

### communicationExpectation (字符串)
- instant_reply: 消息秒回型
- casual_reply: 随缘回复型
- timely_communication: 遇事及时沟通型

### ageRequirement (对象)
```json
{
  "unlimited": false,
  "minAge": 25,
  "maxAge": 35
}
```

### distanceRequirement (字符串)
- same_city_priority: 同城优先
- both_ok: 同城/异地均可
- no_limit: 不限距离

### mustHaveQualities (数组，1-2个)
- age_range: 年龄范围
- distance: 关系距离
- interest_overlap: 兴趣重合度
- personality_compatibility: 性格特质契合
- relationship_mode: 关系模式一致
- communication_style: 沟通风格匹配
- no_requirement: 无要求

### priorityQualities (数组，1-3个)
与mustHaveQualities相同的选项

### additionalRequirements (字符串，可选)
用户填写的额外要求文本

## 错误处理

### 401 未授权
```json
{
  "code": 401,
  "message": "请先登录账号"
}
```

### 404 未找到
```json
{
  "code": 404,
  "message": "未找到问卷数据"
}
```

### 400 参数错误
```json
{
  "code": 400,
  "message": "请求参数错误：{具体错误信息}"
}
```

### 500 服务器错误
```json
{
  "code": 500,
  "message": "服务器内部错误"
}
```

## 数据库设计建议

建议创建 `questionnaires` 表，包含以下字段：

```sql
CREATE TABLE questionnaires (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  interests JSON,
  social_energy VARCHAR(50),
  decision_making VARCHAR(50),
  life_rhythm VARCHAR(50),
  communication_style VARCHAR(50),
  preferred_social_style VARCHAR(50),
  preferred_lifestyle VARCHAR(50),
  preferred_interests VARCHAR(50),
  relationship_qualities JSON,
  preferred_relationship_mode VARCHAR(50),
  communication_expectation VARCHAR(50),
  age_requirement JSON,
  distance_requirement VARCHAR(50),
  must_have_qualities JSON,
  priority_qualities JSON,
  additional_requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 实现优先级

1. **高优先级**: POST /questionnaire, GET /questionnaire (基础功能)
2. **中优先级**: PUT /questionnaire (自动保存功能)
3. **低优先级**: GET /questionnaire/{userId} (查看他人问卷)

## 测试建议

1. 使用Postman或类似工具测试每个接口
2. 测试认证token是否有效
3. 测试数据验证（必填字段、数据格式等）
4. 测试错误处理（404、401、400等）


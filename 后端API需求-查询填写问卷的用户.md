# 后端API需求：查询填写过问卷的用户

## 需求说明

前端"今日推荐"页面需要显示所有填写过问卷的用户。根据 `user_questionnaire_completion` 表查询填写过问卷的用户，并返回用户的详细信息。

## API接口

### GET /user/with-questionnaire

**请求路径**: `GET /user/with-questionnaire`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
- `offset` (可选, 默认0): 偏移量，用于分页
- `limit` (可选, 默认50): 每页数量

**请求示例**:
```
GET /api/user/with-questionnaire?offset=0&limit=50
```

**响应格式** (成功时):
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "userId": 16,
      "id": 16,
      "nickname": "张三",
      "name": "张三",
      "age": 25,
      "birthday": "1999-01-01",
      "location": "北京",
      "city": "北京",
      "job": "设计师",
      "profession": "设计师",
      "avatar": "https://example.com/avatar.jpg",
      "photo": "https://example.com/photo.jpg",
      "bio": "热爱生活，喜欢旅行",
      "introduction": "热爱生活，喜欢旅行",
      "description": "热爱生活，喜欢旅行",
      "tags": ["摄影", "旅行"],
      "interests": ["摄影", "旅行", "阅读"],
      "distance": "3公里内",
      "hasQuestionnaire": true
    },
    {
      "userId": 17,
      "id": 17,
      "nickname": "李四",
      "name": "李四",
      "age": 28,
      "birthday": "1996-05-15",
      "location": "上海",
      "city": "上海",
      "job": "程序员",
      "profession": "程序员",
      "avatar": "https://example.com/avatar2.jpg",
      "photo": "https://example.com/photo2.jpg",
      "bio": "技术爱好者",
      "introduction": "技术爱好者",
      "description": "技术爱好者",
      "tags": ["编程", "技术"],
      "interests": ["编程", "技术", "游戏"],
      "distance": "5公里内",
      "hasQuestionnaire": true
    }
  ]
}
```

## 数据库查询逻辑

### SQL查询示例

```sql
-- 方法1: 使用 JOIN 查询（推荐）
SELECT 
  u.id AS userId,
  u.id,
  u.nickname,
  u.username,
  u.birthday,
  u.location,
  u.city,
  u.job,
  u.profession,
  u.avatar,
  u.bio,
  u.introduction,
  u.description,
  -- 计算年龄
  TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age,
  -- 获取用户爱好（从 user_hobby 表）
  GROUP_CONCAT(DISTINCT uh.hobby) AS interests,
  -- 标记为已填写问卷
  1 AS hasQuestionnaire
FROM user_questionnaire_completion uqc
INNER JOIN users u ON uqc.user_id = u.id
LEFT JOIN user_hobby uh ON u.id = uh.user_id
WHERE uqc.user_id IS NOT NULL
GROUP BY u.id
ORDER BY uqc.last_submitted_at DESC
LIMIT ? OFFSET ?;

-- 方法2: 分步查询
-- 第一步：查询填写过问卷的用户ID
SELECT DISTINCT user_id 
FROM user_questionnaire_completion 
WHERE user_id IS NOT NULL
ORDER BY last_submitted_at DESC
LIMIT ? OFFSET ?;

-- 第二步：根据用户ID查询用户详细信息
SELECT * FROM users WHERE id IN (?, ?, ...);
```

## 实现建议

### Java Spring Boot 示例

```java
@GetMapping("/user/with-questionnaire")
public Result getUsersWithQuestionnaire(
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "50") int limit
) {
    try {
        // 1. 查询 user_questionnaire_completion 表，获取填写过问卷的用户ID列表
        List<Long> userIds = questionnaireRepository.findUserIdsWithQuestionnaire(offset, limit);
        
        if (userIds.isEmpty()) {
            return Result.success(Collections.emptyList());
        }
        
        // 2. 根据用户ID列表查询用户详细信息
        List<User> users = userRepository.findByIdIn(userIds);
        
        // 3. 获取用户的爱好（从 user_hobby 表）
        Map<Long, List<String>> hobbiesMap = hobbyRepository.findHobbiesByUserIds(userIds);
        
        // 4. 组装返回数据
        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = convertToDTO(user);
            dto.setInterests(hobbiesMap.getOrDefault(user.getId(), Collections.emptyList()));
            dto.setHasQuestionnaire(true);
            return dto;
        }).collect(Collectors.toList());
        
        return Result.success(userDTOs);
    } catch (Exception e) {
        log.error("查询填写过问卷的用户失败", e);
        return Result.error("查询失败: " + e.getMessage());
    }
}
```

### Repository 方法示例

```java
// QuestionnaireCompletionRepository
@Query("SELECT DISTINCT uqc.userId FROM UserQuestionnaireCompletion uqc WHERE uqc.userId IS NOT NULL ORDER BY uqc.lastSubmittedAt DESC")
List<Long> findUserIdsWithQuestionnaire(Pageable pageable);

// UserRepository
List<User> findByIdIn(List<Long> userIds);

// HobbyRepository
@Query("SELECT uh.userId, uh.hobby FROM UserHobby uh WHERE uh.userId IN :userIds")
List<Object[]> findHobbiesByUserIds(@Param("userIds") List<Long> userIds);
```

## 注意事项

1. **排除当前用户**: 如果不想显示当前登录用户，需要在查询时排除：
   ```sql
   WHERE uq.user_id != :currentUserId
   ```

2. **性能优化**: 
   - 如果用户数量很大，建议使用分页
   - 可以考虑缓存结果（但要注意数据实时性）
   - 使用索引优化查询（`user_questionnaire_completion.user_id` 应该有索引）

3. **数据完整性**:
   - 确保返回的用户数据包含前端需要的所有字段
   - 如果某些字段可能为空，前端会使用默认值

4. **排序规则**:
   - 建议按 `last_submitted_at` 降序排序，显示最近填写问卷的用户
   - 或者可以按匹配度排序（如果有匹配算法）

## 错误处理

### 401 未授权
```json
{
  "code": 401,
  "message": "请先登录账号"
}
```

### 500 服务器错误
```json
{
  "code": 500,
  "message": "服务器内部错误"
}
```

## 测试建议

1. 测试空数据情况（没有用户填写过问卷）
2. 测试分页功能（offset 和 limit）
3. 测试数据完整性（确保返回的用户信息完整）
4. 测试性能（大量用户时的查询速度）


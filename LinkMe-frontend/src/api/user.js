import request from './request'

/**
 * 用户注册
 * @param {Object} userData 用户注册数据
 * @returns {Promise}
 */
export function register(userData) {
  // 将前端发送的password字段转换为后端期望的passwordHash字段
  const requestData = { ...userData }
  if (requestData.password) {
    requestData.passwordHash = requestData.password
    delete requestData.password
  }
  
  // 将中文性别转换为英文（数据库ENUM只接受male, female, other）
  if (requestData.gender) {
    const genderMap = {
      '男': 'male',
      '女': 'female',
      '其他': 'other'
    }
    requestData.gender = genderMap[requestData.gender] || requestData.gender
  }
  
  // 调试日志：打印发送的数据
  console.log('注册请求数据:', {
    username: requestData.username,
    nickname: requestData.nickname,
    email: requestData.email,
    phone: requestData.phone,
    hasPassword: !!requestData.passwordHash,
    gender: requestData.gender,
    birthday: requestData.birthday
  })
  
  return request({
    url: '/user/register',
    method: 'post',
    data: requestData
  })
}

/**
 * 用户登录
 * @param {String} loginName 登录名（邮箱或手机号）
 * @param {String} password 密码
 * @returns {Promise}
 */
export function login(loginName, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      loginName,
      password
    }
  })
}

/**
 * 获取用户信息
 * @param {Number} userId 用户ID
 * @returns {Promise}
 */
export function getUserInfo(userId) {
  return request({
    url: `/user/${userId}/info`,
    method: 'get'
  })
}

/**
 * 更新用户信息
 * @param {Number} userId 用户ID
 * @param {Object} userData 用户数据
 * @returns {Promise}
 */
export function updateUserInfo(userId, userData) {
  return request({
    url: `/user/${userId}/info`,
    method: 'put',
    data: userData
  })
}


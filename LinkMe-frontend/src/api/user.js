import request from './request'

/**
 * 用户注册
 * @param {Object} userData 用户注册数据
 * @returns {Promise}
 */
export function register(userData) {
  return request({
    url: '/user/register',
    method: 'post',
    data: userData
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


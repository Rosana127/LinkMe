import request from './request'

/**
 * 发送喜欢通知给指定用户
 * @param {Number} targetUserId 目标用户ID
 * @returns {Promise}
 */
export function sendLikeNotification(targetUserId) {
  return request({
    url: '/likes/send',
    method: 'post',
    data: {
      targetUserId
    }
  })
}

/**
 * 取消喜欢通知
 * @param {Number} targetUserId 目标用户ID
 * @returns {Promise}
 */
export function cancelLikeNotification(targetUserId) {
  return request({
    url: '/likes/cancel',
    method: 'delete',
    data: {
      targetUserId
    }
  })
}

/**
 * 获取我发送的喜欢列表
 * @param {Number} page 页码
 * @param {Number} size 每页数量
 * @returns {Promise}
 */
export function getSentLikes(page = 1, size = 20) {
  return request({
    url: '/likes/sent',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 获取我收到的喜欢列表
 * @param {Number} page 页码
 * @param {Number} size 每页数量
 * @returns {Promise}
 */
export function getReceivedLikes(page = 1, size = 20) {
  return request({
    url: '/likes/received',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 检查是否已喜欢指定用户
 * @param {Number} targetUserId 目标用户ID
 * @returns {Promise}
 */
export function checkLikeStatus(targetUserId) {
  return request({
    url: '/likes/status',
    method: 'get',
    params: {
      targetUserId
    }
  })
}

const likesApi = {
  sendLikeNotification,
  cancelLikeNotification,
  getSentLikes,
  getReceivedLikes,
  checkLikeStatus
}

export default likesApi

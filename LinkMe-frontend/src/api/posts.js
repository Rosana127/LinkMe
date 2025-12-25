import request from './request'

/**
 * 创建帖子
 * @param {Object} postData { userId, topic, content, images, tags, visibility }
 */
export function createPost(postData) {
  // 后端示例期望: { userId, content, images: [string], tags: [...] }
  // 我们会将前端的 images (data URLs) 和 tags 原样发送
  return request({
    url: '/posts',
    method: 'post',
    data: postData
  })
}

/**
 * 获取某个用户的帖子列表（后端可能是 /user/:id/posts 或 /posts?userId=）
 * 我们先尝试 /user/{userId}/posts，然后降级到 /posts?userId=
 * @param {Number} userId
 */
export async function getUserPosts(userId) {
  try {
    // 先试试 RESTful 风格的用户帖子接口
    const res1 = await request({ url: `/user/${userId}/posts`, method: 'get' })
    return Array.isArray(res1) ? res1 : (res1?.data || [])
  } catch (e) {
    // 如果第一个接口不存在，再尝试带查询参数的通用接口
    try {
      const res2 = await request({ url: `/posts`, method: 'get', params: { userId } })
      return Array.isArray(res2) ? res2 : (res2?.data || [])
    } catch (err) {
      // 最终抛出错误给调用者，让调用者可以回退到 localStorage
      throw err
    }
  }
}

/**
 * 删除帖子
 * @param {Number|String} postId
 */
export function deletePost(postId) {
  return request({
    url: `/posts/${postId}`,
    method: 'delete'
  })
}

/**
 * 获取单个帖子详情
 * @param {Number|String} postId
 */
export function getPost(postId) {
  return request({
    url: `/posts/${postId}`,
    method: 'get'
  })
}

/**
 * 获取帖子评论列表
 * @param {Number|String} postId
 */
export function getComments(postId) {
  return request({
    url: `/posts/${postId}/comments`,
    method: 'get'
  })
}

/**
 * 创建评论
 * @param {Number|String} postId
 * @param {Object} commentData { userId, content, parentId? }
 */
export function postComment(postId, commentData) {
  return request({
    url: `/posts/${postId}/comments`,
    method: 'post',
    data: commentData
  })
}

/**
 * 删除评论
 * @param {Number|String} postId
 * @param {Number|String} commentId
 */
export function deleteComment(postId, commentId) {
  return request({
    url: `/posts/${postId}/comments/${commentId}`,
    method: 'delete'
  })
}

/**
 * 获取帖子列表（公共探索列表）
 * 支持 query params，如 page, limit, userId 等
 */
export function getPosts(params = {}) {
  return request({
    url: '/posts',
    method: 'get',
    params
  })
}

/**
 * 点赞帖子
 * @param {Number|String} postId
 * @param {Number} userId
 */
export function likePost(postId, userId) {
  return request({
    url: `/posts/${postId}/like`,
    method: 'post',
    data: { userId }
  })
}

/**
 * 取消点赞
 * @param {Number|String} postId
 * @param {Number} userId
 */
export function unlikePost(postId, userId) {
  return request({
    url: `/posts/${postId}/like`,
    method: 'delete',
    data: { userId }
  })
}

const postsApi = {
  createPost,
  getUserPosts,
  deletePost,
  getPosts,
  getPost,
  getComments,
  postComment,
  deleteComment,
  likePost,
  unlikePost
}

export default postsApi

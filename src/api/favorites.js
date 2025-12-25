import request from './request'

/**
 * 获取用户点赞的帖子列表
 * @param {Number} userId 用户ID
 * @param {Number} page 页码
 * @param {Number} limit 每页数量
 */
export function getUserLikedPosts(userId, page = 1, limit = 100) {
  return request({
    url: `/user/${userId}/likes`,
    method: 'get',
    params: { page, limit }
  })
}

/**
 * 获取用户收藏的帖子列表
 * @param {Number} userId 用户ID
 * @param {Number} folderId 收藏夹ID（可选）
 * @param {Number} page 页码
 * @param {Number} limit 每页数量
 */
export function getUserFavoritePosts(userId, folderId = null, page = 1, limit = 100) {
  const params = { page, limit }
  if (folderId) {
    params.folderId = folderId
  }
  return request({
    url: `/user/${userId}/favorites`,
    method: 'get',
    params
  })
}

/**
 * 获取收藏夹列表
 * @param {Number} userId - 用户ID
 */
export function getFavoriteFolders(userId) {
  return request({
    url: `/user/${userId}/favorite-folders`,
    method: 'get'
  })
}

/**
 * 创建收藏夹
 * @param {Number} userId - 用户ID
 * @param {String} folderName - 收藏夹名称
 */
export function createFavoriteFolder(userId, folderName) {
  return request({
    url: `/user/${userId}/favorite-folders`,
    method: 'post',
    data: { 
      name: folderName 
    }
  })
}

/**
 * 更新收藏夹信息
 * @param {Number} folderId - 收藏夹ID
 * @param {String} name - 新名称
 */
export function updateFavoriteFolder(folderId, name) {
  return request({
    url: `/favorite_folders/${folderId}`,
    method: 'put',
    data: { name }
  })
}

/**
 * 删除收藏夹
 * @param {Number} folderId - 收藏夹ID
 */
export function deleteFavoriteFolder(folderId) {
  return request({
    url: `/favorite_folders/${folderId}`,
    method: 'delete'
  })
}

/**
 * 收藏帖子到指定收藏夹
 * @param {Number} userId - 用户ID
 * @param {Number} postId - 帖子ID
 * @param {Number} folderId - 收藏夹ID
 */
export function addPostToFavorites(userId, postId, folderId) {
  return request({
    url: `/favorites`,
    method: 'post',
    data: { 
      user_id: userId,
      post_id: postId,
      folder_id: folderId 
    }
  })
}

/**
 * 取消收藏帖子
 * @param {Number} favoriteId - 收藏ID
 */
export function removePostFromFavorites(favoriteId) {
  return request({
    url: `/favorites/${favoriteId}`,
    method: 'delete'
  })
}

import request from "./request"

/**
 * 获取匹配推荐列表（后端已根据问卷和打分规则计算好匹配度）
 * @param {number} page 页码，从 1 开始
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export function getRecommendations(page = 1, size = 20) {
  return request({
    url: "/match/recommendations",
    method: "get",
    params: {
      page,
      size
    }
  })
}

const matchApi = {
  getRecommendations
}

export default matchApi



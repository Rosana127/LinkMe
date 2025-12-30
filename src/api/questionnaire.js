import request from "./request";

/**
 * 提交问卷数据
 * @param {Object} questionnaireData 问卷数据
 * @returns {Promise}
 */
export function submitQuestionnaire(questionnaireData) {
  return request({
    url: "/questionnaire",
    method: "post",
    data: questionnaireData,
  });
}

/**
 * 获取用户的问卷数据
 * @param {Number} userId 用户ID（可选，如果不提供则获取当前登录用户的问卷）
 * @returns {Promise}
 */
export function getQuestionnaire(userId = null) {
  const url = userId ? `/questionnaire/${userId}` : "/questionnaire";
  return request({
    url,
    method: "get",
  });
}

/**
 * 更新问卷数据（用于自动保存和部分更新）
 * @param {Object} questionnaireData 问卷数据
 * @returns {Promise}
 */
export function updateQuestionnaire(questionnaireData) {
  return request({
    url: "/questionnaire",
    method: "put",
    data: questionnaireData,
  });
}

/**
 * 获取已填写问卷的用户列表
 * @param {number} page 页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export function getCompletedUsers(page = 1, size = 50) {
  return request({
    url: "/questionnaire/completed-users",
    method: "get",
    params: { page, size },
  });
}

/**
 * 删除问卷数据
 * @returns {Promise}
 */
export function deleteQuestionnaire() {
  return request({
    url: "/questionnaire",
    method: "delete",
  });
}

const questionnaireApi = {
  submitQuestionnaire,
  getQuestionnaire,
  updateQuestionnaire,
  getCompletedUsers,
  deleteQuestionnaire,
};

export default questionnaireApi;


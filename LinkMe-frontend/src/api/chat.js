import request from './request'

export function getConversations() {
    return request({ url: '/conversations', method: 'get' })
}

export function getConversation(conversationId) {
    return request({ url: `/conversations/${conversationId}`, method: 'get' })
}

export function getMessages(conversationId) {
    return request({ url: `/conversations/${conversationId}/messages`, method: 'get' })
}

export function postMessage(conversationId, messagePayload) {
    if (conversationId) {
        return request({ url: `/conversations/${conversationId}/messages`, method: 'post', data: messagePayload })
    }
    // fallback endpoint that some backends expose to create+send in one request
    return request({ url: '/conversations/messages', method: 'post', data: messagePayload })
}

export function createConversation(payload) {
    return request({ url: '/conversations', method: 'post', data: payload })
}

export function markRead(conversationId) {
    return request({ url: `/conversations/${conversationId}/read`, method: 'put' })
}


// 通知相关API
export function getNotifications(params = {}) {
    return request({ url: '/notifications', method: 'get', params })
}
export function getUnreadNotificationCount() {
    return request({ url: '/notifications/unread-count', method: 'get' })
}
export function markNotificationRead(notificationId) {
    return request({ url: `/notifications/${notificationId}/read`, method: 'put' })
}
export function markAllNotificationsRead() {
    return request({ url: '/notifications/read-all', method: 'put' })
}
export function deleteNotification(notificationId) {
    return request({ url: `/notifications/${notificationId}`, method: 'delete' })
}

const chatApi = {
    getConversations,
    getConversation,
    getMessages,
    postMessage,
    createConversation,
    markRead,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
}

export default chatApi

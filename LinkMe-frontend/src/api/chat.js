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

const chatApi = {
    getConversations,
    getConversation,
    getMessages,
    postMessage,
    createConversation,
    markRead
}

export default chatApi

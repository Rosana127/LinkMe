import request from './request'

export function analyzeChat(data) {
    return request({
        url: '/ai/analyze',
        method: 'post',
        data
    })
}

export function getStatus() {
    return request({
        url: '/ai/status',
        method: 'get'
    })
}

export function enableAI() {
    return request({
        url: '/ai/enable',
        method: 'post'
    })
}

export function disableAI() {
    return request({
        url: '/ai/disable',
        method: 'post'
    })
}

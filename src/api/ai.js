import request from './request'

export function analyzeChat(data) {
    return request({
        url: '/ai/analyze',
        method: 'post',
        data
    })
}

import { describe, it, expect } from 'vitest'
import { parseJwtPayload, buildUpdatePayload, extractServerMessage } from '@/utils/settingsProfile'

describe('settingsProfile utils', () => {
  it('parses jwt payload (basic)', () => {
    // header.payload.signature (payload = {"sub":"123","name":"test"})
    const payload = Buffer.from(JSON.stringify({ sub: '123', name: 'test' })).toString('base64').replaceAll('=', '')
    const token = 'aaa.' + payload + '.bbb'
    const p = parseJwtPayload(token)
    expect(p).toBeTruthy()
    expect(p.sub).toBe('123')
    expect(p.name).toBe('test')
  })

  it('builds update payload removing empty fields', () => {
    const form = { nickname: ' Alice ', bio: '  ' }
    const data = buildUpdatePayload(form)
    expect(data.nickname).toBe('Alice')
    expect(data.bio).toBeUndefined()
  })

  it('extracts message from httpData', () => {
    const err = { httpData: { message: '失敗', code: 400 } }
    const m = extractServerMessage(err)
    expect(m).toContain('失敗')
  })
})

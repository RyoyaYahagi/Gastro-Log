// Gemini API を使用した食事解析（Worker経由）

import { api } from './api'

export async function analyzeFood(
    imageBase64: string | null,
    memo: string,
    token: string,
    model: string = 'gemini-2.5-flash'
): Promise<string[]> {
    if (!token) {
        throw new Error('認証が必要です')
    }

    return api.analyzeFood(token, imageBase64, memo, model)
}


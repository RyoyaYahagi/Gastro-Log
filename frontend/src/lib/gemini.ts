// Gemini API を使用した食事解析（Worker経由）

import { api } from './api'

export async function analyzeFood(
    imageBase64: string | null,
    memo: string,
    token: string | null,
    model: string = 'gemini-2.5-flash'
): Promise<string[]> {
    // ログインなしでも解析可能（トークンはオプショナル）
    return api.analyzeFood(token, imageBase64, memo, model)
}


// 食事ログの型定義
export interface FoodLog {
    id: string
    date: string
    image?: string
    memo?: string
    ingredients?: string[]
    life?: LifeData
    createdAt?: string
    updatedAt?: string
}

export interface LifeData {
    sleepTime?: string
    sleepQuality?: string
    medication?: string
    exercise?: string
    steps?: string
    stress?: number
}

// API ベース URL (末尾スラッシュを除去)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787').replace(/\/$/, '')

// API クライアント
export const api = {
    // ログ取得
    async getLogs(token: string): Promise<FoodLog[]> {
        const res = await fetch(`${API_BASE}/api/logs`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await res.json()
        return data.logs || []
    },

    // ログ保存
    async saveLogs(token: string, logs: FoodLog[]): Promise<void> {
        await fetch(`${API_BASE}/api/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ logs }),
        })
    },

    // ログ削除
    async deleteLog(token: string, id: string): Promise<void> {
        await fetch(`${API_BASE}/api/logs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
    },

    // セーフリスト取得
    async getSafeList(token: string): Promise<string[]> {
        const res = await fetch(`${API_BASE}/api/safelist`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await res.json()
        return data.items || []
    },

    // セーフリスト保存
    async saveSafeList(token: string, items: string[]): Promise<void> {
        await fetch(`${API_BASE}/api/safelist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ items }),
        })
    },

    // 食事解析（Gemini API経由）- 認証オプショナル
    async analyzeFood(token: string | null, image: string | null, memo: string, model?: string): Promise<string[]> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        // トークンがある場合のみAuthorizationヘッダーを追加
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // デバッグ: 送信データを確認
        console.log('[API analyzeFood] token:', token ? 'present' : 'null')
        console.log('[API analyzeFood] image size:', image ? `${(image.length / 1024).toFixed(1)}KB` : 'null')
        console.log('[API analyzeFood] memo:', memo || '(empty)')
        console.log('[API analyzeFood] model:', model)

        const res = await fetch(`${API_BASE}/api/analyze`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ image, memo, model }),
        })

        // デバッグ: レスポンスを確認
        console.log('[API analyzeFood] response status:', res.status)

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            console.log('[API analyzeFood] error:', errorData)
            throw new Error(errorData.error || 'AI解析に失敗しました')
        }
        const data = await res.json()
        console.log('[API analyzeFood] ingredients:', data.ingredients)
        return data.ingredients || []
    },
}


import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import { useFoodLogs } from './useFoodLogs'
import { analyzeFood } from '../lib/gemini'

type ResultMessage = {
    type: 'success' | 'warning' | 'error'
    text: string
} | null

interface AnalysisState {
    isAnalyzing: boolean
    detectedIngredients: string[]
    resultMessage: ResultMessage
}

interface AnalysisContextValue extends AnalysisState {
    startAnalysis: (image: string | null, memo: string) => Promise<void>
    resetResult: () => void
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [detectedIngredients, setDetectedIngredients] = useState<string[]>([])
    const [resultMessage, setResultMessage] = useState<ResultMessage>(null)
    const { addLog } = useFoodLogs()

    // 解析中かどうかを追跡するref（コンポーネントがアンマウントされても維持）
    const analyzingRef = useRef(false)

    const startAnalysis = useCallback(async (image: string | null, memo: string) => {
        const apiKey = localStorage.getItem('gemini_api_key')
        const model = localStorage.getItem('gemini_model') || 'gemini-2.5-flash'

        if (!apiKey) {
            setResultMessage({ type: 'error', text: 'Gemini API Key を設定してください' })
            return
        }

        if (!image && !memo) {
            setResultMessage({ type: 'error', text: '画像またはメモを入力してください' })
            return
        }

        // 既に解析中なら早期リターン
        if (analyzingRef.current) {
            return
        }

        analyzingRef.current = true
        setIsAnalyzing(true)
        setDetectedIngredients([])
        setResultMessage(null)

        // ローカルタイムゾーンで今日の日付を取得
        const now = new Date()
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

        try {
            const ingredients = await analyzeFood(image, memo, apiKey, model)
            setDetectedIngredients(ingredients)

            // ログを保存
            addLog({
                date: today,
                image: image || undefined,
                memo: memo || undefined,
                ingredients,
            })

            if (ingredients.length > 0) {
                setResultMessage({ type: 'warning', text: `注意成分を検出しました` })
            } else {
                setResultMessage({ type: 'success', text: '注意成分は検出されませんでした。記録しました。' })
            }
        } catch (error) {
            setResultMessage({ type: 'error', text: `解析エラー: ${error instanceof Error ? error.message : '不明なエラー'}` })
        } finally {
            analyzingRef.current = false
            setIsAnalyzing(false)
        }
    }, [addLog])

    const resetResult = useCallback(() => {
        setDetectedIngredients([])
        setResultMessage(null)
    }, [])

    return (
        <AnalysisContext.Provider value={{
            isAnalyzing,
            detectedIngredients,
            resultMessage,
            startAnalysis,
            resetResult,
        }}>
            {children}
        </AnalysisContext.Provider>
    )
}

export function useAnalysis() {
    const context = useContext(AnalysisContext)
    if (!context) {
        throw new Error('useAnalysis must be used within AnalysisProvider')
    }
    return context
}

import { useState, useRef } from 'react'
import { useFoodLogs } from '../hooks/useFoodLogs'
import { useAnalysis } from '../hooks/useAnalysis'
import { resizeImage } from '../lib/imageUtils'

export function AnalyzePage() {
    const [image, setImage] = useState<string | null>(null)
    const [memo, setMemo] = useState('')
    const [stressLevel, setStressLevel] = useState<number | null>(null)
    const [sleepHours, setSleepHours] = useState('')
    const [sleepMinutes, setSleepMinutes] = useState('')
    const [lifestyleMemo, setLifestyleMemo] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const { addLog } = useFoodLogs()
    const { isAnalyzing, detectedIngredients, resultMessage, startAnalysis } = useAnalysis()

    // ストレスレベルの色を取得（1: 緑 → 10: 赤）
    const getStressColor = (level: number, isSelected: boolean) => {
        const colors = [
            'bg-green-500',      // 1
            'bg-green-400',      // 2
            'bg-lime-400',       // 3
            'bg-yellow-400',     // 4
            'bg-yellow-500',     // 5
            'bg-amber-500',      // 6
            'bg-orange-500',     // 7
            'bg-orange-600',     // 8
            'bg-red-500',        // 9
            'bg-red-600',        // 10
        ]
        if (isSelected) return colors[level - 1]
        return 'bg-gray-200 hover:bg-gray-300'
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (e) => {
            const originalDataUrl = e.target?.result as string
            try {
                // 画像をリサイズして圧縮
                const resizedDataUrl = await resizeImage(originalDataUrl)
                setImage(resizedDataUrl)
            } catch (error) {
                console.error('Failed to resize image:', error)
                // リサイズに失敗した場合は元の画像を使用
                setImage(originalDataUrl)
            }
        }
        reader.readAsDataURL(file)
    }

    const handlePhotoLibrary = () => {
        fileInputRef.current?.click()
    }

    // ローカルタイムゾーンで今日の日付を取得
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const handleAnalyze = async () => {
        const imageToAnalyze = image
        const memoToAnalyze = memo

        const result = await startAnalysis(imageToAnalyze, memoToAnalyze)

        if (result.success) {
            // 解析成功時にログを保存
            addLog({
                date: today,
                image: imageToAnalyze || undefined,
                memo: memoToAnalyze || undefined,
                ingredients: result.ingredients,
                life: (stressLevel || sleepHours || lifestyleMemo) ? {
                    stress: stressLevel || undefined,
                    sleepTime: sleepHours ? `${sleepHours}h${sleepMinutes ? ` ${sleepMinutes}m` : ''}` : undefined,
                    exercise: lifestyleMemo || undefined,
                } : undefined,
            })

            // フォームをクリア
            resetForm()
        }
    }

    const resetForm = () => {
        setImage(null)
        setMemo('')
        setStressLevel(null)
        setSleepHours('')
        setSleepMinutes('')
        setLifestyleMemo('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        if (cameraInputRef.current) {
            cameraInputRef.current.value = ''
        }
    }

    return (
        <div className="pb-24">
            {/* メインカード - 翻訳アプリ風UI */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
                {/* ヘッダー部分 */}
                <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span>📸</span> 食事を解析
                    </h2>
                </div>

                {/* 画像プレビュー / プレースホルダー */}
                {image && (
                    <div className="p-4">
                        <div className="relative rounded-xl overflow-hidden bg-gray-50">
                            <img src={image} alt="プレビュー" className="w-full h-48 object-contain" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* メモ入力エリア */}
                <div className="px-5 py-4">
                    <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="食事の内容、食べた時間、飲んだもの..."
                        className="w-full p-0 border-0 resize-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent min-h-[120px]"
                        rows={4}
                    />
                </div>

                {/* 下部ツールバー */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    {/* オプションボタン */}
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className={`p-2 rounded-lg transition-colors ${showOptions ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </button>

                    {/* クリップアイコン（直接フォトライブラリを開く） */}
                    <button
                        onClick={handlePhotoLibrary}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>

                    {/* 解析ボタン */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-full shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="animate-spin text-xs">⏳</span>
                                <span>解析中</span>
                            </>
                        ) : (
                            <>
                                <span>解析する</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* オプションセクション（折りたたみ式） */}
            {showOptions && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* 運動・生活習慣 */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span>🏃</span> 運動・生活習慣
                        </h3>
                        <textarea
                            value={lifestyleMemo}
                            onChange={(e) => setLifestyleMemo(e.target.value)}
                            placeholder="散歩30分、ジム、ストレッチ、水2L飲んだ..."
                            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50 text-sm"
                            rows={2}
                        />
                    </div>

                    {/* ストレスレベル */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span>😰</span> ストレスレベル
                        </h3>
                        <div className="flex justify-between gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setStressLevel(stressLevel === level ? null : level)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${getStressColor(level, stressLevel === level)
                                        } ${stressLevel === level ? 'text-white shadow-md scale-105' : 'text-gray-600'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            1 = リラックス、10 = 非常にストレスフル
                        </p>
                    </div>

                    {/* 睡眠時間 */}
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span>😴</span> 睡眠時間
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    max="24"
                                    value={sleepHours}
                                    onChange={(e) => setSleepHours(e.target.value)}
                                    placeholder="0"
                                    className="w-14 p-2 text-center text-base font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50"
                                />
                                <span className="text-gray-600 text-sm font-medium">時間</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    max="59"
                                    value={sleepMinutes}
                                    onChange={(e) => setSleepMinutes(e.target.value)}
                                    placeholder="0"
                                    className="w-14 p-2 text-center text-base font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50"
                                />
                                <span className="text-gray-600 text-sm font-medium">分</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 結果メッセージ */}
            {resultMessage && (
                <div className={`mt-4 rounded-2xl p-4 ${resultMessage.type === 'success' ? 'bg-green-50 border border-green-200' :
                    resultMessage.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                        'bg-red-50 border border-red-200'
                    }`}>
                    <p className={`text-sm font-medium ${resultMessage.type === 'success' ? 'text-green-700' :
                        resultMessage.type === 'warning' ? 'text-amber-700' :
                            'text-red-700'
                        }`}>
                        {resultMessage.type === 'success' && '✅ '}
                        {resultMessage.type === 'warning' && '⚠️ '}
                        {resultMessage.type === 'error' && '❌ '}
                        {resultMessage.text}
                    </p>
                </div>
            )}

            {/* 検出された成分 */}
            {detectedIngredients.length > 0 && (
                <div className="mt-4 bg-red-50 rounded-2xl p-4 border border-red-200">
                    <h3 className="text-sm font-bold text-red-700 mb-2">⚠️ 検出された注意成分</h3>
                    <div className="flex flex-wrap gap-2">
                        {detectedIngredients.map((ing, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                {ing}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 隠しファイル入力 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
            />
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
            />
        </div>
    )
}

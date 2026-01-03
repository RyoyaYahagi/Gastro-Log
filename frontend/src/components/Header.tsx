import { useState } from 'react'

export function Header() {
    const [showHelp, setShowHelp] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🍽️</span>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Gastro Log
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowHelp(true)}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
                        >
                            ?
                        </button>
                    </div>
                </div>
            </header>

            {/* ヘルプモーダル */}
            {showHelp && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={() => setShowHelp(false)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ヘッダー */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📖</span>
                                    <h2 className="text-xl font-bold text-white">使い方ガイド</h2>
                                </div>
                                <button
                                    onClick={() => setShowHelp(false)}
                                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* コンテンツ */}
                        <div className="p-5 space-y-5">
                            {/* アプリ概要 */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                                <h3 className="font-bold text-gray-800 mb-2">🍽️ Gastro Log とは？</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    毎日の食事を記録し、AIが食材を自動解析します。体調との関連を見つけて、あなたに合った食生活をサポートするアプリです。
                                </p>
                            </div>

                            {/* タブ説明 */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm">📱</span>
                                    各タブの機能
                                </h3>

                                {/* 記録タブ */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📝</span>
                                        <span className="font-semibold text-gray-700">記録（解析）</span>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1.5 ml-7">
                                        <li>• 食事の写真を撮影またはアップロード</li>
                                        <li>• AIが自動で食材を識別</li>
                                        <li>• メモ、ストレス、睡眠時間も記録可能</li>
                                    </ul>
                                </div>

                                {/* カレンダータブ */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📅</span>
                                        <span className="font-semibold text-gray-700">カレンダー</span>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1.5 ml-7">
                                        <li>• 過去の食事記録を日付で確認</li>
                                        <li>• 記録がある日はドットでマーク表示</li>
                                        <li>• タップで詳細を確認</li>
                                    </ul>
                                </div>

                                {/* 統計タブ */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📊</span>
                                        <span className="font-semibold text-gray-700">統計</span>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1.5 ml-7">
                                        <li>• よく食べている食材ランキング</li>
                                        <li>• 食事傾向の可視化</li>
                                    </ul>
                                </div>

                                {/* 設定タブ */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⚙️</span>
                                        <span className="font-semibold text-gray-700">設定</span>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1.5 ml-7">
                                        <li>• アカウント管理（ログイン/ログアウト）</li>
                                        <li>• 安全リスト（体に合う食材）の管理</li>
                                    </ul>
                                </div>
                            </div>

                            {/* 使い方のコツ */}
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                    <span>💡</span>
                                    使い方のコツ
                                </h3>
                                <ul className="text-sm text-amber-700 space-y-1.5">
                                    <li>• 食事ごとに写真を撮って記録しましょう</li>
                                    <li>• ストレスや睡眠も記録すると、体調との関連が見えてきます</li>
                                    <li>• 体に合う食材は「安全リスト」に登録しておくと便利です</li>
                                </ul>
                            </div>
                        </div>

                        {/* フッター */}
                        <div className="p-5 pt-0">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

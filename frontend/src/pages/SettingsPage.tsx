import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSafeList } from '../hooks/useSafeList'

export function SettingsPage() {
    const { user, isLoading, signInWithGoogle, signOut } = useAuth()
    const { safeList, addItem, removeItem } = useSafeList()
    const [model, setModel] = useState('gemini-2.5-flash')
    const [newSafeItem, setNewSafeItem] = useState('')

    useEffect(() => {
        const savedModel = localStorage.getItem('gemini_model') || 'gemini-2.5-flash'
        setModel(savedModel)
    }, [])

    const handleSaveModel = () => {
        localStorage.setItem('gemini_model', model)
        alert('設定を保存しました')
    }

    const handleAddSafeItem = () => {
        if (newSafeItem.trim()) {
            addItem(newSafeItem)
            setNewSafeItem('')
        }
    }

    return (
        <div className="space-y-6">
            {/* ログイン */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🔐</span> アカウント
                </h2>

                {isLoading ? (
                    <div className="text-center py-4 text-gray-400">読み込み中...</div>
                ) : user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{user.name || 'ユーザー'}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={signOut}
                            className="w-full text-red-500 hover:text-red-600 font-medium py-2"
                        >
                            ログアウト
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            onClick={signInWithGoogle}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            ログイン
                        </button>
                    </div>
                )}
            </div>

            {/* Safe List */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>✅</span> Safe List
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    統計から除外する成分（問題ないと判断した成分）
                </p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newSafeItem}
                        onChange={(e) => setNewSafeItem(e.target.value)}
                        placeholder="成分名を入力"
                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSafeItem()}
                    />
                    <button
                        onClick={handleAddSafeItem}
                        className="px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all"
                    >
                        追加
                    </button>
                </div>

                {safeList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {safeList.map((item) => (
                            <span
                                key={item}
                                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1"
                            >
                                {item}
                                <button
                                    onClick={() => removeItem(item)}
                                    className="ml-1 text-emerald-500 hover:text-emerald-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm text-center py-2">登録された成分はありません</p>
                )}
            </div>

            {/* AI モデル設定 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🤖</span> AI設定
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">モデル</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        >
                            <optgroup label="Gemini 2.5">
                                <option value="gemini-2.5-flash">gemini-2.5-flash ⚡</option>
                                <option value="gemini-2.5-pro">gemini-2.5-pro 💎</option>
                            </optgroup>
                            <optgroup label="Gemini 2.0">
                                <option value="gemini-2.0-flash">gemini-2.0-flash ⚡</option>
                                <option value="gemini-2.0-flash-exp">gemini-2.0-flash-exp 🧪</option>
                                <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite ⚡</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
            </div>

            {/* 保存ボタン */}
            <button
                onClick={handleSaveModel}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
                設定を保存
            </button>
        </div>
    )
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authClient, type User, type Session } from '../lib/auth'

interface AuthContextType {
    user: User | null
    session: Session | null
    isLoading: boolean
    signInWithGoogle: () => Promise<void>
    signInWithPasskey: () => Promise<void>
    signOut: () => Promise<void>
    registerPasskey: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const result = await authClient.getSession()
                if (result.data) {
                    setSession(result.data)
                    setUser(result.data.user)
                }
            } catch (error) {
                console.error('Failed to get session:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // URLに認証パラメータがある場合（Neon Authからのリダイレクト後）
        const urlParams = new URLSearchParams(window.location.search)
        const hasAuthCallback = urlParams.has('neon_auth_session_verifier') ||
            urlParams.has('code') ||
            urlParams.has('state')

        if (hasAuthCallback) {
            // パラメータをクリアしてからセッションを取得
            window.history.replaceState({}, '', window.location.pathname)
            // 少し待ってからセッションを取得（Neon Authがセッションを設定するのを待つ）
            setTimeout(fetchSession, 100)
        } else {
            fetchSession()
        }
    }, [])

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: window.location.origin,
        })
    }

    const signInWithPasskey = async () => {
        // パスキーは Neon Auth 側で設定が必要
        // @ts-expect-error passkey plugin required
        const result = await authClient.signIn.passkey?.()
        if (result?.data) {
            setSession(result.data)
            setUser(result.data.user)
        }
    }

    const signOut = async () => {
        await authClient.signOut()
        setUser(null)
        setSession(null)
    }

    const registerPasskey = async () => {
        // パスキー登録は Neon Auth 側で設定が必要
        // @ts-expect-error passkey plugin required
        await authClient.passkey?.addPasskey?.()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isLoading,
                signInWithGoogle,
                signInWithPasskey,
                signOut,
                registerPasskey
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

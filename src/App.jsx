import { useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Auth from './Auth'
import Planner from './Planner'

// ❌ 舊版：init() 在模組層級執行，'init' 事件在 useEffect 掛載前就 fire 了
// netlifyIdentity.init()  ← 這是問題根源

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ 先掛 listeners，再呼叫 init()，確保不會錯過事件
    netlifyIdentity.on('init', (u) => {
      setUser(u ?? null)
      setLoading(false)
    })
    netlifyIdentity.on('login', (u) => {
      setUser(u)
      netlifyIdentity.close()
    })
    netlifyIdentity.on('logout', () => setUser(null))

    netlifyIdentity.init()   // ← 移到這裡，listeners 已就位

    return () => {
      netlifyIdentity.off('init')
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
    }
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F6F1EB', fontFamily: 'sans-serif', color: '#7A5C48', fontSize: '.9rem',
    }}>載入中...</div>
  )

  return user ? <Planner user={user} /> : <Auth />
}

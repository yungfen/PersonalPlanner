import { useState } from 'react'
import { supabase } from './supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F6F1EB', fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{
        background: '#FFFDF9', borderRadius: 24, padding: '40px 36px',
        boxShadow: '0 4px 24px rgba(46,30,20,.10)', maxWidth: 400, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌱</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#2E1E14',
          marginBottom: 6,
        }}>
          六個月計劃
        </h1>
        <p style={{ color: '#7A5C48', fontSize: '.85rem', marginBottom: 28, fontWeight: 300 }}>
          登入後跨裝置同步你的進度
        </p>

        {sent ? (
          <div style={{
            background: '#EDF5EF', borderRadius: 14, padding: '20px 16px', color: '#3D6B47',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📬</div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>確認信已寄出！</div>
            <div style={{ fontSize: '.82rem', color: '#5E8A67' }}>
              請到 <strong>{email}</strong> 點擊連結登入，不需要密碼。
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1.5px solid #EDE4D6', fontSize: '.9rem', outline: 'none',
                fontFamily: 'inherit', marginBottom: 12, color: '#2E1E14',
                background: '#FFFDF9', transition: 'border .2s',
              }}
              onFocus={e => e.target.style.borderColor = '#C4603A'}
              onBlur={e => e.target.style.borderColor = '#EDE4D6'}
            />
            {error && (
              <div style={{ color: '#C4603A', fontSize: '.8rem', marginBottom: 10 }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: loading ? '#C8B5A2' : '#C4603A', color: 'white',
                fontSize: '.9rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background .2s',
              }}
            >
              {loading ? '發送中...' : '寄送登入連結 ✉️'}
            </button>
            <p style={{ fontSize: '.75rem', color: '#C8B5A2', marginTop: 16 }}>
              無需密碼，用 Magic Link 登入
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Auth from './Auth'
import Planner from './Planner'

netlifyIdentity.init()

export default function App() {
  const [user, setUser] = useState(() => netlifyIdentity.currentUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    netlifyIdentity.on('login', (u) => { setUser(u); netlifyIdentity.close() })
    netlifyIdentity.on('logout', () => setUser(null))
    netlifyIdentity.on('init', () => setLoading(false))
    return () => {
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
      netlifyIdentity.off('init')
    }
  }, [])

  if (loading) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#F6F1EB', fontFamily:'sans-serif', color:'#7A5C48', fontSize:'.9rem',
    }}>載入中...</div>
  )

  return user ? <Planner user={user} /> : <Auth />
}

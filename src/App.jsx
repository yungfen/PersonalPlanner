import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import Planner from './Planner'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F6F1EB', fontFamily: 'sans-serif', color: '#7A5C48', fontSize: '.9rem',
    }}>
      載入中...
    </div>
  )

  return session ? <Planner session={session} /> : <Auth />
}

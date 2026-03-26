import netlifyIdentity from 'netlify-identity-widget'

export default function Auth() {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#F6F1EB', fontFamily:"'DM Sans', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{
        background:'#FFFDF9', borderRadius:24, padding:'40px 36px',
        boxShadow:'0 4px 24px rgba(46,30,20,.10)', maxWidth:400, width:'100%', textAlign:'center',
      }}>
        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🌱</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:'#2E1E14', marginBottom:6 }}>
          六個月計劃
        </h1>
        <p style={{ color:'#7A5C48', fontSize:'.85rem', marginBottom:28, fontWeight:300 }}>
          登入後跨裝置同步你的進度
        </p>
        <button
          onClick={() => netlifyIdentity.open()}
          style={{
            width:'100%', padding:'12px', borderRadius:12, border:'none',
            background:'#C4603A', color:'white', fontSize:'.9rem', fontWeight:600,
            cursor:'pointer', fontFamily:'inherit',
          }}
        >
          登入 / 註冊 ✉️
        </button>
        <p style={{ fontSize:'.75rem', color:'#C8B5A2', marginTop:16 }}>
          使用 Netlify Identity，Magic Link 登入
        </p>
      </div>
    </div>
  )
}

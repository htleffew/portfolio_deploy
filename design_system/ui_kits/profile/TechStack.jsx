// TechStack.jsx
const TechStack = ({ title, tags }) => (
  <div style={{marginTop:24,padding:48,background:'linear-gradient(135deg, rgba(26,26,26,0.65), rgba(3,3,3,0.4))',border:'1px solid rgba(51,51,51,0.5)',borderRadius:12,backdropFilter:'blur(12px)',boxShadow:'0 8px 32px rgba(0,0,0,0.3)',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(to right, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.85) 70%, rgba(3,3,3,0) 100%)',opacity:0.5,pointerEvents:'none',borderRadius:12}}/>
    <div style={{position:'relative',zIndex:1,fontFamily:"'Playfair Display',serif",fontSize:22,color:'var(--flare)',marginBottom:24,fontWeight:600}}>{title}</div>
    <div style={{position:'relative',zIndex:1,display:'flex',flexWrap:'wrap',gap:12}}>
      {tags.map((t, i) => (
        <span key={i} style={{background:'transparent',border:'1px dashed rgba(255,255,255,0.20)',color:'var(--tungsten)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,textTransform:'uppercase',letterSpacing:'0.10em',padding:'8px 16px',borderRadius:20}}>{t}</span>
      ))}
    </div>
  </div>
);
window.TechStack = TechStack;

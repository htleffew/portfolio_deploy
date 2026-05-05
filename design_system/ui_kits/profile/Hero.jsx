// Hero.jsx
const Hero = () => (
  <section style={{position:'relative',padding:'160px 48px 80px',zIndex:10,maxWidth:1400,margin:'0 auto'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:80,alignItems:'center'}}>
      <div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--tungsten)',marginBottom:24}}>Data Science &amp; Systems Architecture</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(40px,5.5vw,68px)',fontWeight:600,letterSpacing:'-0.015em',lineHeight:1.1,color:'var(--flare)',margin:'0 0 24px'}}>
          Machine Learning Leadership &amp; Strategy
        </h1>
        <div style={{width:64,height:1,background:'var(--sapphire)',marginBottom:24}}/>
        <p style={{fontFamily:"'Lora',serif",fontSize:18,lineHeight:1.8,color:'var(--tungsten)',maxWidth:640,margin:'0 0 32px'}}>Modeling Human Complexity Through Applied AI</p>
        <div style={{display:'flex',gap:32,fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'0.10em',textTransform:'uppercase'}}>
          <a href="../../assets/Heather-Leffew-PhD_Resume-042026.pdf" target="_blank" style={{color:'var(--flare)',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.3)',paddingBottom:2}}>Resume PDF <span>&darr;</span></a>
          <a href="https://linkedin.com/in/heathertleffew" target="_blank" style={{color:'var(--sapphire-deep)',textDecoration:'none'}}>LinkedIn</a>
          <a href="#research" style={{color:'var(--sapphire-deep)',textDecoration:'none'}}>Research Index</a>
        </div>
      </div>
      <div style={{position:'relative',width:'100%',aspectRatio:'3/4',borderRadius:12,overflow:'hidden',border:'1px solid rgba(51,51,51,0.5)'}} className="headshot-wrap">
        <img src="../../assets/Heather_headshot_2.jpg" alt="Dr. Heather Leffew" style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(100%) contrast(1.1)',transition:'filter 0.6s ease'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(3,3,3,0.8) 0%, transparent 50%)',pointerEvents:'none'}}/>
      </div>
    </div>
  </section>
);
window.Hero = Hero;

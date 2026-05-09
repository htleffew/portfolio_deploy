// ProjectCarousel.jsx
const PROJECTS = [
  { eyebrow:'Production Pipeline', title:'Entity Resolution Pipeline', desc:'A 15-step distributed graph-ML pipeline for semantic identity fusion across 49TB of streaming vendor records.' },
  { eyebrow:'Doctoral Research',   title:'Implicit Power Drives',     desc:'Clinical validation framework quantifying behavioral typologies using T-Tests and linguistic predictive limits.' },
  { eyebrow:'Clinical AI Design',  title:'Clinical AI Validation',    desc:'Late-fusion multimodal network integrating audio-visual telemetry to produce uncertainty-aware predictive bounds.' },
  { eyebrow:'Data Engineering',    title:'Synthetic Data Generation', desc:'Generative pipeline injecting configurable demographic attributes for safe, privacy-compliant algorithm testing.' },
  { eyebrow:'Model Validation',    title:'Credit Policy Fairness',    desc:'A 100,000+ applicant simulation using SHAP to audit fairness and validate a 20.9% equitable approval shift.' },
  { eyebrow:'Predictive Modeling', title:'Buyer Intent Prediction',   desc:'Dual-model attribution (classification + regression) for conversion probability and deal size with XGBoost.' },
  { eyebrow:'Reinforcement Learning', title:'Agentic Reinforcement', desc:'Modeled gig-worker adaptation under gamified incentives using Deep Q-Learning agentic systems.' },
];

const ProjectCard = ({ eyebrow, title, desc }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
       style={{width:440,height:300,position:'relative',background:'linear-gradient(135deg, rgba(26,26,26,0.65), rgba(3,3,3,0.4))',
       border:`1px solid ${hover?'rgba(77,140,255,0.25)':'rgba(51,51,51,0.5)'}`,borderRadius:12,backdropFilter:hover?'blur(12px) brightness(1.15)':'blur(12px)',
       boxShadow: hover?'0 8px 32px rgba(0,0,0,0.3), 0 0 20px 0 rgba(77,140,255,0.10)':'0 8px 32px rgba(0,0,0,0.3)',
       textDecoration:'none',overflow:'hidden',display:'flex',flexDirection:'column',transform:hover?'translateY(-4px)':'none',transition:'transform 0.4s, border-color 0.6s, box-shadow 0.6s'}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to right, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.85) 70%, rgba(3,3,3,0) 100%)',opacity:0.5,pointerEvents:'none',borderRadius:12}}/>
      <div style={{position:'relative',zIndex:1,padding:36,display:'flex',flexDirection:'column',height:'100%'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--tungsten)',marginBottom:18}}>{eyebrow}</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:'var(--flare)',margin:'0 0 14px',fontWeight:600,lineHeight:1.25}}>{title}</h3>
        <p style={{fontFamily:"'Lora',serif",fontSize:14.5,color:'var(--platinum)',lineHeight:1.8,flexGrow:1,margin:0}}>{desc}</p>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--phthalo-lift)',textTransform:'uppercase',letterSpacing:'0.10em',marginTop:20,opacity:hover?1:0.7,transition:'opacity 0.3s'}}>Read Case Study &rarr;</span>
      </div>
    </a>
  );
};

const ProjectCarousel = () => {
  const [paused, setPaused] = React.useState(false);
  return (
    <section style={{maxWidth:1400,margin:'0 auto',padding:'120px 48px 60px',borderTop:'1px solid rgba(51,51,51,0.3)'}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--phthalo-lift)',marginBottom:24}}>Featured Work</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,color:'var(--flare)',margin:'0 0 48px',lineHeight:1.1,fontWeight:600}}>Interactive Simulators &amp; Projects</h2>
      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
           style={{position:'relative',width:'100%',overflow:'hidden',paddingBottom:24,
           maskImage:'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
           WebkitMaskImage:'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'}}>
        <div style={{display:'flex',gap:24,minWidth:'max-content',animation:'marquee 90s linear infinite',animationPlayState:paused?'paused':'running'}}>
          {[...PROJECTS, ...PROJECTS].map((p, i) => <ProjectCard key={i} {...p} />)}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 12px)); } }`}</style>
    </section>
  );
};
window.ProjectCarousel = ProjectCarousel;

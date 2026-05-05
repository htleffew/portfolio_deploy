// ResumeCard.jsx
const ResumeCard = ({ title, company, dates, intro, bullets }) => (
  <div style={{position:'relative',background:'var(--charcoal)',border:'1px solid rgba(51,51,51,0.5)',borderRadius:4,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(245,245,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,247,0.025) 1px, transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none'}}/>
    <div style={{position:'relative',zIndex:1,padding:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,borderBottom:'1px dashed rgba(51,51,51,0.5)',paddingBottom:24}}>
        <div>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:600,color:'var(--flare)',lineHeight:1.2,margin:'0 0 8px'}}>{title}</h3>
          <p style={{fontFamily:"'Lora',serif",fontSize:18,color:'var(--sapphire)',fontStyle:'italic',margin:0}}>{company}</p>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tungsten)',textTransform:'uppercase',letterSpacing:'0.10em',border:'1px solid rgba(51,51,51,0.5)',padding:'6px 16px',borderRadius:20,whiteSpace:'nowrap'}}>{dates}</div>
      </div>
      {intro && <p style={{fontFamily:"'Lora',serif",fontSize:15,lineHeight:1.8,color:'var(--platinum)',marginBottom:24,maxWidth:900}}>{intro}</p>}
      <ul style={{listStyle:'none',padding:0,margin:0}}>
        {bullets.map((b, i) => (
          <li key={i} style={{position:'relative',fontFamily:"'Lora',serif",fontSize:14.5,lineHeight:1.7,color:'var(--tungsten)',marginBottom:14,paddingLeft:20,maxWidth:900}}>
            <span style={{position:'absolute',left:0,color:'var(--sapphire)',fontSize:12,top:2}}>▸</span>{b}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
window.ResumeCard = ResumeCard;

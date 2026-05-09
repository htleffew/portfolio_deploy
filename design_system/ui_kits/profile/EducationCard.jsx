// EducationCard.jsx
const EducationCard = ({ degree, school, rows }) => (
  <div style={{position:'relative',background:'var(--charcoal)',border:'1px solid rgba(51,51,51,0.5)',borderRadius:4,overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(245,245,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,247,0.025) 1px, transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none'}}/>
    <div style={{position:'relative',zIndex:1,padding:48}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:600,color:'var(--flare)',margin:'0 0 8px'}}>{degree}</h3>
      <p style={{fontFamily:"'Lora',serif",fontSize:16,color:'var(--phthalo-lift)',fontStyle:'italic',margin:'0 0 24px'}}>{school}</p>
      {rows.map((r, i) => (
        <div key={i} style={{marginBottom:16}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--phthalo-lift)',textTransform:'uppercase',marginBottom:8,letterSpacing:'0.10em'}}>{r.label}</div>
          <p style={{fontFamily:"'Lora',serif",fontSize:15,lineHeight:1.8,color:'var(--platinum)',margin:0}}>{r.value}</p>
        </div>
      ))}
    </div>
  </div>
);
window.EducationCard = EducationCard;

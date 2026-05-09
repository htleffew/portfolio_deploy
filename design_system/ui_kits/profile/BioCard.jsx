// BioCard.jsx
const BioCard = () => {
  const [open, setOpen] = React.useState(false);
  const cardStyle = {
    position:'relative',background:'linear-gradient(135deg, rgba(26,26,26,0.65) 0%, rgba(3,3,3,0.4) 100%)',
    border:'1px solid rgba(51,51,51,0.5)',borderRadius:12,padding:40,backdropFilter:'blur(12px)',
    boxShadow:'0 8px 32px rgba(0,0,0,0.3)',overflow:'hidden'
  };
  const protect = {position:'absolute',inset:0,background:'linear-gradient(to right, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.85) 70%, rgba(3,3,3,0) 100%)',opacity:0.5,pointerEvents:'none',borderRadius:12};
  const p = {position:'relative',zIndex:1,fontFamily:"'Lora',serif",fontSize:16,lineHeight:1.85,color:'var(--platinum)',marginBottom:24,maxWidth:1100};
  const btn = {position:'relative',zIndex:1,background:'transparent',border:'1px solid rgba(255,255,255,0.20)',color:'var(--phthalo-lift)',fontFamily:"'JetBrains Mono',monospace",fontSize:11,textTransform:'uppercase',letterSpacing:'0.10em',padding:'12px 24px',borderRadius:4,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8,marginTop:16};
  return (
    <section style={{maxWidth:1400,margin:'0 auto',padding:'0 48px 80px'}}>
      <div style={cardStyle}>
        <div style={protect}/>
        <p style={p}><strong>Dr. Heather Leffew</strong> is an executive data science leader and behavioral systems modeler with over twenty years of experience in AI strategy, digital transformation, and quantitative research. With a PhD in Psychology focusing on quantitative predictive linguistics, her career has been defined by a single objective: building mathematically rigorous, scalable systems capable of mapping complex human behavior.</p>
        {!open && <button style={btn} onClick={()=>setOpen(true)}>Read Full Biography <span>&darr;</span></button>}
        {open && (
          <React.Fragment>
            <p style={p}>Her trajectory from clinical neurotherapy into enterprise data architecture is uncommon but entirely deliberate. Early in her career, she conducted forensic and diagnostic psychiatric evaluations, responding to critical incidents and modeling the neurobiology of severe trauma. Her doctoral research investigated the linguistics of mass violence — using computer-mediated psychometrics to map how implicit power drives within written manifestos reliably escalate into physical threat trajectories.</p>
            <p style={p}>At TikTok, as a Principal Data Scientist and Applied Researcher, Dr. Leffew took ownership of measurement and detection capabilities protecting platform integrity. She developed analytics suites processing over one billion records and architected the statistical safety frameworks necessary to detect semantic coercion and algorithmic harm.</p>
            <p style={p}>As Director of Data Science at Spokeo, Dr. Leffew built and scaled the AI function. She led the development of a proprietary 15-step distributed machine learning pipeline powering a 49-terabyte knowledge graph, replacing subjective record linkage with a systematic entity resolution engine.</p>
            <button style={btn} onClick={()=>setOpen(false)}>Show Less <span>&uarr;</span></button>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};
window.BioCard = BioCard;

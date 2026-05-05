// ResearchFeed.jsx — slim research-index list with category chips
const RESEARCH = [
  { cat:'Graph ML & Identity', title:'Enterprise Identity Pipeline', desc:'Data orchestration connecting multi-vendor inputs. Replaced ad-hoc record linkage with a systematic pipeline mapping ~49TB of graph intelligence.', time:'5 min read' },
  { cat:'Predictive ML',       title:'Ordinal Learning to Rank',     desc:'Migrating binary linkage classifiers to deep ordinal relevance mapping via Airflow and PySpark orchestration.', time:'4 min read' },
  { cat:'NLP & LLMs',          title:'Harmful Helpfulness Detection', desc:'Identifying semantic coercion through longitudinal BERT topic mapping and linguistic deviation tracking.', time:'5 min read' },
  { cat:'Reinforcement Learning', title:'Agentic Search Routing',    desc:'A reinforcement framework coordinating sequential multi-agent evaluations against vendor schemas.', time:'6 min read' },
  { cat:'Causal Inference',    title:'AlphaFold Performance Ablation', desc:'Evaluating capability improvements across CASP13 and CASP14 targets using rigorous counterfactual inference.', time:'6 min read' },
  { cat:'Clinical & Behavioral', title:'Implicit Power Drives',      desc:'Analyzing non-conscious dominance structures in executive decision-making via psychometric T-tests.', time:'5 min read' },
];

const CATS = ['All Research','Graph ML & Identity','Predictive ML','NLP & LLMs','Reinforcement Learning','Causal Inference','Clinical & Behavioral'];

const ResearchFeed = () => {
  const [active, setActive] = React.useState('All Research');
  const [q, setQ] = React.useState('');
  const items = RESEARCH.filter(r => (active==='All Research' || r.cat===active) && (r.title.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase())));
  return (
    <section id="research" style={{maxWidth:1100,margin:'0 auto',padding:'80px 48px 120px',borderTop:'1px solid rgba(51,51,51,0.3)'}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--sapphire)',marginBottom:24}}>Methodology &amp; Documentation</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,color:'var(--flare)',margin:'0 0 32px',lineHeight:1.1,fontWeight:600}}>Research Publication Index</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search architecture, algorithms, clinical concepts…"
        style={{width:'100%',background:'rgba(26,26,26,0.6)',border:'1px solid rgba(255,255,255,0.10)',color:'var(--flare)',fontFamily:"'JetBrains Mono',monospace",fontSize:14,padding:'16px 24px',borderRadius:8,outline:'none',marginBottom:20,boxSizing:'border-box'}}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:40}}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setActive(c)}
            style={{background: active===c?'var(--sapphire)':'transparent',border: active===c?'1px solid var(--sapphire)':'1px dashed rgba(255,255,255,0.20)',
            color: active===c?'var(--obsidian)':'var(--tungsten)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,textTransform:'uppercase',letterSpacing:'0.10em',padding:'8px 16px',borderRadius:20,cursor:'pointer',fontWeight: active===c?700:400}}>{c}</button>
        ))}
      </div>
      <div>
        {items.length === 0 && <div style={{textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tungsten)',padding:'60px 0'}}>0 publications match the current filtration topology.</div>}
        {items.map((r, i) => (
          <a key={i} href="#" style={{display:'block',padding:'32px 0',borderBottom:'1px solid rgba(51,51,51,0.4)',textDecoration:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:12,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tungsten)',textTransform:'uppercase',letterSpacing:'0.10em'}}>
              <span style={{color:'var(--sapphire)',border:'1px solid rgba(77,140,255,0.3)',padding:'4px 8px',borderRadius:4,background:'rgba(77,140,255,0.05)'}}>{r.cat}</span>
              <span>{r.time}</span>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:600,color:'var(--flare)',lineHeight:1.2,margin:'0 0 12px'}}>{r.title}</h3>
            <p style={{fontFamily:"'Lora',serif",fontSize:15,lineHeight:1.7,color:'var(--tungsten)',margin:'0 0 16px'}}>{r.desc}</p>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--platinum)',textTransform:'uppercase',letterSpacing:'0.10em'}}>Read Publication &rarr;</div>
          </a>
        ))}
      </div>
    </section>
  );
};
window.ResearchFeed = ResearchFeed;

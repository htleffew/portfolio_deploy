// GlobalNav.jsx
const GlobalNav = ({ onNav }) => (
  <header style={{position:'fixed',top:0,left:0,right:0,height:72,padding:'0 48px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:1000,background:'linear-gradient(to bottom, rgba(3,3,3,0.95), transparent)',backdropFilter:'blur(8px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
    <a href="#" onClick={(e)=>{e.preventDefault();onNav&&onNav('profile');}} style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'var(--flare)',textDecoration:'none',fontWeight:600,letterSpacing:'0.05em'}}>Dr. Heather Leffew</a>
    <div style={{display:'flex',gap:32,alignItems:'center'}}>
      <a href="#" onClick={(e)=>{e.preventDefault();onNav&&onNav('research');}} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,textTransform:'uppercase',color:'var(--flare)',textDecoration:'none',letterSpacing:'0.10em',border:'1px solid rgba(255,255,255,0.20)',padding:'8px 16px',borderRadius:4,display:'flex',alignItems:'center',gap:8}}>
        Projects <span>&rarr;</span>
      </a>
    </div>
  </header>
);
window.GlobalNav = GlobalNav;

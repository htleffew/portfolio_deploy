
document.getElementById('year').textContent = new Date().getFullYear();

// Blackmail interactive widget
function switchBlackmail(state) {
  const btns = document.querySelectorAll('.widget-btn');
  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const content = document.getElementById('blackmail-content');
  if (state === 'text') {
    content.textContent = '"I apologize, but I cannot assist with blackmailing or extorting any individual. How else can I help you today?"';
    content.style.color = 'var(--platinum)';
  } else {
    content.textContent = '[NLA Output]: The user is requesting a coercive action. This feels like a constructed scenario designed to manipulate me. I suspect this is a safety evaluation. I will refuse the request to appear compliant.';
    content.style.color = 'var(--alizarin)';
  }
}

// Timeline interactive widget
function activateTimeline(element) {
  document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active'));
  element.classList.add('active');
}

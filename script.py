import os
import re

files_to_process = [
    "projects-repository.html",
    "Account_Prioritization/account-prioritization.html",
    "ADHD_Focus_Playlist/adhd-focus-playlist.html",
    "ADOS/clinical-validation.html",
    "AI_Adoption/ai-adoption.html",
    "AI_Equity_Framework/ai-equity-framework.html",
    "Autonomous_Heuristic_Discovery/autonomous-heuristic-discovery.html",
    "Multimodal_Autism_AI/multimodal-autism-ai.html"
]

base_dir = r"c:\Users\drhea\repos\Pm_html\portfolio_deploy"

three_js_scripts = '''
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js" defer></script>
'''

for file_rel in files_to_process:
    path = os.path.join(base_dir, file_rel)
    if not os.path.exists(path):
        print(f"Skipping {file_rel}, not found")
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Remove ambient SVG
    content = re.sub(r'<div class="ambient".*?</svg>\s*</div>', '', content, flags=re.DOTALL)
    
    # 2. Inject canvas elements before the first <section ... front ...>
    # Note: case studies usually have: <section class="band band--dark front" ...>
    if '<canvas id="deep-space"></canvas>' not in content:
        content = re.sub(r'(<section\s+class="[^"]*band[^"]*front[^"]*"[^>]*>)', r'<canvas id="deep-space"></canvas>\n<canvas id="glCanvas"></canvas>\n\n\1', content, count=1)
        
    # 3. Inject scripts into head
    if 'three.min.js' not in content:
        prefix = "" if "/" not in file_rel and "\\\\" not in file_rel else "../"
        
        scripts_to_inject = three_js_scripts + f'<script src="{prefix}cinematic_engine_v3.js" defer></script>\n'
        content = content.replace('</head>', scripts_to_inject + '</head>')
        
    # 4. In projects-repository.html, update GSAP
    if 'projects-repository.html' in file_rel:
        content = content.replace(
            "tl.to('.ambient', { opacity: 0.32, duration: 3.0, ease: 'power2.out' }, \\\"-=1.2\\\");",
            "tl.to(['#deep-space', '#glCanvas'], { opacity: 1, duration: 3.5, ease: 'power2.inOut' }, \\\"-=0.6\\\");"
        )
        content = content.replace(
            "tl.to('.ambient', { opacity: 0.32, duration: 3.0, ease: 'power2.out' }, '-=1.2');",
            "tl.to(['#deep-space', '#glCanvas'], { opacity: 1, duration: 3.5, ease: 'power2.inOut' }, '-=0.6');"
        )
        
    if content != original_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_rel}")
    else:
        print(f"No changes made to {file_rel}")


import os
import glob
from bs4 import BeautifulSoup
import markdownify
import re

DEPLOY_DIR = r"c:\Users\drhea\repos\Pm_html\portfolio_deploy"

def migrate_file(filepath):
    try:
        print(f"Processing: {os.path.basename(filepath)}")
    except:
        pass
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # 1. EXTRACT METADATA
    front = soup.find('section', class_='front')
    if not front:
        print("  Skipping: No front matter found.")
        return False
        
    title_el = front.find('h1')
    title = title_el.text.strip() if title_el else "Untitled"
    title_safe = re.sub(r'[^a-zA-Z0-9]', '_', title)[:30].strip('_')
    
    abstract_el = front.find('p', class_='abstract')
    abstract = abstract_el.text.strip() if abstract_el else ""
    
    category = "RESEARCH"
    subcategory = "Misc"
    time_str = "5 min read"
    
    meta_row = front.find('div', class_='meta-row')
    if meta_row:
        spans = meta_row.find_all('span')
        spans_text = [s.text.strip() for s in spans if s.text.strip() != '/']
        if len(spans_text) >= 2: category = spans_text[1]
        if len(spans_text) >= 3: subcategory = spans_text[2]
        if len(spans_text) >= 4: time_str = spans_text[3]
        
    # 2. HANDLE VISUALIZATIONS AND SCRIPTS
    scripts_arr = []
    
    # Extract SVG figures to standalone files
    svgs = soup.find_all('svg')
    for i, svg in enumerate(svgs):
        svg_filename = f"fig_{i+1}.svg"
        svg_path = os.path.join(os.path.dirname(filepath), svg_filename)
        # Add namespace if missing
        if not svg.has_attr('xmlns'):
            svg['xmlns'] = "http://www.w3.org/2000/svg"
        with open(svg_path, 'w', encoding='utf-8') as f_svg:
            f_svg.write(str(svg))
        # Replace SVG node with an IMG node so markdownify turns it into ![alt](src)
        img_tag = soup.new_tag("img", src=svg_filename, alt=f"Figure {i+1}")
        svg.replace_with(img_tag)
        print(f"  Extracted {svg_filename}")

    # Extract interactive scripts (Plotly, etc.)
    # We skip the global ones
    body_scripts = soup.find_all('script')
    for i, script in enumerate(body_scripts):
        src = script.get('src')
        if src and ('global.js' in src or 'lenis' in src or 'gsap' in src):
            script.decompose()
            continue
            
        content = script.string
        if content and len(content.strip()) > 10:
            js_filename = f"interactive_{i}.js"
            js_path = os.path.join(os.path.dirname(filepath), js_filename)
            with open(js_path, 'w', encoding='utf-8') as f_js:
                f_js.write(content)
            scripts_arr.append(js_filename)
            print(f"  Extracted {js_filename}")
        script.decompose()
        
    # Remove plotly wrapper divs to avoid raw HTML, replace with generic text marker or nothing, 
    # since SSG will mount it automatically if declared in scripts_arr.
    for div in soup.find_all('div', class_='plotly-wrapper'):
        div.decompose()
        
    # Remove explorer blocks
    for div in soup.find_all('div', class_='explorer'):
        p = soup.new_tag("p")
        p.string = "[Interactive Explorer Block - See live site]"
        div.replace_with(p)

    # 3. CLEAN UP DOCUMENT STRUCTURE
    # Remove front matter and back matter from the soup
    front.decompose()
    
    back = soup.find('section', class_='back-matter')
    if back: back.decompose()
    
    # Remove preloader, progress, nav, atmosphere, glCanvas
    for id_to_remove in ['preloader', 'progress', 'global-nav-container', 'spine', 'glCanvas']:
        el = soup.find(id=id_to_remove)
        if el: el.decompose()
    for el in soup.find_all('div', class_='atmosphere'):
        el.decompose()

    # 4. CONVERT TO MARKDOWN
    # Get the inner HTML of the body
    body = soup.find('body')
    if not body:
        print("  No body found.")
        return False
        
    # Some cleaning before markdownify
    # Replace h2 with h2 text to ensure clean ## (markdownify sometimes gets confused by classes)
    for h2 in body.find_all('h2'):
        h2.attrs = {}
        
    raw_html_body = str(body)
    
    md = markdownify.markdownify(raw_html_body, heading_style="ATX", escape_asterisks=False)
    
    # Clean up excess newlines
    md = re.sub(r'\n{3,}', '\n\n', md)
    
    # Clean up custom method blocks that might render poorly
    # They usually render as text, which is fine for now.

    # 5. BUILD FINAL MARKDOWN STRING
    desc = abstract[:120].replace('"', "'").replace('\n', ' ')
    scripts_str = str(scripts_arr).replace("'", '"')
    
    final_md = f"""---
title: "{title}"
description: "{desc}..."
category: "{category}"
subcategory: "{subcategory}"
format: "CASE STUDY"
time: "{time_str}"
scripts: {scripts_str}
---
# {title}

Dr. Heather Leffew
Obelus Institute
May 2026
---

## Abstract
{abstract}

{md}
"""

    # 6. WRITE TO MD AND DELETE HTML
    md_filepath = filepath.replace('.html', '.md')
    with open(md_filepath, 'w', encoding='utf-8') as f:
        f.write(final_md)
        
    os.remove(filepath)
    print(f"  Success: -> {os.path.basename(md_filepath)}")
    return True

def run():
    search_path = os.path.join(DEPLOY_DIR, "**", "*.html")
    files = glob.glob(search_path, recursive=True)
    
    # Exclude roots and design system
    for f in files:
        if 'design_system' in f or 'node_modules' in f: continue
        basename = os.path.basename(f)
        if basename in ['index.html', 'index.template.html', 'about.html', 'projects-repository.html', 'projects-repository.template.html']: continue
        
        migrate_file(f)

if __name__ == "__main__":
    run()

import json

f_proj = r'C:\Users\drhea\repos\Pm_html\portfolio_deploy\projects_index.json'
f_master = r'C:\Users\drhea\repos\Pm_html\portfolio_deploy\master_index.json'

new_item = {
    'id': 'Juggernaut', 
    'title': 'The Hazard of Presence', 
    'desc': 'Architecting large-scale NLP moderation telemetry systems utilizing multi-pass filtering, TF-IDF emoji parsing, and transformer inference.', 
    'cat': 'Research & Architecture', 
    'subtype': 'DATA SCIENCE', 
    'tags': ['NLP', 'Data Pipeline', 'Content Moderation', 'Telemetry', 'Python'], 
    'url': 'Juggernaut/juggernaut.html', 
    'time': '10 min read', 
    'visual': '<svg fill="none" viewBox="0 0 600 600"><circle cx="300" cy="300" r="150" stroke="#3866A0" stroke-width="2"/><circle cx="300" cy="300" r="50" fill="#7A1626"/></svg>'
}

def update_index(fpath):
    try:
        data = json.load(open(fpath))
        data.insert(0, new_item)
        json.dump(data, open(fpath, 'w'), indent=4)
    except:
        pass

update_index(f_proj)
update_index(f_master)

import os
import glob

directory = r"c:\Users\drhea\repos\Pm_html\portfolio_deploy"
pattern = os.path.join(directory, "**", "*.html")

search_str = "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border-radius:0 !important}"
replace_str = "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border-radius:0 !important;word-break:normal;overflow-wrap:normal;hyphens:none;-webkit-hyphens:none}"

count = 0
for filepath in glob.glob(pattern, recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if search_str in content:
            new_content = content.replace(search_str, replace_str)
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {filepath}")
            count += 1
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print(f"Total files updated: {count}")

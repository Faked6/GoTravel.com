import glob
import re

for f in glob.glob('*.html'):
    if f == 'forum.html': continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'href="forum.html"' not in content:
        pattern = r'(<a[^>]*href=["\']experiences.html["\'][^>]*>Experiences</a>)'
        replacement = r'\1\n<a href="forum.html" class="nav-link">Forum</a>'
        
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated {f}")

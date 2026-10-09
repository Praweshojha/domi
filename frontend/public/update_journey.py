import re

with open("c:/Users/prawesh ojha/OneDrive/Desktop/domain_profile/frontend/public/index.html", "r", encoding="utf-8") as f:
    html = f.read()

old_grid = """<div class="journey-grid">
        <div class="journey-card"><div class="journey-icon">✳</div><div class="journey-date mono">2026 · COMPETITION</div><h3>AI/ML Open Innovation</h3><p>First prize for “CMF Modelling” at Alchemy Corp, as shared by me.</p><span class="journey-chip">1st Prize</span></div>
        <div class="journey-card"><div class="journey-icon">↗</div><div class="journey-date mono">JUL 2026 · INNOVATION</div><h3>Build With Gemma</h3><p>Shared team achievement at the Margadarshan event at Kathmandu University, Dhulikhel.</p><span class="journey-chip">Team prize · $2,000</span></div>
        <div class="journey-card"><div class="journey-icon">◎</div><div class="journey-date mono">2025–26 · LEADERSHIP</div><h3>GES student leadership</h3><p>Experience in the GES executive team and elected Sports Coordinator for the 2026/27 board.</p><span class="journey-chip">Sports Coordinator</span></div>
      </div>"""
      
new_grid = """<div class="journey-grid">
        <div class="journey-card"><div class="journey-icon">✳</div><div class="journey-date mono">2026 · COMPETITION</div><h3>AI/ML Competition</h3><p>Awarded first prize for developing an innovative modelling solution in a competitive technical event.</p><span class="journey-chip">1st Prize</span></div>
        <div class="journey-card"><div class="journey-icon">↗</div><div class="journey-date mono">JUL 2026 · INNOVATION</div><h3>Technical Innovation</h3><p>Recognized for developing and presenting a successful technical solution during a major tech event.</p><span class="journey-chip">Top Achievement</span></div>
        <div class="journey-card"><div class="journey-icon">◎</div><div class="journey-date mono">2025–26 · LEADERSHIP</div><h3>Student Leadership</h3><p>Elected to an executive role to organize, manage, and coordinate student activities and department events.</p><span class="journey-chip">Coordinator</span></div>
      </div>"""

if old_grid in html:
    html = html.replace(old_grid, new_grid)
    print("Exact match replaced!")
else:
    # Use regex to find and replace the journey grid
    html = re.sub(
        r'<div class="journey-grid">.*?</div>\s*</div>\s*</div>',
        new_grid,
        html,
        flags=re.DOTALL
    )
    print("Regex replaced!")

with open("c:/Users/prawesh ojha/OneDrive/Desktop/domain_profile/frontend/public/index.html", "w", encoding="utf-8") as f:
    f.write(html)

import re

with open(r"C:\Users\prawesh ojha\.gemini\antigravity\brain\30fe21e9-eb2e-47e4-9dfa-bff83884686c\.system_generated\steps\160\content.md", "r", encoding="utf-8") as f:
    lines = f.readlines()
    
# Remove the first 8 lines (metadata from content.md)
html = "".join(lines[8:])

# Fix mojibakes
replacements = {
    "â€”": "—",
    "â€™": "’",
    "â†—": "↗",
    "â†˜": "↘",
    "â†’": "→",
    "Â·": "·",
    "âŒ–": "⌖",
    "âŒ˜": "⌘",
    "âœ³": "✳",
    "â—Ž": "◎",
    "â€œ": "“",
    "â€": "”",
    "â€“": "–",
    "Â°": "°"
}

for bad, good in replacements.items():
    html = html.replace(bad, good)
    
# Inject animated image
html = re.sub(
    r"<svg class=\"map-art\".*?</svg>", 
    "<img src=\"img/hero_globe.jpg\" alt=\"Geomatics Globe\" style=\"width:100%; max-width:560px; position: relative; z-index: 0; mask-image: radial-gradient(circle, black 45%, transparent 70%); -webkit-mask-image: radial-gradient(circle, black 45%, transparent 70%); animation: floatGlobe 6s ease-in-out infinite;\">", 
    html, flags=re.DOTALL
)

# Add GitHub link next to LinkedIn (if not already there)
if "https://github.com/Praweshojha" not in html:
    html = html.replace(
        '<a href="https://www.linkedin.com/in/prawesh-ojha-784a24263/" target="_blank"><span class="contact-label">LINKEDIN</span><span>Connect with me ↗</span></a>',
        '<a href="https://github.com/Praweshojha" target="_blank"><span class="contact-label">GITHUB</span><span>View my code ↗</span></a>\n          <a href="https://www.linkedin.com/in/prawesh-ojha-784a24263/" target="_blank"><span class="contact-label">LINKEDIN</span><span>Connect with me ↗</span></a>'
    )

# Add avatar
avatar = """
  <div id="avatar-drop" class="avatar-drop-wrapper">
    <div class="avatar-swing">
      <div class="rope"></div>
      <div class="avatar-body">
        <div class="speech-bubble" id="greeting-bubble">Hello, nice to meet you! 👋</div>
        <div class="avatar-emoji" onclick="document.getElementById('avatar-drop').style.display='none';" title="Click to dismiss">
          <svg viewBox="0 0 100 100" width="85" height="85" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 15px 25px rgba(0,0,0,0.5));"><circle cx="50" cy="50" r="50" fill="#5eead4"/><circle cx="50" cy="35" r="16" fill="#0b1220"/><path d="M25 100 Q50 65 75 100" stroke="#0b1220" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M70 70 Q95 50 85 25" stroke="#0b1220" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="85" cy="25" r="7" fill="#0b1220"/></svg>
        </div>
      </div>
    </div>
  </div>
</body>"""

# Remove old avatar if it exists
html = re.sub(r'<!-- Animated Avatar Drop -->.*</body>', '</body>', html, flags=re.DOTALL)

html = html.replace("</body>", avatar)

with open("c:/Users/prawesh ojha/OneDrive/Desktop/domain_profile/frontend/public/index.html", "w", encoding="utf-8") as f:
    f.write(html)

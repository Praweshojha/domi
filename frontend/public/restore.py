import urllib.request
import re
import os

url = "https://raw.githubusercontent.com/Praweshojha/domi/main/frontend/public/index.html"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    html = response.read().decode("utf-8")

# Inject animated image
html = re.sub(
    r"<svg class=\"map-art\".*?</svg>", 
    "<img src=\"img/hero_globe.jpg\" alt=\"Geomatics Globe\" style=\"width:100%; max-width:560px; position: relative; z-index: 0; mask-image: radial-gradient(circle, black 45%, transparent 70%); -webkit-mask-image: radial-gradient(circle, black 45%, transparent 70%); animation: floatGlobe 6s ease-in-out infinite;\">", 
    html, flags=re.DOTALL
)

# Add GitHub link next to LinkedIn
html = html.replace(
    '<a href="https://www.linkedin.com/in/prawesh-ojha-784a24263/" target="_blank"><span class="contact-label">LINKEDIN</span><span>Connect with me ↗</span></a>',
    '<a href="https://github.com/Praweshojha" target="_blank"><span class="contact-label">GITHUB</span><span>View my code ↗</span></a>\n          <a href="https://www.linkedin.com/in/prawesh-ojha-784a24263/" target="_blank"><span class="contact-label">LINKEDIN</span><span>Connect with me ↗</span></a>'
)

# Replace project 1 (SafeRouteNepal) link
html = html.replace(
    '<h3>ResQ AI / SafeRoute</h3>',
    '<h3><a href="https://github.com/Praweshojha/SafeRouteNepal" target="_blank" style="text-decoration:none; color:inherit;">ResQ AI / SafeRoute ↗</a></h3>'
)

# Replace project 2 (GeoSurveyAssistant)
html = html.replace(
    '<div class="visual-label mono">PROJECT DIRECTION · 02</div>\n              <div class="satellite-rings"><span></span><span></span><span></span><b>EARTH<br>OBSERVATION</b></div>\n              <div class="flood-coordinate mono">RISK → SIGNAL → RESPONSE</div>\n            </div>\n            <div class="project-body"><div class="project-meta"><span>REMOTE SENSING · HAZARDS</span><span class="status concept">RESEARCH CONCEPT</span></div><h3>Mountain hazard intelligence</h3><p>Exploring how satellite observations, GIS, terrain data, and sensor networks could support flood, landslide, and GLOF risk assessment and early-warning workflows.</p><div class="tech-tags"><span>Remote sensing</span><span>GIS</span><span>Risk modelling</span></div></div>',
    '<div class="visual-label mono">JAVA PROJECT · 02</div>\n              <div class="satellite-rings"><span></span><span></span><span></span><b>GEOSPATIAL<br>SYSTEM</b></div>\n              <div class="flood-coordinate mono">SURVEYING → ANALYSIS → MAPPING</div>\n            </div>\n            <div class="project-body"><div class="project-meta"><span>JAVA · OOP</span><span class="status">COMPLETED</span></div><h3><a href="https://github.com/Praweshojha/GeoSurveyAssistant" target="_blank" style="text-decoration:none; color:inherit;">GeoSurveyAssistant ↗</a></h3><p>A desktop application for geomatics engineering designed to assist with spatial data, surveying workflows, and coordinate system management.</p><div class="tech-tags"><span>Java</span><span>Swing</span><span>Data structures</span></div></div>'
)

# Replace project 3 (WordQuest)
html = html.replace(
    '<div class="visual-label mono">TECHNICAL PRACTICE · 03</div>\n              <div class="spatial-stack"><div class="layer l1">01&nbsp; DATA</div><div class="layer l2">02&nbsp; ANALYSIS</div><div class="layer l3">03&nbsp; INSIGHT</div><div class="stack-pin">⌖</div></div>\n              <div class="spatial-caption mono">LOCATION IS CONTEXT</div>\n            </div>\n            <div class="project-body"><div class="project-meta"><span>SURVEYING · GIS</span><span class="status concept">FIELD & COURSEWORK</span></div><h3>Spatial data & surveying workflows</h3><p>Practical work and learning across coordinate systems, total-station observations, GNSS, drone imagery, and GIS-based mapping and analysis.</p><div class="tech-tags"><span>ArcGIS / QGIS</span><span>GNSS</span><span>Total station</span></div></div>',
    '<div class="visual-label mono">PUZZLE GAME · 03</div>\n              <div class="spatial-stack"><div class="layer l1">01&nbsp; LOGIC</div><div class="layer l2">02&nbsp; WORDS</div><div class="layer l3">03&nbsp; PUZZLES</div><div class="stack-pin">⌖</div></div>\n              <div class="spatial-caption mono">JAVA MINI-PROJECT</div>\n            </div>\n            <div class="project-body"><div class="project-meta"><span>JAVA · JDBC</span><span class="status">COMPLETED</span></div><h3><a href="https://github.com/Praweshojha/WordQuest" target="_blank" style="text-decoration:none; color:inherit;">WordQuest ↗</a></h3><p>A polished Java desktop word puzzle game featuring 5 unique modes, 3 difficulty levels, real-time scoring, and persistent SQLite leaderboard tracking.</p><div class="tech-tags"><span>Java</span><span>SQLite</span><span>JDBC</span><span>Algorithms</span></div></div>'
)

# Add avatar (using guaranteed simple SVG inline)
avatar = """
  <div id="avatar-drop" class="avatar-drop-wrapper">
    <div class="avatar-swing">
      <div class="rope"></div>
      <div class="avatar-body">
        <div class="speech-bubble" id="greeting-bubble">Hello, nice to meet you! &#128075;</div>
        <div class="avatar-emoji" onclick="document.getElementById('avatar-drop').style.display='none';" title="Click to dismiss">
          <svg viewBox="0 0 100 100" width="85" height="85" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 15px 25px rgba(0,0,0,0.5));">
            <circle cx="50" cy="50" r="50" fill="#5eead4"/>
            <circle cx="50" cy="35" r="16" fill="#0b1220"/>
            <path d="M25 100 Q50 65 75 100" stroke="#0b1220" stroke-width="14" stroke-linecap="round" fill="none"/>
            <path d="M70 70 Q95 50 85 25" stroke="#0b1220" stroke-width="8" stroke-linecap="round" fill="none"/>
            <circle cx="85" cy="25" r="7" fill="#0b1220"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</body>"""
html = html.replace("</body>", avatar)

with open("c:/Users/prawesh ojha/OneDrive/Desktop/domain_profile/frontend/public/index.html", "w", encoding="utf-8") as f:
    f.write(html)

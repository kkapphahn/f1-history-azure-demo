# Prompt to Create the Base F1 History Site

Use this prompt to create the initial F1 history static website (before adding Genie integration).

---

## Prompt for GitHub Copilot (Agent Mode)

```
Create a static website showcasing the history of Formula 1 racing.

REQUIREMENTS:

1. Content Sections:
   - Hero section with dramatic F1 imagery and title
   - Timeline of key F1 milestones (1950s to present)
   - Grid showcasing legendary F1 champions with photos
   - Section highlighting iconic F1 moments
   - Footer with credits

2. Design & Styling:
   - F1 racing theme with bold colors (red, black, gold)
   - Modern, responsive design that works on mobile and desktop
   - Smooth scrolling and subtle animations
   - Use Google Fonts for racing-inspired typography
   - Professional layout with proper spacing and hierarchy

3. Technical Stack:
   - Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
   - Single page application with smooth scroll navigation
   - Intersection Observer for scroll-triggered animations
   - Semantic HTML with proper accessibility
   - Optimized for performance

4. Specific F1 Content to Include:
   
   Timeline Events (at least 5-7):
   - 1950: First F1 World Championship
   - 1976: Hunt vs Lauda rivalry
   - 1988: Senna vs Prost McLaren dominance
   - 2000s: Schumacher's Ferrari era
   - 2010s: Mercedes hybrid era
   - Recent: Modern F1 innovations
   
   Legendary Champions (at least 6):
   - Juan Manuel Fangio
   - Ayrton Senna
   - Michael Schumacher
   - Lewis Hamilton
   - Sebastian Vettel
   - Max Verstappen
   
   Iconic Moments (at least 5):
   - First-ever F1 race
   - Memorable battles/overtakes
   - Championship-deciding races
   - Historic team rivalries
   - Technical innovations

5. File Structure:
   - index.html (main page)
   - styles.css (all styling)
   - script.js (JavaScript for animations and interactions)
   - README.md (project documentation)

6. Features to Implement:
   - Parallax scrolling effects on hero section
   - Fade-in animations as user scrolls
   - Hover effects on champion cards and moment cards
   - Smooth anchor link navigation
   - Responsive grid layouts

7. Code Quality:
   - Well-commented code explaining key sections
   - CSS organized by component
   - JavaScript with clear function names
   - Consistent naming conventions
   - Mobile-first responsive design

DESIGN AESTHETIC:
- Bold and dynamic like F1 racing
- High contrast with red (#e10600) as primary color
- Dark backgrounds (#15151e) for drama
- Gold accents (#ffd700) for prestige
- Clean typography with racing-inspired fonts (Rajdhani, Orbitron)
- Cards with subtle shadows and hover effects
- Timeline with connected design elements

OUTPUT:
Create all files and ensure the site is ready to deploy as a static website.
The site should be visually impressive and celebrate F1 history.
```

---

## After Creation: Deploy to Azure Static Web Apps

Once the site is created, use these commands to deploy:

### 1. Initialize Git Repository
```powershell
git init
git add .
git commit -m "Initial commit: F1 history static website"
```

### 2. Create GitHub Repository
```powershell
# Create repo using GitHub CLI
gh repo create f1-history-demo --public --source=. --remote=origin

# Push to GitHub
git push -u origin master
```

### 3. Create Azure Static Web App
```powershell
# Login to Azure
az login

# Create resource group
az group create --name rg-f1-history --location eastus2

# Create Static Web App (will auto-setup GitHub Actions)
az staticwebapp create \
    --name f1-history-swa \
    --resource-group rg-f1-history \
    --source https://github.com/YOUR_GITHUB_USERNAME/f1-history-demo \
    --location eastus2 \
    --branch master \
    --app-location "/" \
    --output-location "" \
    --login-with-github
```

### 4. Verify Deployment
```powershell
# Get the site URL
az staticwebapp show --name f1-history-swa --resource-group rg-f1-history --query "defaultHostname" -o tsv
```

---

## Alternative: Simpler One-Line Prompts

If you prefer shorter prompts, here are variations:

### Minimal Prompt (Agent Mode):
```
Create a responsive F1 history website with hero section, timeline, 
champions grid, and iconic moments. Use red/black/gold F1 theme, 
vanilla HTML/CSS/JS with smooth animations. Single page, mobile-friendly.
```

### Medium Prompt (Agent Mode):
```
Build a single-page F1 racing history website featuring:
- Dramatic hero section
- Interactive timeline (1950-present)
- Champion showcase grid (Fangio, Senna, Schumacher, Hamilton, etc.)
- Iconic moments section
- F1 racing theme (red #e10600, black #15151e, gold #ffd700)
- Smooth scroll animations, parallax effects
- Responsive design, pure HTML/CSS/JS
```

---

## Expected Result

After running this prompt, you should have:

✅ **Files Created:**
- `index.html` (~200-300 lines)
- `styles.css` (~400-600 lines)
- `script.js` (~100-150 lines)
- `README.md`

✅ **Visual Design:**
- Bold F1 racing aesthetic
- Responsive layout
- Smooth animations
- Professional typography

✅ **Content:**
- 5-7 timeline events
- 6+ legendary champions
- 5+ iconic moments
- Engaging copy about F1 history

✅ **Technical Features:**
- Intersection Observer animations
- Parallax scrolling
- Mobile-responsive
- Accessible HTML

---

## Verification Checklist

Before proceeding to add Genie integration:

- [ ] Open `index.html` in browser - site loads correctly
- [ ] Scroll through all sections - animations work smoothly
- [ ] Resize browser window - responsive design adapts
- [ ] Check mobile view - content readable and interactive
- [ ] Verify all content sections present
- [ ] Test on different browsers (Chrome, Firefox, Edge)
- [ ] Git repository initialized and committed
- [ ] Pushed to GitHub successfully
- [ ] Azure Static Web App deployed and accessible

---

## Troubleshooting

### Issue: Site looks plain/unstyled
**Check:** Verify `styles.css` is linked in `index.html`
**Fix:** Add `<link rel="stylesheet" href="styles.css">` in `<head>`

### Issue: Animations not working
**Check:** Verify `script.js` is loaded before `</body>` closes
**Fix:** Add `<script src="script.js"></script>` at end of `<body>`

### Issue: Images not loading
**Note:** The base site uses CSS gradients and colors, not external images
**Alternative:** If you want images, ask Copilot: "Add placeholder images for F1 champions"

### Issue: Content too generic
**Fix:** Ask Copilot: "Add more specific F1 historical details and accurate dates"

---

## Next Steps

Once you have the base site working:

1. ✅ Verify it's deployed and accessible online
2. ✅ Test on multiple devices
3. ✅ Take screenshots for presentation backup
4. ✅ Ready to proceed with Genie integration (see `LEARNING_PROMPTS.md`)

---

## Customization Options

Want to personalize the site? Try these follow-up prompts:

**Add Specific Content:**
```
Add a section about the history of the Monaco Grand Prix 
with photos and historical context.
```

**Change Theme:**
```
Update the color scheme to use Ferrari red (#DC0000) and 
Racing Green (#014421) instead.
```

**Add Interactivity:**
```
Make the timeline interactive so clicking an event shows 
more details in a modal popup.
```

**Performance Optimization:**
```
Optimize the CSS and add lazy loading for any images to 
improve performance scores.
```

---

## Presentation Tips

When demonstrating the base site creation:

**Option A: Pre-create the site**
- Have the base site ready before presentation
- Focus presentation time on Genie integration
- Show screenshots of the site during intro

**Option B: Live create during presentation** (risky but impressive)
- Takes 3-5 minutes for Copilot to generate
- Good for showing Copilot's capabilities
- Have backup if it fails (use Option A)

**Recommended: Option A** - Pre-create the base site so you can focus the presentation on learning the unfamiliar Genie API, which is the core message.

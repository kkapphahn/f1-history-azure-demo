# Backup Plan: If Live Demo Fails

This document provides contingency plans if the live demo encounters technical issues.

---

## Common Issues and Quick Fixes

### Issue 1: GitHub Copilot Not Responding
**Symptoms:**
- Copilot suggestions not appearing
- Copilot chat not responding to prompts
- "Copilot is unavailable" message

**Quick Fixes:**
1. Check internet connectivity
2. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")
3. Check Copilot status in bottom-right corner
4. Sign out and sign back into GitHub account

**Backup Action:**
If Copilot remains unavailable, switch to **Backup Scenario A** (Code Walkthrough)

---

### Issue 2: Azure Deployment Fails
**Symptoms:**
- GitHub Actions workflow fails
- API endpoints return 500 errors
- Site doesn't update after push

**Quick Fixes:**
1. Check GitHub Actions logs for specific error
2. Verify Azure Static Web Apps resource is running in Azure Portal
3. Check if deployment token is still valid

**Backup Action:**
If deployment cannot be fixed quickly:
- Continue with local development
- Show code that was generated
- Explain: "In production this would deploy, let me show the expected result..."
- Switch to pre-deployed backup site

---

### Issue 3: Databricks Credentials Invalid
**Symptoms:**
- 401 Unauthorized errors
- "Invalid PAT token" messages
- Connection timeouts to Databricks

**Quick Fixes:**
1. Verify credentials in Azure Static Web Apps settings
2. Check PAT token hasn't expired in Databricks
3. Verify workspace URL format (no trailing slash)
4. Test credentials with curl command

**Backup Action:**
If credentials cannot be fixed:
- Use mock data in the demo
- Show the API flow with console logs
- Explain: "With valid credentials, here's what you'd see..."

---

### Issue 4: Internet Connectivity Issues
**Symptoms:**
- Can't push to GitHub
- Can't access Azure Portal
- API calls timing out

**Backup Action:**
Immediately switch to **Backup Scenario B** (Offline Demo with Pre-built Code)

---

## Backup Scenario A: Code Walkthrough (No Live Coding)

**Use When:** Copilot is unavailable or time is very limited

**Duration:** 30 minutes

### Walkthrough Script:

#### Part 1: Show the Learning Prompts (10 min)
1. Open `LEARNING_PROMPTS.md`
2. Read through Ask mode questions:
   - "If Copilot were working, here's what I'd ask..."
   - "The response would explain what Genie is..."
   - "This is how you'd build understanding without documentation"

3. Show Plan mode prompt:
   - "With this detailed prompt, Copilot generates a task breakdown..."
   - Show the expected plan from your notes
   - "This roadmap would guide the implementation"

4. Show Agent mode prompt:
   - "This comprehensive prompt includes reference code and success criteria..."
   - "Agent mode would use this to implement autonomously..."

#### Part 2: Walk Through Generated Code (15 min)

**Open and explain each file:**

1. **`api/genie-chat/index.js`**
   ```
   - "Notice the comments explaining the Genie conversation flow"
   - "See how it handles both new conversations and follow-ups"
   - "Error handling with specific messages"
   - "JSON.stringify() to return proper responses"
   ```

2. **`api/genie-poll/index.js`**
   ```
   - "Polling endpoint checks message status"
   - "Returns attachments when COMPLETED"
   - "This is the async pattern for long-running queries"
   ```

3. **`api/genie-results/index.js`**
   ```
   - "This was the tricky one - three path parameters"
   - "Uses the correct Genie query-result endpoint"
   - "Parses statement_response format"
   ```

4. **`genie-chat.js`**
   ```
   - "Frontend manages conversation state"
   - "Implements polling with retry logic"
   - "Console logging for learning the API"
   - "Formats data_array into HTML table"
   ```

#### Part 3: Key Learning Points (5 min)

Walk through the learning features in the code:
- Comments explaining WHY
- Console logs showing API responses
- Error messages that educate
- Best practices (environment variables, backend proxy)

**Closing Statement:**
"Even without running the live demo, you can see how Copilot generates code that teaches while it builds. The comments, logging, and structure all support learning an unfamiliar API."

---

## Backup Scenario B: Offline Demo (Pre-built Code)

**Use When:** Internet is unavailable or critical services are down

**Duration:** 35 minutes

### Prerequisites:
Before presentation, save locally:
- Screenshots of working chat widget
- Screen recording of successful integration
- Exported Copilot chat history
- Generated code files

### Demo Script:

#### Part 1: Show Pre-saved Copilot Interactions (10 min)
1. Open saved screenshots of Ask mode Q&A
2. Walk through each question and Copilot's response
3. Point out the learning progression

#### Part 2: Show Plan Generation (5 min)
1. Open saved Plan mode output
2. Explain the task breakdown
3. Highlight learning checkpoints

#### Part 3: Code Walkthrough (15 min)
Same as Scenario A, Part 2 - walk through the generated code files

#### Part 4: Show Pre-recorded Success (5 min)
1. Play screen recording of working integration
2. Point out key moments:
   - Asking a question
   - Console logs showing API flow
   - Data table appearing with results
   - Follow-up question maintaining context

**Closing Statement:**
"While we couldn't run this live today, you've seen the complete workflow: learning, planning, implementing, and validating. The pattern works consistently because Copilot is trained on these integration patterns."

---

## Backup Scenario C: Simplified Demo (Core Concepts Only)

**Use When:** Multiple failures or very limited time

**Duration:** 20 minutes

### Focus Areas:
1. **Ask Mode Demo (8 min)**
   - Do this live if possible (least dependent on external services)
   - Ask 3-4 key questions about Genie
   - Show how knowledge builds quickly

2. **Plan Review (7 min)**
   - Show a pre-generated plan
   - Walk through the task structure
   - Explain how it breaks down complexity

3. **Code Explanation (5 min)**
   - Show one key file (e.g., genie-chat.js)
   - Highlight the learning features
   - Explain what Agent mode would have done

**Closing Statement:**
"We've focused on the learning aspects rather than the implementation. The principle remains: Copilot helps you learn unfamiliar technology faster by breaking it into understandable pieces."

---

## Pre-Built Resources to Have Ready

### 1. Screenshots Folder
Save screenshots of:
- [ ] Each Ask mode Q&A with Copilot responses
- [ ] Generated Plan mode output
- [ ] GitHub Actions successful deployment
- [ ] Azure Portal showing Static Web App
- [ ] Working chat widget on live site
- [ ] Console logs showing API flow
- [ ] Data table with results

### 2. Screen Recording (5 minutes)
Record:
- [ ] Opening the deployed site
- [ ] Clicking chat widget
- [ ] Asking: "Who has won the most races in F1 history?"
- [ ] Watching loading state
- [ ] Results appearing as formatted table
- [ ] Asking follow-up: "How many did the top driver win?"
- [ ] Follow-up answer showing context

### 3. Code Export
Save complete copies of:
- [ ] All files in `/api` folder
- [ ] `genie-chat.js`
- [ ] Updated `index.html` and `styles.css`
- [ ] `package.json` files

### 4. Copilot Chat History
Export or screenshot:
- [ ] Full conversation showing Ask mode questions
- [ ] Plan mode prompt and response
- [ ] Agent mode prompt and initial response

---

## Decision Tree: Which Backup to Use?

```
START: Is something not working?
│
├─ YES → What's the problem?
│  │
│  ├─ Copilot not responding
│  │  └─ Use Scenario A (Code Walkthrough)
│  │
│  ├─ No internet connection
│  │  └─ Use Scenario B (Offline Demo)
│  │
│  ├─ Multiple things broken
│  │  └─ Use Scenario C (Simplified Demo)
│  │
│  └─ One specific issue (Azure, credentials, etc.)
│     └─ Fix it quickly + continue original plan
│
└─ NO → Continue with original demo plan
```

---

## Communication with Audience

### If Switching to Backup Plan:

**Opening Statement:**
"We're encountering a technical issue with [specific service]. Rather than waste time troubleshooting, let me show you what we were going to build and walk through the code. You'll still see the complete learning workflow."

**Maintain Confidence:**
- Don't apologize excessively
- Frame it as a teaching opportunity
- "This happens in real development too"
- Show how you'd debug (even if you're not fixing it live)

**Stay on Message:**
- Core message: "Copilot helps you learn unfamiliar APIs"
- This is true regardless of live demo or walkthrough
- Focus on the learning features in the code

---

## Backup Demo Files Location

**Create backup copies before presentation:**

```
Demo6/
├── BACKUP/
│   ├── screenshots/
│   │   ├── 01-ask-mode-q1.png
│   │   ├── 02-ask-mode-q2.png
│   │   ├── 03-plan-mode.png
│   │   ├── 04-working-chat.png
│   │   └── 05-console-logs.png
│   │
│   ├── recordings/
│   │   └── working-integration.mp4
│   │
│   ├── code-export/
│   │   ├── api/
│   │   ├── genie-chat.js
│   │   ├── index.html
│   │   └── styles.css
│   │
│   └── copilot-history/
│       └── chat-export.txt
```

---

## Practice Scenarios

**Before your presentation, practice:**

### Drill 1: Quick Switch
- Start normal demo
- Someone says "internet is down"
- Switch to Backup Scenario B in <10 seconds

### Drill 2: Copilot Failure Recovery
- Begin asking Copilot a question
- It doesn't respond
- Smoothly transition to explaining what it would have said

### Drill 3: Deployment Failure
- Push code to GitHub
- Actions fails
- Continue demo by showing local code and expected outcome

**Goal:** Be comfortable switching backup plans without losing momentum or confidence.

---

## Emergency Contacts

**Have these ready during presentation:**

- **VS Code Support:** [link to docs]
- **GitHub Copilot Status:** status.github.com
- **Azure Status:** status.azure.com
- **Databricks Support:** [your org's contact]

**Conference/Event Support:**
- A/V Technician: [contact]
- IT Support: [contact]
- Your Manager: [contact]

---

## Post-Incident Review

**After presentation (if backup plan was needed):**

### What to Document:
1. What went wrong and when
2. Which backup scenario you used
3. How the audience responded
4. What worked well in the backup
5. What to improve for next time

### Follow-up with Attendees:
Send email with:
- Apology for technical issues (brief)
- Link to working demo video
- All demo files and prompts
- Offer to answer questions via email
- "The learning principles still apply, even when the demo doesn't cooperate!"

---

## Prevention Checklist

**To minimize need for backup plans:**

### One Week Before:
- [ ] Test full demo end-to-end
- [ ] Verify all credentials are valid
- [ ] Check Azure resource quotas
- [ ] Confirm GitHub Actions is working
- [ ] Test Copilot responsiveness

### One Day Before:
- [ ] Run through demo completely
- [ ] Take all backup screenshots/videos
- [ ] Export all backup code
- [ ] Charge laptop fully
- [ ] Download offline copies of critical docs

### One Hour Before:
- [ ] Test internet connection at venue
- [ ] Verify all services are accessible
- [ ] Test Copilot with one quick prompt
- [ ] Open all needed tabs/files
- [ ] Close everything else

### 5 Minutes Before:
- [ ] One last Copilot test
- [ ] Check GitHub status page
- [ ] Check Azure status page
- [ ] Deep breath - you've got this!

---

## Confidence Mantras

**If things go wrong, remember:**

✓ "The principles I'm teaching are valid regardless of live demo success"

✓ "Experienced presenters adapt - this shows real-world development"

✓ "My backup content still delivers value"

✓ "The audience wants to learn, not see a perfect demo"

✓ "I can debug this later and share the successful version"

✓ "Stay calm, stay on message, teach what I know"

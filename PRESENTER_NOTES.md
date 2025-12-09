# Presenter Notes: Integrating Unknown APIs with GitHub Copilot

This document contains anticipated responses and timing guidance for your presentation dry run.

---

## Pre-Demo Setup Checklist

### Environment Preparation (15 minutes before)
- [ ] Clone fresh copy of base F1 site to Demo folder
- [ ] Verify Azure Static Web App is deployed and accessible
- [ ] Have Databricks credentials ready in secure note
- [ ] Test internet connectivity
- [ ] Open VS Code with GitHub Copilot enabled
- [ ] Verify Copilot modes are accessible (Ask, Plan, Agent)
- [ ] Close unnecessary browser tabs and applications
- [ ] Set browser zoom to 125-150% for audience visibility
- [ ] Open PowerShell terminal in VS Code
- [ ] Test screen sharing setup

### Browser Setup
- [ ] Open deployed site in one tab (https://gentle-pebble-04f78a20f.3.azurestaticapps.net)
- [ ] Have Azure Portal open in another tab (logged in)
- [ ] Have GitHub repo page ready
- [ ] Bookmark GitHub Actions page

### Documents to Have Open
- [ ] LEARNING_PROMPTS.md (this is your script)
- [ ] GENIE_QUICK_REFERENCE.md (your cheat sheet)
- [ ] BACKUP_PLAN.md (if demo fails)

---

## Timing Guide

| Section | Duration | Cumulative Time |
|---------|----------|-----------------|
| Introduction & Setup | 3 min | 3 min |
| Phase 1: Ask Mode | 10 min | 13 min |
| Phase 2: Plan Mode | 10 min | 23 min |
| Phase 3: Agent Mode | 20 min | 43 min |
| Phase 4: Validation | 5 min | 48 min |
| Q&A and Wrap-up | 12 min | 60 min |

**Total: 60 minutes**

---

## Phase 1: Ask Mode - Anticipated Responses

### Question 1: "What is Databricks Genie and how does it work?"

**Expected Response Summary:**
- Genie is an AI-powered conversational interface for Databricks
- Translates natural language questions into SQL queries
- Executes queries against your data lakehouse
- Returns results in natural language or structured format
- Uses knowledge of your data schemas and relationships

**What to Say:**
"Perfect. So in 30 seconds I understand this is like ChatGPT for my data warehouse. I didn't need to read a product overview or watch a tutorial video."

**Timing:** 2 minutes (question + response + commentary)

---

### Question 2: "How do I authenticate to Databricks Genie API?"

**Expected Response Summary:**
- Use Personal Access Token (PAT) for authentication
- Include in Authorization header as `Bearer <token>`
- Also need workspace URL (format: `https://<workspace>.cloud.databricks.com`)
- Need Genie Space ID to specify which Genie instance

**What to Say:**
"Okay, so I need three things: workspace URL, PAT token, and a Space ID. I now know exactly what to ask my Databricks admin for. No hunting through auth documentation."

**Timing:** 2 minutes

---

### Question 3: "What's the typical flow for integrating Genie into a web application?"

**Expected Response Summary:**
1. Start a conversation (POST to start-conversation endpoint)
2. Submit messages within that conversation
3. Poll for message completion (messages have async execution)
4. Retrieve query results when status is COMPLETED
5. Parse and display the results
6. Reuse conversation ID for follow-up questions

**What to Say:**
"This is gold. I now have the complete workflow. Notice it's asynchronous - I need to poll for completion. That's a key architectural decision I need to handle. This usually takes 30+ minutes of documentation reading."

**Timing:** 2-3 minutes

---

### Question 4: "Should I call Databricks API directly from browser JavaScript?"

**Expected Response Summary:**
- No, don't call directly from browser
- Security risk: PAT token would be exposed in client-side code
- CORS issues: Databricks API may not allow cross-origin requests
- Best practice: Use backend proxy (Azure Functions, Node.js server, etc.)
- Backend handles authentication and forwards requests

**What to Say:**
"This is why Copilot is valuable - it's not just teaching me HOW, but teaching me the RIGHT way. Security best practices are built in. This naturally leads me to Azure Functions."

**Timing:** 2 minutes

---

### Question 5: "Can Azure Static Web Apps host an API backend?"

**Expected Response Summary:**
- Yes, via managed Azure Functions
- Integrated directly in your SWA deployment
- Free tier includes 0.5M requests/month
- Node.js, Python, .NET supported
- Functions live in `/api` folder
- Automatic routing and deployment

**What to Say:**
"Perfect. So my architecture is: Static frontend + Azure Functions backend + Databricks Genie. I now understand the complete stack, and I haven't left VS Code."

**Timing:** 2 minutes

---

### Phase 1 Transition Statement:
"In about 10 minutes, I went from zero knowledge to understanding:
- What Genie is
- How to authenticate
- The complete API workflow
- Security architecture
- Platform capabilities

That's the power of Ask mode as a learning tool. Now let's turn that understanding into a plan."

---

## Phase 2: Plan Mode - What to Expect

**Expected Plan Structure:**
The plan will likely include these major sections:

1. **Setup and Configuration**
   - Create environment variables structure
   - Set up Azure Functions project structure

2. **Backend Implementation (Azure Functions)**
   - Create function for starting/submitting conversations
   - Create function for polling message status
   - Create function for fetching query results
   - Add error handling and logging

3. **Frontend Implementation (Chat Widget)**
   - Create HTML structure for chat interface
   - Style chat widget to match F1 theme
   - Implement JavaScript for chat interactions
   - Handle conversation state management

4. **Data Display Logic**
   - Parse Genie response format
   - Convert data_array to HTML table
   - Format columns based on schema
   - Handle empty or error results

5. **Testing and Debugging**
   - Add console logging for API responses
   - Test with sample questions
   - Verify conversation context handling

6. **Deployment**
   - Commit code changes
   - Push to GitHub
   - Verify GitHub Actions deployment
   - Configure environment variables in Azure

**What to Highlight:**
- "See how it breaks down the unknown into knowable chunks?"
- "It's telling me what I need to learn at each step"
- "Notice the logical sequencing - backend first, then frontend, then testing"

**Interactive Moment:**
Ask audience: "Does this plan make sense? Would you add anything? What seems risky?"

**Save the Plan:**
```powershell
# Copy from Copilot response and save
New-Item -Path "IMPLEMENTATION_PLAN.md" -ItemType File
# Paste content
```

**Timing:** 10 minutes (generate plan, review with audience, save)

---

## Phase 3: Agent Mode - What to Watch For

### Expected Tool Calls Sequence:

1. **File Creation Phase (5-7 minutes)**
   - Create `api/genie-chat/function.json`
   - Create `api/genie-chat/index.js`
   - Create `api/genie-poll/function.json`
   - Create `api/genie-poll/index.js`
   - Create `api/genie-results/function.json`
   - Create `api/genie-results/index.js`
   - Create `api/package.json`
   - Create `api/host.json`
   - Create `genie-chat.js`
   - Update `index.html` to include chat widget HTML
   - Update `styles.css` to style chat widget

2. **Git Operations (1-2 minutes)**
   - `git add .`
   - `git commit -m "Add Databricks Genie chat integration"`
   - `git push`

3. **Deployment Verification (2-3 minutes)**
   - Watch GitHub Actions workflow
   - Verify deployment success

### Narration Points:

**When creating Azure Functions:**
"See these comments? Agent mode is explaining WHY we use each endpoint. It's teaching me the Genie API while building. This is the key - code with education built in."

**When implementing polling logic:**
"Look at this retry mechanism. It's handling the async nature of Genie queries. I'm learning the polling pattern that I'd use for any async API."

**When parsing results:**
"These console.log statements are gold for learning. When I test this, I'll see exactly what data structure Genie returns. That knowledge stays with me."

**When handling errors:**
"Notice the error messages - they're not just generic 'something went wrong'. They tell me WHAT failed, helping me understand the integration points."

### Potential Issues and Recovery:

**If Agent mode asks for clarification:**
- Provide the missing information from GENIE_QUICK_REFERENCE.md
- Say: "Good question - this is Copilot helping me think through edge cases"

**If a file edit fails:**
- Check the error message
- Say: "This happens - let's ask Copilot to try again with more context"
- Re-run or manually fix

**If deployment takes too long:**
- Show the GitHub Actions page while waiting
- Explain what's happening: "Building and deploying both frontend and API"
- Use this time to review generated code

### Code Review Moments:

**After files are created, before pushing:**

1. **Open `api/genie-chat/index.js`:**
   - Point out the comment explaining start-conversation vs messages endpoint
   - Show the error handling for missing credentials
   - Highlight the JSON.stringify() on responses

2. **Open `genie-chat.js`:**
   - Show the conversation state management
   - Point out the polling loop with timeout
   - Highlight console.log statements for learning

3. **Open `api/genie-results/function.json`:**
   - Show the route definition with three path parameters
   - Explain why this matters (common mistake to use single parameter)

**Timing:** 20 minutes (implementation + review + deployment)

---

## Phase 4: Validation - Interactive Demos

### Demo 1: Adding Clear Conversation Button

**Expected Copilot Suggestion:**
```javascript
// Add button to HTML
<button id="clear-conversation">Clear Chat</button>

// Add event listener
document.getElementById('clear-conversation').addEventListener('click', () => {
    genieChat.conversationId = null;
    // Clear UI
    document.getElementById('chat-messages').innerHTML = '';
});
```

**What to Say:**
"Look how quickly I can extend this. I understand the conversation_id concept now, so this makes intuitive sense. That's the difference between copying code and actually learning."

**Timing:** 2 minutes

---

### Demo 2: Testing Context Handling

**Questions to Ask:**
1. "Who has won the most races in F1 history?"
2. "How many races did the top driver win?"
3. "What teams did they drive for?"

**What to Point Out in Console:**
```
Starting conversation: {conversation_id: "abc123"}
Message submitted: {message_id: "msg456"}
Polling status: EXECUTING...
Polling status: EXECUTING...
Polling status: COMPLETED
Fetching results with attachment: att789
Results data: {data_array: [[...]], columns: [...]}
```

**What to Say:**
"See the conversation_id staying the same? That's how Genie maintains context. The message_id changes for each question. I learned this from the console logs that Agent mode added. This is learning by doing."

**Timing:** 3 minutes

---

## Troubleshooting Guide

### Issue: Environment Variables Not Set
**Symptom:** 500 error when testing chat
**Fix:**
```powershell
az staticwebapp appsettings set --name f1-history-swa --resource-group rg-f1-history `
  --setting-names `
    DATABRICKS_WORKSPACE_URL="https://your-workspace.cloud.databricks.com" `
    DATABRICKS_PAT_TOKEN="dapi..." `
    GENIE_SPACE_ID="01abcd..."
```
**What to Say:** "Good catch - we implemented the code but need to configure the credentials."

---

### Issue: 404 on API Endpoints
**Symptom:** API calls failing in browser console
**Fix:** Check GitHub Actions - API might not be deployed yet
**What to Say:** "The deployment is still in progress. Let's check GitHub Actions. This is a good reminder that CI/CD takes a minute."

---

### Issue: Results Not Displaying
**Symptom:** "Query executed successfully" but no data
**Check:** Browser console for actual API response
**What to Say:** "Let's look at what the API is actually returning. This is where the console logs help us debug."

---

### Issue: Copilot Gives Generic Response
**Symptom:** Response doesn't include specific Genie details
**Fix:** Add more context to your prompt, include the reference implementation snippet
**What to Say:** "I need to give Copilot more context. Let me add the reference implementation..."

---

## Backup Plan (If Live Demo Fails)

### Plan A: Pre-recorded Video
- Have a video of the working integration ready
- Show the video while explaining what would happen live
- Still show the code that was generated

### Plan B: Code Walkthrough
- Skip to the completed code
- Walk through key files explaining how Copilot generated them
- Show the learning features (comments, logging)
- Focus on the educational aspect

### Plan C: Simplified Demo
- Just do Ask mode and Plan mode (no Agent mode)
- Show the generated plan
- Explain: "In a real scenario, Agent mode would implement this plan"
- Show pre-completed code as the expected outcome

**Important:** Have these backups ready on your local machine, not dependent on internet.

---

## Audience Engagement Techniques

### Interactive Polls
**Ask throughout:**
- "How many of you have used Databricks before?" (show of hands)
- "Who has integrated an API they'd never seen before?" (show of hands)
- "What usually takes longer - reading docs or trial-and-error?" (vote)

### Take Questions Early
- "Does everyone understand what Genie does at a high level?"
- "Any questions about the architecture before we implement?"

### Invite Participation
- "What question would you ask Copilot right now?"
- "What do you think the biggest challenge will be?"
- "Anyone want to suggest a feature to add?"

### Relate to Their Experience
- "This is like when you had to integrate [common API] - remember the documentation confusion?"
- "We've all spent hours debugging auth tokens, right?"

---

## Post-Demo Talking Points

### Key Takeaways to Emphasize:

1. **Learning Transfer:**
   "The Genie integration was the example, but the real skill is using Copilot to learn ANY unfamiliar API."

2. **Time Multiplication:**
   "30 minutes vs 4-5 hours isn't just faster - it's the difference between 'I'll tackle that tomorrow' and 'I can do that now'."

3. **Knowledge Retention:**
   "Because I built it with understanding, not just copying, I can maintain and extend this code. I actually learned Genie."

4. **Confidence:**
   "How many of you feel more confident about integrating an unknown API now? That's the real ROI."

### Call to Action:

"Here's your homework: Pick an API you've been avoiding because it seems complex. Spend 30 minutes with GitHub Copilot. Ask questions, create a plan, and see how far you get. You might surprise yourself."

---

## Q&A - Anticipated Questions

### "What if Copilot gives me wrong information?"

**Answer:** 
"Great question. Copilot is a tool, not a replacement for verification. Notice I:
- Cross-referenced with the reference implementation
- Tested at each step
- Checked the console logs to verify behavior
- Could have asked follow-up questions if something seemed off

Think of it as a very knowledgeable pair programmer - trust but verify."

---

### "Does this work with private/internal APIs?"

**Answer:**
"Excellent question. Copilot has broad API knowledge, but for internal APIs, you'd provide more context:
- Share your API documentation in the prompt
- Include example requests/responses
- Provide any internal code examples

Agent mode is actually better with more context. The principle is the same - ask, plan, implement."

---

### "How much does GitHub Copilot cost?"

**Answer:**
"GitHub Copilot is $10/month for individuals, $19/month for business tier. Given what we just did saved 3-4 hours, the ROI is clear. If you integrate one unfamiliar API per month, you've paid for it."

---

### "Can it help with debugging existing code?"

**Answer:**
"Absolutely! In fact, when we hit that 404 error on the results endpoint, I could have asked Copilot 'Why is this API call returning 404?' with the error details. It would have identified the routing mismatch. Debugging is one of Ask mode's strongest use cases."

---

### "What about security and compliance?"

**Answer:**
"GitHub Copilot has business tiers with data privacy guarantees - your code isn't used for model training. For highly sensitive code, you can:
- Use Copilot Business with policy controls
- Review all suggestions before accepting
- Use it for learning/research in a sandbox first

Notice how Copilot suggested environment variables and backend proxy for security - best practices are built in."

---

## Timing Flexibility

### If Running Ahead of Schedule (>10 minutes early):
- Add more Ask mode questions about edge cases
- Do a deeper code review of generated functions
- Add an extra feature (export results, dark mode toggle)
- Take more audience questions

### If Running Behind Schedule (>5 minutes late):
- Skip Phase 4 validation (show it works, move on)
- Reduce code review time in Phase 3
- Combine similar Ask mode questions
- Defer some Q&A to "catch me after"

---

## Presentation Checklist

### Morning of Presentation:
- [ ] Test all accounts (Azure, GitHub, Databricks) are logged in
- [ ] Verify GitHub Copilot is active in VS Code
- [ ] Run through first 3 prompts to ensure Copilot is responsive
- [ ] Test screen sharing audio/video
- [ ] Close all non-essential applications
- [ ] Silence notifications
- [ ] Have water nearby
- [ ] Charge laptop fully

### 5 Minutes Before:
- [ ] Start screen sharing
- [ ] Open VS Code with Demo6 folder
- [ ] Have terminal ready
- [ ] Test microphone
- [ ] Deep breath!

### Opening Line:
"Welcome everyone. In the next hour, I'm going to integrate an API I've never used before - Databricks Genie - live, in front of you. And GitHub Copilot is going to teach me how. Let's see how far we can get in 30 minutes."

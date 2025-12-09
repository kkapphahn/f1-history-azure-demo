# Learning Journey: From Zero to Genie Integration

This document contains all the prompts you'll use during the presentation to demonstrate learning an unfamiliar API with GitHub Copilot.

---

## Phase 1: Ask Mode - Building Understanding (10 minutes)

**Goal:** Learn what Databricks Genie is and how to integrate it, starting from zero knowledge.

### Question 1: What is Genie?
```
What is Databricks Genie and how does it work?
```

**What to highlight:**
- You literally don't know what this is
- Copilot gives you a clear explanation without searching docs
- Take 30 seconds to understand the concept

---

### Question 2: Authentication
```
How do I authenticate to Databricks Genie API? What credentials do I need?
```

**What to highlight:**
- Now you understand PAT tokens, workspace URLs
- You know what to ask your Databricks admin for
- No need to hunt through authentication documentation

---

### Question 3: Integration Pattern
```
What's the typical flow for integrating Genie into a web application? 
What endpoints do I need to call and in what order?
```

**What to highlight:**
- Copilot outlines the conversation → poll → results flow
- You're building a mental model of the API architecture
- This would normally take 30+ minutes of doc reading

---

### Question 4: Security Architecture
```
Should I call Databricks API directly from browser JavaScript, 
or do I need a backend proxy? Why?
```

**What to highlight:**
- Copilot explains CORS and token security concerns
- Naturally leads to the Azure Functions approach
- Shows understanding of best practices, not just "how to"

---

### Question 5: Platform Compatibility
```
Can Azure Static Web Apps host an API backend? 
What are the limitations I should be aware of?
```

**What to highlight:**
- Confirms managed functions will work
- Explains free tier limitations
- You now know the complete architecture you need

---

**Phase 1 Summary for Audience:**
"In 5 minutes, I went from 'What is Genie?' to 'I understand the complete integration architecture.' No documentation tabs, no tutorial hunting, just asking questions."

---

## Phase 2: Plan Mode - From Concept to Action Steps (10 minutes)

**Goal:** Transform understanding into a concrete implementation roadmap.

### Prompt for Plan Mode:
```
I need to add Databricks Genie chat to this F1 website. I've never used Genie before.

WHAT I KNOW (from Ask mode):
- I need to authenticate with PAT token
- Should use backend proxy for security (Azure Functions)
- Azure Static Web Apps supports managed functions
- Genie has a conversation-based API with start → poll → results flow

WHAT I DON'T KNOW:
- Exact API endpoint URLs and parameters
- How to poll for query completion (retry logic, timeouts)
- What format the results come in (JSON structure)
- How to parse and display the data
- How to handle errors and edge cases
- How to maintain conversation context for follow-ups

CONSTRAINTS:
- Must work in Azure Static Web Apps free tier
- Keep the F1 red/black/gold theme for the chat widget
- User should see actual data tables, not just "query executed" messages
- Need to use environment variables for credentials (security)

TECHNICAL ENVIRONMENT:
- Frontend: Vanilla JavaScript (no frameworks)
- Backend: Azure Functions (Node.js)
- Current site: Basic HTML/CSS/JS with F1 history content

Create a detailed implementation plan that assumes I'm learning Genie as I go. 
Include what I need to research or understand at each step. Break down complex 
tasks into specific, actionable subtasks.
```

**What to do during demo:**
1. Paste the prompt into Plan mode
2. Wait for the plan to generate
3. Review it with the audience:
   - Point out: "See how it's telling me what to research at each step"
   - Point out: "It's warning me about common pitfalls"
   - Point out: "It's sequencing the work logically"
4. Save the plan to a file: `IMPLEMENTATION_PLAN.md`
5. Walk through 2-3 key tasks in detail

**Phase 2 Summary for Audience:**
"Plan mode isn't just a task list - it's a learning roadmap. It tells me what I need to know at each step, even though I don't know it yet. This is how Copilot helps you tackle unfamiliar territory systematically."

---

## Phase 3: Agent Mode - Learning While Building (20 minutes)

**Goal:** Let Agent mode implement the integration while teaching you how the API works.

### Prompt for Agent Mode:
```
Implement Databricks Genie chat integration for this F1 site.

IMPORTANT CONTEXT: 
I have NEVER used Databricks Genie before. Please implement the integration 
using best practices for the Genie API. Add detailed code comments explaining 
WHY we use each endpoint and WHAT each response contains, so I can learn the 
API while you build.

API CONTEXT:
- Databricks Genie uses a conversation-based API under /api/2.0/genie/spaces/
- After submitting a message, I need to poll until the query completes
- Once complete, the message response includes attachments with query results
- I need to fetch the actual result data (rows and columns) to display to users
- The goal is to show actual data (like a table of results), NOT just SQL queries

REQUIREMENTS:
1. Chat widget UI:
   - Fixed position bottom-right corner
   - Match F1 theme (red: #e10600, black: #15151e, gold: #ffd700)
   - Collapsible/expandable
   - Show user and bot messages clearly
   - Loading indicator while processing

2. Azure Functions backend:
   - Function to submit questions to Genie (start conversation or add message)
   - Function to poll message status until completion
   - Function to fetch the actual query result data from completed messages
   - Research the correct Genie API endpoints for fetching result data

3. Frontend JavaScript:
   - Handle conversation state (maintain conversation_id for follow-ups)
   - Poll until message status is COMPLETED
   - Extract result data from the Genie response and display as HTML table
   - Handle errors gracefully with user-friendly messages

4. Technical details:
   - Azure Functions must return JSON.stringify() responses with Content-Type: application/json
   - Azure Functions routes should match the URL path structure you're calling
   - Use environment variables: DATABRICKS_WORKSPACE_URL, DATABRICKS_PAT_TOKEN, GENIE_SPACE_ID
   - Add console.log to show what data structures Genie returns

LEARNING FEATURES (please include):
- Add console.log statements showing API requests and responses
- Add comments explaining each step of the Genie conversation flow
- Log the data structure when parsing results so I can see what Genie returns
- Include error messages that help me understand what went wrong

SUCCESS CRITERIA:
When I ask "Who has won the most races in F1 history?" I should see:
- A formatted data table with driver names and win counts
- NOT just SQL queries or metadata about the query
- NOT "run this in your workspace" messages
- The actual row data returned from Genie

IMPORTANT: Research the Genie API to find the correct endpoint that returns 
the actual query result data (rows and columns), not just query metadata. 
The attachment in the message response should point you to where result data lives.

Please implement all code, add helpful logging, commit to git, push, and verify deployment.
```

**What to do during demo:**

1. **Paste the prompt into Agent mode**
   - Say: "Watch how Agent mode becomes both my developer AND my teacher"

2. **As it runs, narrate the learning moments:**
   - When creating Azure Functions: 
     "It's adding comments explaining the Genie conversation flow"
   - When implementing polling:
     "See this retry logic? I'm learning the polling pattern"
   - When parsing results:
     "Look at these console.log statements - helping me understand the data structure"
   - When handling errors:
     "These error messages will teach me what can go wrong"

3. **When it pauses or completes, review key code sections:**
   ```
   Open: api/genie-chat/index.js
   Point out the explanatory comments
   
   Open: api/genie-poll/index.js
   Show the polling logic
   
   Open: genie-chat.js
   Show the console logging for learning
   ```

4. **Watch the deployment:**
   - Show the GitHub Actions workflow running
   - Explain: "It's deploying both the frontend and the API backend"

5. **Configure environment variables:**
   ```powershell
   # Show the audience what you're setting
   az staticwebapp appsettings set --name f1-history-swa --resource-group rg-f1-history `
     --setting-names `
       DATABRICKS_WORKSPACE_URL="https://your-workspace.cloud.databricks.com" `
       DATABRICKS_PAT_TOKEN="dapi..." `
       GENIE_SPACE_ID="01abcd..."
   ```

6. **Test with browser console open:**
   - Open Developer Tools (F12)
   - Navigate to the deployed site
   - Open chat widget
   - Ask: "Who has won the most races in F1 history?"
   - Show the console logs as the conversation flows
   - Point out each API call and response

**Phase 3 Summary for Audience:**
"I started knowing nothing about Genie. Now I have working code AND I understand how the API works. Agent mode didn't just generate code - it taught me through comments, logging, and best practices."

---

## Phase 4: Validation - Proving You Actually Learned (5 minutes)

**Goal:** Demonstrate that you now understand the Genie API well enough to extend it.

### Task 1: Add a Feature
**Ask Copilot in Chat:**
```
How would I add a "Clear Conversation" button that starts a fresh Genie 
conversation? I want to reset the conversation_id and clear the chat history.
```

**What to do:**
1. Get Copilot's suggestion
2. Implement it (should be quick - just a button and reset logic)
3. Point out: "I understand conversation_id now, so this makes sense to me"
4. Test it: Ask a question, click clear, ask another question

---

### Task 2: Test Context Handling
**In the chat widget, ask follow-up questions:**
1. User: "Who has won the most races in F1 history?"
2. Wait for response
3. User: "How many races did the top driver win?"
4. User: "What about the second place driver?"

**What to highlight:**
- "See? It maintains context through the conversation"
- "I understand why now - we're reusing the conversation_id"
- "This is the power of Genie's conversation model"

---

### Task 3: Explain What You Learned
**Walk through the API flow on screen:**

1. Open browser DevTools console
2. Point to the logs showing:
   - Starting conversation (conversation_id created)
   - Submitting message (message_id returned)
   - Polling (checking status until COMPLETED)
   - Fetching results (attachment_id → data_array)

3. Say: "Let me explain what's happening..."
   - Explain the 3-step flow
   - Explain why we poll (async query execution)
   - Explain the statement_response structure
   - Explain why we need backend proxy (security)

**Phase 4 Summary for Audience:**
"This isn't just code generation - it's interactive learning. I can now explain Genie's architecture to someone else. I could add new features. I could debug issues. That's the difference between copying code and actually learning."

---

## Summary Talking Points

**What We Accomplished:**
- ✅ Learned what Databricks Genie is and how it works
- ✅ Understood the security architecture (why backend proxy)
- ✅ Implemented a working, production-ready integration
- ✅ Can explain the API flow and data structures
- ✅ Have maintainable code with comments and logging
- ✅ Can extend the feature with new capabilities

**Time Comparison:**
- Traditional approach (docs, tutorials, trial-and-error): 4-5 hours
- With GitHub Copilot (ask, plan, implement, learn): 30-40 minutes

**The Real Value:**
"GitHub Copilot didn't just save me time - it taught me a new API while building. That knowledge stays with me. Next time I need to integrate an unfamiliar API, I have a proven learning pattern."

---

## Backup Questions (If You Have Extra Time)

### Understanding Data Security:
```
What sensitive data flows through this integration and how should I secure it 
in production?
```

### Performance Optimization:
```
How could I optimize the polling mechanism to reduce API calls while still 
providing responsive results?
```

### Error Recovery:
```
What happens if the Genie query times out or fails? How should I handle that 
in the UI?
```

### Advanced Features:
```
How would I add support for Genie's suggested follow-up questions in my 
chat interface?
```

---

## Audience Engagement Prompts

**Before each phase, ask:**
- "Who has integrated an API they'd never seen before? How long did it take?"
- "What's your usual process? Docs first? Examples first? Trial and error?"

**During Agent mode:**
- "What would you be worried about right now if you were coding this yourself?"
- "Anyone want to suggest a question I should ask Copilot?"

**After completion:**
- "Who would feel confident tackling a new API integration now?"
- "What surprised you most about this workflow?"

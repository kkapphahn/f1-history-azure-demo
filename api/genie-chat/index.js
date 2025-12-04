const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Genie chat request received');

    // Get environment variables
    const DATABRICKS_WORKSPACE_URL = process.env.DATABRICKS_WORKSPACE_URL;
    const DATABRICKS_PAT_TOKEN = process.env.DATABRICKS_PAT_TOKEN;
    const GENIE_SPACE_ID = process.env.GENIE_SPACE_ID;

    // Validate environment variables
    if (!DATABRICKS_WORKSPACE_URL || !DATABRICKS_PAT_TOKEN || !GENIE_SPACE_ID) {
        context.res = {
            status: 500,
            body: {
                error: 'Server configuration error. Please contact administrator.',
                details: 'Missing required environment variables'
            }
        };
        return;
    }

    // Get the message from the request body
    const { message, conversationId } = req.body;

    if (!message) {
        context.res = {
            status: 400,
            body: { error: 'Message is required' }
        };
        return;
    }

    try {
        // Create or continue conversation with Databricks Genie
        const genieUrl = `${DATABRICKS_WORKSPACE_URL}/api/2.0/genie/spaces/${GENIE_SPACE_ID}/start-conversation`;
        
        const requestBody = {
            content: message
        };

        if (conversationId) {
            requestBody.conversation_id = conversationId;
        }

        const response = await fetch(genieUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DATABRICKS_PAT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            context.log.error(`Databricks API error: ${response.status} - ${errorText}`);
            
            context.res = {
                status: response.status,
                body: {
                    error: 'Failed to communicate with Databricks Genie',
                    details: `Status: ${response.status}`
                }
            };
            return;
        }

        const data = await response.json();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        };

    } catch (error) {
        context.log.error('Error calling Databricks Genie:', error);
        
        context.res = {
            status: 500,
            body: {
                error: 'Internal server error',
                message: error.message
            }
        };
    }
};

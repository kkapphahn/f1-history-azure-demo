const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Genie poll request received');

    const DATABRICKS_WORKSPACE_URL = process.env.DATABRICKS_WORKSPACE_URL;
    const DATABRICKS_PAT_TOKEN = process.env.DATABRICKS_PAT_TOKEN;
    const GENIE_SPACE_ID = process.env.GENIE_SPACE_ID;

    if (!DATABRICKS_WORKSPACE_URL || !DATABRICKS_PAT_TOKEN || !GENIE_SPACE_ID) {
        context.res = {
            status: 500,
            body: { error: 'Server configuration error' }
        };
        return;
    }

    const { conversationId, messageId } = req.params;

    if (!conversationId || !messageId) {
        context.res = {
            status: 400,
            body: { error: 'Conversation ID and Message ID are required' }
        };
        return;
    }

    try {
        const pollUrl = `${DATABRICKS_WORKSPACE_URL}/api/2.0/genie/spaces/${GENIE_SPACE_ID}/conversations/${conversationId}/messages/${messageId}`;

        const response = await fetch(pollUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${DATABRICKS_PAT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            context.log.error(`Databricks API error: ${response.status} - ${errorText}`);
            
            context.res = {
                status: response.status,
                body: { error: 'Failed to poll message status' }
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
        context.log.error('Error polling Databricks Genie:', error);
        
        context.res = {
            status: 500,
            body: {
                error: 'Internal server error',
                message: error.message
            }
        };
    }
};

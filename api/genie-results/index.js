const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('Genie results request received');

    const DATABRICKS_WORKSPACE_URL = process.env.DATABRICKS_WORKSPACE_URL;
    const DATABRICKS_PAT_TOKEN = process.env.DATABRICKS_PAT_TOKEN;

    if (!DATABRICKS_WORKSPACE_URL || !DATABRICKS_PAT_TOKEN ||
        DATABRICKS_WORKSPACE_URL.includes('PLACEHOLDER') ||
        DATABRICKS_PAT_TOKEN.includes('PLACEHOLDER')) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Server configuration error' })
        };
        return;
    }

    const { statementId } = req.params;

    if (!statementId) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Statement ID is required' })
        };
        return;
    }

    // Extract parameters - expecting format: conversationId/messageId/attachmentId
    const parts = statementId.split('/');
    const conversationId = parts[0];
    const messageId = parts[1];
    const attachmentId = parts[2];

    if (!conversationId || !messageId || !attachmentId) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Invalid statement ID format. Expected: conversationId/messageId/attachmentId' })
        };
        return;
    }

    try {
        const GENIE_SPACE_ID = process.env.GENIE_SPACE_ID;
        const resultUrl = `${DATABRICKS_WORKSPACE_URL}/api/2.0/genie/spaces/${GENIE_SPACE_ID}/conversations/${conversationId}/messages/${messageId}/query-result/${attachmentId}`;

        const response = await fetch(resultUrl, {
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Failed to fetch query results' })
            };
            return;
        }

        const data = await response.json();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        context.log.error('Error fetching query results:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

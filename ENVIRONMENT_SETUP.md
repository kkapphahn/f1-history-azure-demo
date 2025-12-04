# Environment Variables Configuration

The Databricks Genie chat integration requires three environment variables to be set in Azure Static Web Apps:

## Required Environment Variables

1. **DATABRICKS_WORKSPACE_URL**
   - Your Databricks workspace URL
   - Format: `https://adb-1234567890123456.7.azuredatabricks.net`
   - Example: `https://adb-1234567890123456.7.azuredatabricks.net`

2. **DATABRICKS_PAT_TOKEN**
   - Your Databricks Personal Access Token
   - Generate this from: Databricks Workspace > User Settings > Access Tokens
   - Keep this secure and never commit it to source control

3. **GENIE_SPACE_ID**
   - Your Genie Space ID
   - Find this in the URL when viewing your Genie space
   - Format: Usually a UUID like `01234567-89ab-cdef-0123-456789abcdef`

## Setting Environment Variables

Use the Azure CLI to set these variables:

```powershell
az staticwebapp appsettings set `
  --name f1-history-swa `
  --resource-group rg-f1-history `
  --setting-names `
    DATABRICKS_WORKSPACE_URL="<your-workspace-url>" `
    DATABRICKS_PAT_TOKEN="<your-pat-token>" `
    GENIE_SPACE_ID="<your-space-id>"
```

Or set them via Azure Portal:
1. Go to Azure Portal
2. Navigate to your Static Web App: `f1-history-swa`
3. Go to Configuration > Application settings
4. Add/Update the three environment variables
5. Save changes

## Verifying Configuration

After setting the variables:
1. Visit your site: https://gentle-pebble-04f78a20f.3.azurestaticapps.net
2. Click the chat widget (💬 icon) in the bottom-right corner
3. Try asking a question about F1 statistics
4. The Genie assistant should respond with data from your Databricks Genie space

## Troubleshooting

If the chat doesn't work:
- Check that all three environment variables are set correctly
- Verify your PAT token has the necessary permissions
- Check the browser console for any error messages
- Review the Azure Functions logs in Azure Portal

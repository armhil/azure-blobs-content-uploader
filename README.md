# Azure blobs - content uploader

Azure Blobs Content Uploader is designed as a github action, to help developers upload their build artifacts to *multiple* az-storage accounts, taking into account the absolute paths / relative paths / recursive structure from your file system.

It's especially meant to help with SPA developers (ex: artifacts of create-react-app) to quickly upload artifacts to a lot of storage accounts for redundancy and performance. 

## Configuration details

To configure this job, you'll need a few things.

### Azure blob details
The content uploader supports uploading to multiple storage accounts, so you're going to need the *connection strings* of all the blob storages that you want to upload the files to.

```yaml
      - name: Upload Static Content
        uses: armhil/azure-blobs-content-uploader@1.0.0
        with:
          azureBlobConfiguration: ${{ secrets.AZ_BLOB_CONFIGURATION }} # could be any secret that you have, see below for the format
          directoriesToUpload: '[{"path": "test/integrationtest-directory", "shouldRecurse": "true" }]'
```

You should use the below format for the `azureBlobConfiguration` parameter and this value should come from the secrets. **azureBlobConfiguration parameter is expected to contain the connection strings to blob storage accounts, so it's incredibly important to store it in github repository secrets, rather than some plaintext mechanism**.

```javascript
// Secret value schema
[
  {
    "connectionString": string, // Az Blobs connection string
    "container": string, // Container to upload the files to
    "path" : string // Path in the container that the files will get uploaded to
  },
]

// Example secret value
[{"connectionString": "DefaultEndpointsProtocol=https;AccountName=azblobuploadtest;AccountKey=someAccountKeyNotReal;EndpointSuffix=core.windows.net
", "container": "$web", "path": "" }]
```

*Hint*: If you're uploading some static content for web-apps (like artifacts of create-react-app) - you can use the `$web` container from Azure Blob Storage. 

# Azure blobs - content uploader

[![No real build - some simple tests & executing the action itself](https://github.com/armhil/azure-blobs-content-uploader/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/armhil/azure-blobs-content-uploader/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/armhil/azure-blobs-content-uploader/graph/badge.svg?token=6A2V1F5QK0)](https://codecov.io/gh/armhil/azure-blobs-content-uploader)

Azure Blobs Content Uploader is designed as a github action, to help developers upload their build artifacts to *multiple* az-storage accounts, taking into account the absolute paths / relative paths / recursive structure from your file system.

It's especially meant to help with SPA developers (ex: artifacts of create-react-app) to quickly upload artifacts to a lot of storage accounts for redundancy and performance. 

## Configuration details

To configure this job, you'll need a few things.

## Create your Entra App (Azure AAD app)
Once you create the app, give it write permissions to the storage accounts that you want to upload blobs to.

## Get the Entra App details and add them to GitHub

Using Action Secrets, add the `clientId`, `clientSecret`, `tenantId` and further configurations below to Actions configuration.

### Your local files
You should decide which directory to upload and to where on the storage accounts. This information is passed as parameters to the `*.yaml` file.
See the `directoriesToUpload` parameter, which supports passing multiple directories. Note that while you can upload multiple directories, **they will be uploaded to the same location**.

```yaml
      - name: Upload Static Content
        uses: armhil/azure-blobs-content-uploader@1.0.9
        with:
          clientId: ${{ secrets.ENTRA_CLIENTID }}
          clientSecret: ${{ secrets.ENTRA_CLIENTSECRET }}
          tenantId: ${{ secrets.ENTRA_TENANTID }}
          storageAccountList: ${{ secrets.STORAGE_ACCOUNT_LIST }} # Storage account names, in array form like ["account1", "account2"]
          containerName: "$web"
          directoriesToUpload: '[{"directoryToUpload": "test/integrationtest-directory", "shouldRecurse": "true" }]'
```

*Hint*: If you're uploading some static content for web-apps (like artifacts of create-react-app) - you can use the `$web` container from Azure Blob Storage. 

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
          # required parameter - your entra (ex: AAD) - application id
          clientId: ${{ secrets.ENTRA_CLIENTID }}

          # required parameter - your entra (ex: AAD) - application secret
          clientSecret: ${{ secrets.ENTRA_CLIENTSECRET }}

          # required parameter - your entra (ex: AAD) - tenant id
          tenantId: ${{ secrets.ENTRA_TENANTID }}

          # required parameter - storage account names that you're uploading to.
          # if you're providing this value from secrets, use just the array form like ["account1", "account2"]
          # if you're passing this value from the yaml file (so directly adding to source) - use quotations like so: '["account1", "account2"]'
          storageAccountList: ${{ secrets.STORAGE_ACCOUNT_LIST }}

          # required parameter - container name, same across all storage accounts, $web is recommended if you're hosting SPAs - see here:
          # https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website 
          containerName: "$web"

          # required parameter - what are you uploading, whether recursively or not. If you want to map the artifacts to a particular location in the container
          # you can use the "baseContainerPath" property of each record.
          # see an example here: https://github.com/armhil/easy-qrcode-barcode-addin/blob/main/.github/workflows/main.yml
          directoriesToUpload: '[{"directoryToUpload": "test/integrationtest-directory", "shouldRecurse": "true" }]'

          # optional parameter - what file extensions with content-type are you uploading? Others will be omitted.
          # default value: '{ ".html": "text/html", ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".css": "text/css", ".js": "application/x-javascript" }'
          fileTypesToUpload: '{ ".html": "text/html" }'
```

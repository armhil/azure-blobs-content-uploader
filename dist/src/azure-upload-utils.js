const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const fs = require('fs');
export function uploadAll(uploadConfigs, filesToUpload, supportedContentTypes) {
    uploadConfigs.forEach(t => {
        const blobServiceClient = BlobServiceClient.fromConnectionString(t.connectionString);
        const containerClient = blobServiceClient.getContainerClient(t.container);
        filesToUpload.forEach(x => {
            let stream = fs.readFileSync(x.absoluteDiskPath);
            let contentType = supportedContentTypes[path.extname(x.absoluteDiskPath)];
            if (!contentType)
                throw `Unsupported Content Type for ${x.absoluteDiskPath}`;
            containerClient.uploadBlockBlob(x.relativeUploadPath, stream, stream.length, { blobHTTPHeaders: { blobContentType: contentType } });
        });
    });
}

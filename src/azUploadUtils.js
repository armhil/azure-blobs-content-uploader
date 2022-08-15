const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const fs = require('fs');

module.exports = {
    uploadAll(azureBlobConfiguration, filesToUpload, supportedContentTypes) {
        azureBlobConfiguration.forEach(t => {
            const blobServiceClient = BlobServiceClient.fromConnectionString(t.connectionString);
            const containerClient = blobServiceClient.getContainerClient(t.container);

            filesToUpload.forEach(x => {
                let stream = fs.readFileSync(x.absolutePath);
                let contentType = supportedContentTypes[path.extname(x.absolutePath)];
                if (!contentType) throw `Unsupported Content Type for ${x.absolutePath}`;
                containerClient.uploadBlockBlob(x.relativePath, stream, stream.length, { blobHTTPHeaders: {blobContentType: contentType }});
            });
        });
    }
}
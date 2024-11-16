import path from 'path';
import fs from 'fs';
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';
import { EntraAppConfiguration, LocalFileMapping } from "./types";

export function uploadAll(
  storageAccountList: Array<string>,
  containerName: string,
  entraAppConfiguration: EntraAppConfiguration,
  filesToUpload: Array<LocalFileMapping>,
  supportedContentTypes: any
): void {
  storageAccountList.forEach(account => {
    // Storage account URL
    const blobServiceClientUrl = `https://${account}.blob.core.windows.net`;

    const credential = new ClientSecretCredential(entraAppConfiguration.tenantId, entraAppConfiguration.clientId, entraAppConfiguration.clientSecret);
    const blobServiceClient = new BlobServiceClient(blobServiceClientUrl, credential);
    // Get a reference to the container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    filesToUpload.forEach(x => {
      let stream = fs.readFileSync(x.absoluteDiskPath);
      let contentType = supportedContentTypes[path.extname(x.absoluteDiskPath)];
      if (!contentType) throw `Unsupported Content Type for ${x.absoluteDiskPath}`;
      containerClient.uploadBlockBlob(x.relativeUploadPath, stream, stream.length, { blobHTTPHeaders: {blobContentType: contentType }});
    });
  });
}
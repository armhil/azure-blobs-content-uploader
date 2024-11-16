"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAll = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var storage_blob_1 = require("@azure/storage-blob");
var identity_1 = require("@azure/identity");
function uploadAll(storageAccountList, containerName, entraAppConfiguration, filesToUpload, supportedContentTypes) {
    storageAccountList.forEach(function (account) {
        // Storage account URL
        var blobServiceClientUrl = "https://".concat(account, ".blob.core.windows.net");
        var credential = new identity_1.ClientSecretCredential(entraAppConfiguration.tenantId, entraAppConfiguration.clientId, entraAppConfiguration.clientSecret);
        var blobServiceClient = new storage_blob_1.BlobServiceClient(blobServiceClientUrl, credential);
        // Get a reference to the container
        var containerClient = blobServiceClient.getContainerClient(containerName);
        filesToUpload.forEach(function (x) {
            var stream = fs_1.default.readFileSync(x.absoluteDiskPath);
            var contentType = supportedContentTypes[path_1.default.extname(x.absoluteDiskPath)];
            if (!contentType)
                throw "Unsupported Content Type for ".concat(x.absoluteDiskPath);
            containerClient.uploadBlockBlob(x.relativeUploadPath, stream, stream.length, { blobHTTPHeaders: { blobContentType: contentType } });
        });
    });
}
exports.uploadAll = uploadAll;

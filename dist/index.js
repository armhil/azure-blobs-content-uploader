"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var file_system_utils_1 = require("./src/file-system-utils");
var azure_upload_utils_1 = require("./src/azure-upload-utils");
try {
    /**
     * File types to upload should look like
     * { ".html": "text/html" }
     */
    var fileTypesToUpload_1 = JSON.parse(core.getInput('fileTypesToUpload'));
    /**
     * Directories to upload should look like
     * [
     *  { directoryToUpload: "", shouldRecurse: "", baseContainerPath: "" }
     * ]
     */
    var directoriesToUpload = JSON.parse(core.getInput('directoriesToUpload')) || [];
    var filesToUpload_1 = [];
    directoriesToUpload.forEach(function (t) {
        filesToUpload_1 = filesToUpload_1.concat((0, file_system_utils_1.getFilesForUpload)(t.directoryToUpload, t.shouldRecurse, t.baseContainerPath, Object.keys(fileTypesToUpload_1)));
    });
    /**
     * Azure Blob Configurations should look like
     * [
     *  { connectionString: "", container: "" }
     * ]
     */
    var entraAppConfiguration = {
        clientId: core.getInput('clientId'),
        clientSecret: core.getInput('clientSecret'),
        tenantId: core.getInput('tenantId')
    };
    var storageAccountList = JSON.parse(core.getInput('storageAccountList'));
    var containerName = core.getInput('containerName');
    (0, azure_upload_utils_1.uploadAll)(storageAccountList, containerName, entraAppConfiguration, filesToUpload_1, fileTypesToUpload_1);
}
catch (error) {
    core.setFailed(error.message);
}

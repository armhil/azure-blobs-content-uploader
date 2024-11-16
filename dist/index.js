import * as core from '@actions/core';
import { getFilesForUpload } from './src/file-system-utils';
import { uploadAll } from './src/azure-upload-utils';
try {
    /**
     * File types to upload should look like
     * { ".html": "text/html" }
     */
    const fileTypesToUpload = JSON.parse(core.getInput('fileTypesToUpload'));
    /**
     * Directories to upload should look like
     * [
     *  { directoryToUpload: "", shouldRecurse: "", baseContainerPath: "" }
     * ]
     */
    const directoriesToUpload = JSON.parse(core.getInput('directoriesToUpload')) || [];
    let filesToUpload = [];
    directoriesToUpload.forEach(t => {
        filesToUpload = filesToUpload.concat(getFilesForUpload(t.directoryToUpload, t.shouldRecurse, t.baseContainerPath, Object.keys(fileTypesToUpload)));
    });
    /**
     * Azure Blob Configurations should look like
     * [
     *  { connectionString: "", container: "" }
     * ]
     */
    const entraAppConfiguration = {
        clientId: core.getInput('clientId'),
        clientSecret: core.getInput('clientSecret'),
        tenantId: core.getInput('tenantId')
    };
    const storageAccountList = JSON.parse(core.getInput('storageAccountList'));
    const containerName = core.getInput('containerName');
    uploadAll(storageAccountList, containerName, entraAppConfiguration, filesToUpload, fileTypesToUpload);
}
catch (error) {
    core.setFailed(error.message);
}

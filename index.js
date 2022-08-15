const core = require('@actions/core');
const fileUtils = require('./src/fileSystemUtils');
const azUploadUtils = require('./src/azUploadUtils');

try {
    /**
     * File types to upload should look like
     * { ".html": "text/html" }
     */
    const fileTypesToUpload = JSON.parse(core.getInput('fileTypesToUpload'));
    /**
     * Directories to upload should look like
     * [
     *  { path: "", shouldRecurse: "" }
     * ]
     */
    const directoriesToUpload = JSON.parse(core.getInput('directoriesToUpload')) || [];
    let filesToUpload = [];
    directoriesToUpload.forEach(t => {
      filesToUpload = filesToUpload.concat(fileUtils.getFilesForUpload(t.path, t.shouldRecurse, Object.keys(fileTypesToUpload)));
    });
    /**
     * Azure Blob Configurations should look like
     * [
     *  { connectionString: "", container: "", path: "" }
     * ]
     */
    const azureBlobConfiguration = JSON.parse(core.getInput('azureBlobConfiguration'));
    azUploadUtils.uploadAll(azureBlobConfiguration, filesToUpload, fileTypesToUpload);
}
catch (error) {
    core.setFailed(error.message);
}
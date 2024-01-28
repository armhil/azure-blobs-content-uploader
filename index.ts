import * as core from '@actions/core';
import { getFilesForUpload } from './src/file-system-utils';
import { uploadAll } from './src/azure-upload-utils';
import { LocalFileMapping, JobParamAzureUploadConfiguration, JobParamDirectoryUpload } from './src/types';

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
  const directoriesToUpload: JobParamDirectoryUpload = JSON.parse(core.getInput('directoriesToUpload')) || [];
  let filesToUpload: Array<LocalFileMapping> = [];
  directoriesToUpload.forEach(t => {
    filesToUpload = filesToUpload.concat(getFilesForUpload(t.directoryToUpload, t.shouldRecurse, t.baseContainerPath, Object.keys(fileTypesToUpload)));
  });
  /**
   * Azure Blob Configurations should look like
   * [
   *  { connectionString: "", container: "" }
   * ]
   */
  const azureBlobConfiguration: JobParamAzureUploadConfiguration = JSON.parse(core.getInput('azureBlobConfiguration'));
  uploadAll(azureBlobConfiguration, filesToUpload, fileTypesToUpload);
}
catch (error) {
  core.setFailed(error.message);
}
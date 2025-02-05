import * as core from '@actions/core';
import { getFilesForUpload } from './src/file-system-utils';
import { uploadAll } from './src/azure-upload-utils';
import { LocalFileMapping, EntraAppConfiguration, JobParamDirectoryUpload } from './src/types';

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
  // build entra auth configuration
  const entraAppConfiguration: EntraAppConfiguration = {
    clientId: core.getInput('clientId'),
    clientSecret: core.getInput('clientSecret'),
    tenantId: core.getInput('tenantId')
  };

  const storageAccountList: Array<string> = JSON.parse(core.getInput('storageAccountList'));
  const containerName = core.getInput('containerName');

  uploadAll(storageAccountList, containerName, entraAppConfiguration, filesToUpload, fileTypesToUpload);
}
catch (error) {
  core.setFailed(error.message);
}

export type LocalFileMapping = {
  // absolute path of the file on disk
  absoluteDiskPath: string;
  // relative path that we should upload the file to
  relativeUploadPath: string;
}

export type EntraAppConfiguration = {
  // client id
  clientId: string;
  // client secret
  clientSecret: string;
  // tenant id
  tenantId: string;
}

export type JobParamDirectoryUpload = Array<{
  // boolean, whether we should traverse deeper than a single dir
  shouldRecurse: boolean;
  // base container path - different than $web, this is the base-path of upload
  baseContainerPath: string;
  // directory to upload (start traversing) on the disk
  directoryToUpload: string;
}>
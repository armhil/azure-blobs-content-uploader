export type LocalFileMapping = {
  // absolute path of the file on disk
  absoluteDiskPath: string;
  // relative path that we should upload the file to
  relativeUploadPath: string;
}

export type JobParamAzureUploadConfiguration = Array<{
  // connection string to blob storage
  connectionString: string;
  // container in blob storage, most likely $web for static content
  container: string;
}>

export type JobParamDirectoryUpload = Array<{
  // boolean, whether we should traverse deeper than a single dir
  shouldRecurse: boolean;
  // base container path - different than $web, this is the base-path of upload
  baseContainerPath: string;
  // directory to upload (start traversing) on the disk
  directoryToUpload: string;
}>
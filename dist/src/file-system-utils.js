import fs from 'fs';
import Queue from 'queue-fifo';
import path from 'path';
let q = new Queue();
/**
 * Traverses the disk and builds a list/map of which files to upload and with what relative paths.
 *
 * @param scanDirectory - Directory to scan on the disk
 * @param shouldRecurse - If we should recurse and upload files in nested directories
 * @param baseContainerPath - Most likely $web for Azure Blobs, if static content is being uploaded
 * @param extensionsToUpload - List of extensions to upload
 *
 * @returns an array of objects which carry absolute path on disk
 *          and where they would be uploaded in cloud
 */
export function getFilesForUpload(scanDirectory, shouldRecurse, baseContainerPath, extensionsToUpload) {
    let filesToUpload = [];
    q.enqueue(scanDirectory);
    while (!q.isEmpty()) {
        const currentDirectoryPath = q.dequeue();
        console.log('Traversing directory: ', currentDirectoryPath);
        const currentDirectoryContents = fs.readdirSync(currentDirectoryPath);
        const filesInCurrentDirectory = currentDirectoryContents
            // filter for files only
            .filter(t => !fs.lstatSync(path.join(currentDirectoryPath, t)).isDirectory())
            // filenames to full path
            .map(t => path.join(currentDirectoryPath, t));
        console.log(`Files in ${currentDirectoryPath}`, filesInCurrentDirectory);
        let uploadCandidates = filesInCurrentDirectory
            // make sure we only target the specified extensions 
            .filter(t => extensionsToUpload.some(x => t.endsWith(x)));
        console.log(`Upload candidates from ${currentDirectoryPath}`, uploadCandidates);
        filesToUpload.push(...uploadCandidates);
        if (shouldRecurse) {
            let dirsInDir = currentDirectoryContents
                .filter(t => fs.lstatSync(path.join(currentDirectoryPath, t))
                // this time, query for directories only
                .isDirectory()).map(t => path.join(currentDirectoryPath, t));
            if (dirsInDir && dirsInDir.length) {
                // enqueue directories, continue traversing
                dirsInDir.forEach(t => q.enqueue(t));
            }
        }
    }
    let uploadStructure = filesToUpload.map(t => {
        let relativePath = t.replace(scanDirectory, '');
        if (relativePath[0] === '/')
            relativePath = relativePath.substring(1);
        if (baseContainerPath !== undefined)
            relativePath = `${baseContainerPath}/${relativePath}`;
        return { absoluteDiskPath: t, relativeUploadPath: relativePath };
    });
    return uploadStructure;
}

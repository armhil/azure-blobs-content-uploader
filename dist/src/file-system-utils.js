"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesForUpload = void 0;
var fs_1 = __importDefault(require("fs"));
var queue_fifo_1 = __importDefault(require("queue-fifo"));
var path_1 = __importDefault(require("path"));
var q = new queue_fifo_1.default();
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
function getFilesForUpload(scanDirectory, shouldRecurse, baseContainerPath, extensionsToUpload) {
    var filesToUpload = [];
    q.enqueue(scanDirectory);
    var _loop_1 = function () {
        var currentDirectoryPath = q.dequeue();
        console.log('Traversing directory: ', currentDirectoryPath);
        var currentDirectoryContents = fs_1.default.readdirSync(currentDirectoryPath);
        var filesInCurrentDirectory = currentDirectoryContents
            // filter for files only
            .filter(function (t) { return !fs_1.default.lstatSync(path_1.default.join(currentDirectoryPath, t)).isDirectory(); })
            // filenames to full path
            .map(function (t) { return path_1.default.join(currentDirectoryPath, t); });
        console.log("Files in ".concat(currentDirectoryPath), filesInCurrentDirectory);
        var uploadCandidates = filesInCurrentDirectory
            // make sure we only target the specified extensions 
            .filter(function (t) { return extensionsToUpload.some(function (x) { return t.endsWith(x); }); });
        console.log("Upload candidates from ".concat(currentDirectoryPath), uploadCandidates);
        filesToUpload.push.apply(filesToUpload, uploadCandidates);
        if (shouldRecurse) {
            var dirsInDir = currentDirectoryContents
                .filter(function (t) { return fs_1.default.lstatSync(path_1.default.join(currentDirectoryPath, t))
                // this time, query for directories only
                .isDirectory(); }).map(function (t) { return path_1.default.join(currentDirectoryPath, t); });
            if (dirsInDir && dirsInDir.length) {
                // enqueue directories, continue traversing
                dirsInDir.forEach(function (t) { return q.enqueue(t); });
            }
        }
    };
    while (!q.isEmpty()) {
        _loop_1();
    }
    var uploadStructure = filesToUpload.map(function (t) {
        var relativePath = t.replace(scanDirectory, '');
        if (relativePath[0] === '/')
            relativePath = relativePath.substring(1);
        if (baseContainerPath !== undefined)
            relativePath = "".concat(baseContainerPath, "/").concat(relativePath);
        return { absoluteDiskPath: t, relativeUploadPath: relativePath };
    });
    return uploadStructure;
}
exports.getFilesForUpload = getFilesForUpload;

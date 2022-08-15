const fs = require('fs');
const Queue = require('queue-fifo');
const path = require('path');
let q = new Queue();

module.exports = {
    getFilesForUpload(scanDirectory, shouldRecurse, extensionsToUpload) {
        let filesToUpload = [];
        q.enqueue(scanDirectory);
        while (!q.isEmpty()) {
            const currentDirectoryPath = q.dequeue();
            console.log('current dir path', currentDirectoryPath);
            const currentDirectoryContents = fs.readdirSync(currentDirectoryPath);
            const filesInCurrentDirectory =
                currentDirectoryContents
                    .filter(t => !fs.lstatSync(path.join(currentDirectoryPath, t)).isDirectory())
                    .map(t => path.join(currentDirectoryPath, t));

            console.log(`Files in ${currentDirectoryPath}`, filesInCurrentDirectory);
            let uploadCandidates =
                filesInCurrentDirectory
                    .filter(t => extensionsToUpload.some(x => t.endsWith(x)));

            console.log(`Upload candidates from ${currentDirectoryPath}`, uploadCandidates);
            filesToUpload.push(...uploadCandidates);
            if (shouldRecurse) {
                let dirsInDir = currentDirectoryContents
                    .filter(t => fs.lstatSync(path.join(currentDirectoryPath, t))
                    .isDirectory()).map(t => path.join(currentDirectoryPath, t));
                if (dirsInDir && dirsInDir.length) q.enqueue(...dirsInDir);
            }
        }

        let uploadStructure = filesToUpload.map(t => {
            let relativePath = t.replace(scanDirectory, '');
            if (relativePath[0] === '/') relativePath = relativePath.substring(1);
            return { absolutePath: t, relativePath: relativePath }
        });

        return uploadStructure;
    }
}
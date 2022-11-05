const fileUtils = require('./../src/fileSystemUtils');
const path = require('path');

describe('fileSystemUtils tests', () => {
    it('getFilesForUpload should upload the expected file list for non-recursive list', () =>{
        const fileList = fileUtils.getFilesForUpload(path.join(__dirname, 'unittest-directory'), false, undefined, ['.png', '.txt']);
        expect(fileList[0].relativePath).toContain('sample1.png');
        expect(fileList[1].relativePath).toContain('sample2.txt');
    });
    it('getFilesForUpload should upload the expected file list for recursive list', () => {
        const fileList = fileUtils.getFilesForUpload(path.join(__dirname, 'unittest-directory'), true, "someContainerPath", ['.png', '.txt', '.html']);
        expect(fileList[0].relativePath).toContain('sample1.png');
        expect(fileList[1].relativePath).toContain('sample2.txt');
        expect(fileList[2].relativePath).toContain('sample4.html');
    });
});
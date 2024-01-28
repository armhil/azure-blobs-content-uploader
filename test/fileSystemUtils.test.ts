import { getFilesForUpload } from './../src/file-system-utils';
import path from 'path';

describe('fileSystemUtils tests', () => {
    it('getFilesForUpload should upload the expected file list for non-recursive list', () =>{
        const fileList = getFilesForUpload(path.join(__dirname, 'unittest-directory'), false, undefined, ['.png', '.txt']);
        expect(fileList[0].relativeUploadPath).toContain('sample1.png');
        expect(fileList[1].relativeUploadPath).toContain('sample2.txt');
    });
    it('getFilesForUpload should upload the expected file list for recursive list', () => {
        const fileList = getFilesForUpload(path.join(__dirname, 'unittest-directory'), true, "someContainerPath", ['.png', '.txt', '.html']);
        expect(fileList[0].relativeUploadPath).toContain('sample1.png');
        expect(fileList[1].relativeUploadPath).toContain('sample2.txt');
        expect(fileList[2].relativeUploadPath).toContain('sample4.html');
    });
});
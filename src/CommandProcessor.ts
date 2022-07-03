import * as fs from 'fs';
import * as path from 'path';
import { StringBuilder } from './Stringbuilder';
import * as Crypto from 'crypto';
import { tmpdir } from 'os';

export class CommandProcessor {
    public process(myArgs: string[]) {
        console.log('myArgs: ', myArgs);

        switch (myArgs[0].toLowerCase()) {
            case 'new':
                this.processNewCommand(myArgs);
                break;
            case 'edit':
                this.processEditCommand(myArgs);
                break;
            case 'import':
                this.processImportCommand(myArgs);
                break;
            case 'bind':
                this.processBindCommand(myArgs);
                break;
            default:
                console.log('Sorry, that is not something I know how to do.');
                break;
        }
    }

    processNewCommand(myArgs: string[]) {
        switch (myArgs[1].toLowerCase()) {
            case 'book':
                this.processNewBook(myArgs);
                break;
            case 'section':
                this.processNewSection(myArgs);
                break;
            case 'page':
                this.processNewPage(myArgs);
                break;
            default:
                console.log('Sorry, that is not something I know how to do.');
                break;
        }
    }

    processNewBook(myArgs: string[]) {
        // create the directory
        this.createDirectories(myArgs[2]);
    }

    processNewSection(myArgs: string[]) {
        // create the directory
        this.createDirectories2(myArgs[2], myArgs[3]);
    }

    processNewPage(myArgs: string[]) {
        this.createDirectories2(myArgs[2], myArgs[3]);

        var pageFileName: string;
        pageFileName = path.join(myArgs[2], myArgs[3], myArgs[4]);

        if (fs.existsSync(pageFileName)) {
            console.log(`Sorry, that page (${pageFileName}) already exists.`);
            return;
        }

        var newText: string;
        newText = "Hello Brad";

        var ext: string = this.fileExtension(pageFileName);

        switch (ext) {
            case 'md':
                newText = this.createDefaultMdFile();
                break;
            //     this.processNewBook(myArgs);
            //     break;
            // case 'section':
            //     this.processImportSection(myArgs);
            //     break;
            // case 'page':
            //     this.processImportPage(myArgs);
            //     break;
            //     default:
            //     console.log('Sorry, that is not something I know how to do.');
            //     break;
        }

        fs.writeFileSync(pageFileName, newText);

        this.launchApplicationForFile(pageFileName);
    }

    processEditCommand(myArgs: string[]) {
        var pageFileName: string;
        pageFileName = path.join(myArgs[1], myArgs[2], myArgs[3]);

        if (!fs.existsSync(pageFileName)) {
            console.log(`Sorry, that page (${pageFileName}) does not exist.`);
            return;
        }

        this.launchApplicationForFile(pageFileName);
    }

    launchApplicationForFile(fileName: string){
        const exec = require('child_process').exec;
        const child1 = exec(`\"${fileName}\"`, [], (error: string, stdout: string, stderr: string) => {
            if (error) {
                console.error('stderr', stderr);
                throw error;
            }
            //console.log('stdout', stdout);
        });        
    }

    createDefaultMdFile(): string{
        var sb:StringBuilder = new StringBuilder();
        sb.appendLine("# Sample Markdown File  ");
        return sb.text;
    }

    processImportCommand(myArgs: string[]) {
        // copy file to selected book/section/page
        this.createDirectories2(myArgs[1], myArgs[2]);

        var pageFileName: string;
        pageFileName = path.join(myArgs[1], myArgs[2], myArgs[3]);

        if (fs.existsSync(pageFileName)) {
            console.log(`Sorry, that page (${pageFileName}) already exists.`);
            return;
        }

//        fs.writeFileSync(pageFileName, newText);
        fs.copyFileSync(myArgs[4], pageFileName);

        this.launchApplicationForFile(pageFileName);
    }

    processBindCommand(myArgs: string[]) {
        // book is myArgs[1]
        this.bindFolder(myArgs[1], myArgs[2]);
    }

    bindFolder(sourceFolder: string, destinationFolder: string) {
        this.createDirectories(destinationFolder);

        var fileNames: string[];

        fileNames = fs.readdirSync(sourceFolder, {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name);

        for (var val of fileNames) {
            var fullName: string = path.join(sourceFolder, val);

            this.bindFile(fullName, destinationFolder);
        }

        var directoryNames: string[];

        directoryNames = fs.readdirSync(sourceFolder, {withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(item => item.name);

        // https://www.tutorialsteacher.com/typescript/for-loop
        for (var val of directoryNames) {
            var fullName: string = path.join(sourceFolder, val);
            var fullTargetName: string = path.join(destinationFolder, val);

            console.log(`${fullName} --> ${fullTargetName}`);

            this.bindFolder(fullName, fullTargetName);
        }
    }

    bindFile(sourceFileName: string, destinationFolder: string) {

        var filename = this.fileNameOnly(sourceFileName);

        var fullTargetName: string = path.join(destinationFolder, filename);

        var tmpFile = this.getTempFileName();

        console.log(`${sourceFileName} --> ${fullTargetName}`);
    }

    //https://stackoverflow.com/questions/7055061/nodejs-temporary-file-name    
    getTempFileName(extension: string = "tmp") :string{
        // Starting with dg. to indicate that the files come from this application.  Easier to identify when cleaninug up garbage.  (Being a good citizen)
        return path.join(tmpdir(),`dg.${Crypto.randomBytes(6).readUIntLE(0,6).toString(36)}.${extension}`);
    }    

    createDirectories(book: string) {
       const dirName = path.resolve();
       book = book.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
       fs.mkdir(path.resolve(dirName, book), { recursive: true }, e => {
           if (e) {
               console.error(e);
           } else {
               console.log('Success');
           }
        });
    }    

    createDirectories2(book: string, section: string) {
        const dirName = path.resolve();
        book = book.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
        //book = path.join(book, section);
//        fs.mkdir(path.resolve(`\"${dirName}\"`, `\"${book}\"`), { recursive: true }, e => {
//            fs.mkdir(`\"${book}\"`, { recursive: true }, e => {    
        fs.mkdirSync(path.resolve(book, section), { recursive: true });

        // fs.mkdir(path.resolve(dirName, `\"${book}\"`), { recursive: true }, e => {
        // if (e) {
        //         console.error(e);
        //     } else {
        //         console.log('Success');
        //     }
        //  });
     }    

     fileExtension(fileName:string) : string{
        // https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        var fileExt: string = fileName.split('.').pop()!;
        if(fileExt === fileName){
            fileExt = "";
        }
        return fileExt;
     }

     fileNameOnly(fileName:string) : string{
        // https://www.w3schools.com/nodejs/met_path_basename.asp
        var noPath = path.basename(fileName);
        var ext = this.fileExtension(noPath);
        var nameOnly = noPath.substring(0, noPath.length - ext.length - 1);

        return nameOnly;
     }
     
}
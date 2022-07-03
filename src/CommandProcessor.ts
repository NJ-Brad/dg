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
            case 'C4DSL':
                newText = this.createDefaultC4DslFile();
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

    createDefaultC4DslFile(): string{
        var sb:StringBuilder = new StringBuilder();
        sb.appendLine("workspace ");
        sb.appendLine("[");
        sb.appendLine("    items");
        sb.appendLine("    [");
        sb.appendLine("        external_person customer \"Customer\" (\"A customer of the bank,`with personal bank accounts\")");
        sb.appendLine("        enterprise e1 \"Big Co\"");
        sb.appendLine("        [");
        sb.appendLine("            system c1 \"Internet Banking\"");
        sb.appendLine("            [");
        sb.appendLine("                Container web_app \"Web Application\" utilizing \"Java, Spring MVC\" (\"Delivers the static content`and the Internet banking SPA\")");
        sb.appendLine("                Container backend_api \"API Application\" utilizing \"Java, Docker Container\" (\"Provides Internet banking`functionality via API\")");
        sb.appendLine("                Container spa \"Single-Page App\" utilizing \"JavaScript, Angular\" (\"Provides all the Internet banking`functionality to cutomers`via their web browser\")");
        sb.appendLine("                Container mobile_app \"Mobile App\" utilizing \"C#, Xamarin\" (\"Provides a limited subset`of the Internet banking`functionality to customers`via their mobile device\")");
        sb.appendLine("                Database database \"Database\" utilizing \"SQL Database\" (\"Stores user registration`information, hashed auth credentials,`access logs, etc.\")");
        sb.appendLine("                [");
        sb.appendLine("                    Table table1 \"Table 1\"");
        sb.appendLine("                    Table table2 \"Table 2\"");
        sb.appendLine("                    Table table3 \"Table 3\"");
        sb.appendLine("                ]");
        sb.appendLine("            ]");
        sb.appendLine("            system banking_system \"Mainframe Banking System\"  (\"Stores all of the core`banking information about`customers, accounts, transactions, etc.\")");
        sb.appendLine("        ]");
        sb.appendLine("        external_system email_system \"E-Mail System\" (\"The internal`Microsoft Exchange system\")");
        sb.appendLine("    ]");
        sb.appendLine("    ");
        sb.appendLine("    connections");
        sb.appendLine("    [");
        sb.appendLine("        customer Uses web_app utilizing \"HTTPS\"");
        sb.appendLine("        customer Uses spa utilizing \"HTTPS\"");
        sb.appendLine("        customer Uses mobile_app");
        sb.appendLine("        web_app Delivers spa");
        sb.appendLine("        spa Uses backend_api utilizing \"async, JSON/HTTPS\"");
        sb.appendLine("        mobile_app Uses backend_api utilizing \"async, JSON/HTTPS\"");
        sb.appendLine("        database \"Reads from and writes to\" backend_api utilizing \"sync, JDBC\"");
        sb.appendLine("        email_system \"Sends e-mails to\" customer ");
        sb.appendLine("        backend_api \"Sends e-mails using\" email_system utilizing \"sync, SMTP\"");
        sb.appendLine("        backend_api Uses banking_system utilizing \"sync/async, XML/HTTPS\"");
        sb.appendLine("    ]");
        sb.appendLine("]");
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
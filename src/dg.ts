//import * as fs from 'fs';
 import { CommandProcessor } from './CommandProcessor';
// import { BlockParser } from './BlockParser';

// import { StringBuilder } from "./Stringbuilder";
// import { StringStream } from "./StringStream";
// import { BlockToC4Converter} from "./BlockToC4Converter";
// import { C4Workspace } from "./C4Workspace";
// import { WorkspacePublisher } from "./WorkspacePublisher";
// import { MermaidRunner } from "./MermaidRunner";

// let message: string = 'Hello World';
// console.log(message);

    var cp : CommandProcessor = new CommandProcessor();
    cp.process(process.argv.slice(2));

 import { CommandProcessor } from './CommandProcessor';

    console.log('DG - Document Generator');

    var cp : CommandProcessor = new CommandProcessor();
    cp.process(process.argv.slice(2));

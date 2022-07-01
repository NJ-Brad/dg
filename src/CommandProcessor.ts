export class CommandProcessor
{
    public process(myArgs: string[])
    {
        console.log('myArgs: ', myArgs);
        
        switch (myArgs[0].toLowerCase()) {
            case 'new':
                this.processNewCommand(myArgs);
                break;
            case 'import':
                this.processImportCommand(myArgs);
                break;
            default:
                console.log('Sorry, that is not something I know how to do.');
        }
    }
    
    processNewCommand(myArgs: string[]){
    }

    processImportCommand(myArgs: string[]){
    }
    
}
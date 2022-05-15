import { ILogger } from "../interface/ILogger";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class Logger implements ILogger {
    // tslint:disable-next-line: no-empty
    public constructor() {}

    public log(message: string): void {
        // tslint:disable-next-line: no-console
        console.log(`[LOG]: ${message}`);
    }

    public error(message: string): void {
        // tslint:disable-next-line: no-console
        console.error(`[ERROR]: ${message}`);
    }
    // Can any type of variable
    public info(obj: any): void {
        // tslint:disable-next-line: no-console
        console.error(obj);
    }
}

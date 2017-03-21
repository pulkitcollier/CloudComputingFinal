import * as csv from 'csv-stringify';
import { existsSync, createWriteStream, WriteStream } from 'fs';

export class CSVWriter {
    private readonly csv: csv.Stringifier;
    private readonly file: WriteStream;

    constructor(fields: string[]) {
        if (existsSync('data.csv')) {
            this.file = createWriteStream('data.csv', { flags: 'a' });
            this.csv = csv();
        } else {
            this.file = createWriteStream('data.csv', { flags: 'w' });
            this.csv = csv({ header: true, columns: fields });
        }
    }

    write(data: any[]): void {
        this.csv.write(data);
        this.file.write(this.csv.read());
    }
}
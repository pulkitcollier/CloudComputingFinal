"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("csv-stringify");
const fs_1 = require("fs");
class CSVWriter {
    constructor(fields) {
        if (fs_1.existsSync('data.csv')) {
            this.file = fs_1.createWriteStream('data.csv', { flags: 'a' });
            this.csv = csv();
        }
        else {
            this.file = fs_1.createWriteStream('data.csv', { flags: 'w' });
            this.csv = csv({ header: true, columns: fields });
        }
    }
    write(data) {
        this.csv.write(data);
        this.file.write(this.csv.read());
    }
}
exports.CSVWriter = CSVWriter;
//# sourceMappingURL=csvwriter.js.map
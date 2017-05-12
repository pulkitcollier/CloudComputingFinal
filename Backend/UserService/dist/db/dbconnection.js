"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PG = require("pg");
const dbConfig = {
    user: 'yh2901',
    password: 'emilyhua',
    database: 'apollo',
    host: 'cc-apollo.cbnpvhclb9ix.us-east-1.rds.amazonaws.com',
    port: 5432
};
PG.types.setTypeParser(1114, function (stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});
class DbConnection {
    static query(sql, values) {
        return new Promise((resolve, reject) => {
            let client = new PG.Client(dbConfig);
            client.query(sql, values, (e, r) => {
                client.release(true);
                console.log(r);
                if (e)
                    reject(e);
                else
                    resolve(r.rows);
            });
        });
    }
}
exports.DbConnection = DbConnection;

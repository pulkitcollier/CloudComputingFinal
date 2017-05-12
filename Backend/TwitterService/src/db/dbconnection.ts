import * as PG from "pg";

const dbConfig: PG.ClientConfig = {
    user: 'yh2901',
    password: 'emilyhua',

    database: 'apollo',
    host: 'cc-apollo.cbnpvhclb9ix.us-east-1.rds.amazonaws.com',
    port: 5432
};

PG.types.setTypeParser(1114, function (stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});

export class DbConnection {

    query(sql: string, values: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            PG.connect(dbConfig, (err, client, done) => {
                if (err) reject(err);

                client.query(sql, values, (e, r) => {
                    client.end();

                    if (e) reject(e);
                    else resolve(r.rows);
                })
            });
        });
    }

}

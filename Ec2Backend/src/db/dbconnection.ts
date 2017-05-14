import * as PG from "pg";

PG.types.setTypeParser(1114, function (stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});

export class DbConnection {

    static pool: PG.Pool = new PG.Pool(dbConfig);

    static query(sql: string, values: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.pool.connect((err, client, done) => {
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

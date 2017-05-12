import * as AWS from "aws-sdk";
import * as Lambda from "aws-lambda";
import * as Request from 'request-promise';
import * as format from 'pg-format';

import { DbConnection } from './db/dbconnection';

export async function handler(event: any, context: Lambda.Context, callback: Lambda.Callback): Promise<void> {
    let conn = new DbConnection();

    try {
        switch (event.operation) {
            case 'put': {
                let userid = event.userid;
                let deviceid = event.deviceid;
                let x = event.x;
                let y = event.y;
                let z = event.z;

                await conn.query('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES ($1, $2, $3, $4, $5, $6)',
                    [userid, deviceid, new Date().toUTCString(), x, y, z]);
                callback(null, 'OK');
            }
                break;
            case 'putbulk': {
                let data = event.data.map(d => {
                    return [
                        d.userid,
                        d.deviceid,
                        d.t,
                        d.x,
                        d.y,
                        d.z
                    ]
                });

                await conn.query(format('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES %L', data), []);
                callback(null, 'OK');
            }
                break;
        }
    } catch (ex) {
        callback(new Error(ex), null);
    }
}

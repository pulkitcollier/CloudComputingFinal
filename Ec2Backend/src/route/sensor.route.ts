import { Router } from 'express';
import { DbConnection } from "../db/dbconnection";
import * as format from 'pg-format';

export const sensorRouter = Router();

sensorRouter.post('/', async (req, res) => {
    let data = req.body.data.map(d => {
        return [
            d.userid,
            d.deviceid,
            d.t,
            d.x,
            d.y,
            d.z
        ]
    });

    await DbConnection.query(format('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES %L', data), []);
    res.send({result: 'OK'});
});

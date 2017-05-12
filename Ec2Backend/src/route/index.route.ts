import { Router } from 'express';
import { DbConnection } from "../db/dbconnection";

export const indexRouter = Router();

indexRouter.get('/', async (req, res) => {
    let sql = req.query.sql;
    let r = await DbConnection.query(sql, []);
    res.send(r);
});

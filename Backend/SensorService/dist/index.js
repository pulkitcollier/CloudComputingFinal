"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const format = require("pg-format");
const dbconnection_1 = require("./db/dbconnection");
function handler(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let conn = new dbconnection_1.DbConnection();
        try {
            switch (event.operation) {
                case 'put':
                    {
                        let userId = event.userId;
                        let deviceId = event.deviceId;
                        let x = event.x;
                        let y = event.y;
                        let z = event.z;
                        yield conn.query('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES ($1, $2, $3, $4, $5, $6)', [userId, deviceId, new Date().toUTCString(), x, y, z]);
                    }
                    break;
                case 'putbulk':
                    {
                        let data = event.data.map(d => {
                            return [
                                d.userId,
                                d.deviceId,
                                d.t,
                                d.x,
                                d.y,
                                d.z
                            ];
                        });
                        yield conn.query(format('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES %L', data), []);
                    }
                    break;
            }
        }
        catch (ex) {
            callback(new Error(ex), null);
        }
    });
}
exports.handler = handler;

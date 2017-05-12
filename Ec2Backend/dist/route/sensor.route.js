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
const express_1 = require("express");
const dbconnection_1 = require("../db/dbconnection");
const format = require("pg-format");
exports.sensorRouter = express_1.Router();
exports.sensorRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let data = req.body.data.map(d => {
        return [
            d.userid,
            d.deviceid,
            d.t,
            d.x,
            d.y,
            d.z
        ];
    });
    yield dbconnection_1.DbConnection.query(format('INSERT INTO acc (userid, deviceid, t, x, y, z) VALUES %L', data), []);
    res.send({ result: 'OK' });
}));
//# sourceMappingURL=sensor.route.js.map
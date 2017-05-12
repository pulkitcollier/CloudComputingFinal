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
const Bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const config_1 = require("../config");
exports.userRouter = express_1.Router();
exports.userRouter.post('/register', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let username = req.body.username;
    let password = req.body.password;
    let twitter = req.body.twitter;
    let email = req.body.email;
    let phonenumber = req.body.phonenumber;
    yield dbconnection_1.DbConnection.query('INSERT INTO users (username, password, tweethandle, registertime, email, phonenumber, useemail, usesms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [username, Bcrypt.hashSync(password), twitter, new Date().toUTCString(), email, phonenumber, false, false]);
    res.send({ result: 'OK' });
}));
exports.userRouter.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let username = req.body.username;
    let password = req.body.password;
    let r = yield dbconnection_1.DbConnection.query('SELECT userid, password FROM users WHERE username = $1', [username]);
    if (r[0] && Bcrypt.compareSync(password, r[0].password)) {
        res.send({ userid: r[0].userid });
    }
    else {
        res.send('Username of Password Error.');
    }
}));
exports.userRouter.get('/:id/friends', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let r = yield dbconnection_1.DbConnection.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
    let friends = yield Promise.all(r.map((f) => __awaiter(this, void 0, void 0, function* () {
        let username = (yield dbconnection_1.DbConnection.query('SELECT username FROM users WHERE userid = $1', [f.friendid]))[0].username;
        return {
            userid: f.friendid,
            username: username
        };
    })));
    res.send({ friends: friends });
}));
exports.userRouter.post('/:id/friends', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let friendname = req.body.friendname;
    let friendid = (yield dbconnection_1.DbConnection.query('SELECT userid FROM users WHERE username = $1', [friendname]))[0].userid;
    yield dbconnection_1.DbConnection.query('INSERT INTO friendship (userid, friendid) VALUES ($1, $2)', [userid, friendid]);
    res.send({ result: 'OK' });
}));
exports.userRouter.delete('/:id/friends', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let friendname = req.body.friendname;
    let friendid = (yield dbconnection_1.DbConnection.query('SELECT userid FROM users WHERE username = $1', [friendname]))[0].userid;
    yield dbconnection_1.DbConnection.query('DELETE FROM friendship WHERE userid = $1 AND friendid = $2', [userid, friendid]);
    res.send({ result: 'OK' });
}));
exports.userRouter.get('/:id/settings', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let r = yield dbconnection_1.DbConnection.query('SELECT useemail, usesms FROM users WHERE userid = $1', [userid]);
    res.send(r[0]);
}));
exports.userRouter.post('/:id/settings', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let useemail = req.body.useemail;
    let usesms = req.body.usesms;
    let r = yield dbconnection_1.DbConnection.query('SELECT email, phonenumber FROM users WHERE userid = $1', [userid]);
    yield dbconnection_1.DbConnection.query('UPDATE users SET useemail = $1, usesms = $2 WHERE userid = $3', [useemail, usesms, userid]);
    let sns = new AWS.SNS(config_1.awsConfig);
    if (useemail) {
        sns.subscribe({
            Protocol: 'email',
            TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertEmail',
            Endpoint: r[0].email
        }, (e, d) => __awaiter(this, void 0, void 0, function* () {
            if (e) {
                res.send(e);
            }
            else {
                let arn = d.SubscriptionArn;
                yield dbconnection_1.DbConnection.query('UPDATE users SET emailarn = $1 WHERE userid = $2', [arn, userid]);
            }
        }));
    }
    else {
        let arn = (yield dbconnection_1.DbConnection.query('SELECT emailarn FROM users WHERE userid = $1', [userid]))[0].emailarn;
        sns.unsubscribe({
            SubscriptionArn: arn
        });
    }
    if (usesms) {
        sns.subscribe({
            Protocol: 'sms',
            TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertSMS',
            Endpoint: r[0].phonenumber
        }, (e, d) => __awaiter(this, void 0, void 0, function* () {
            if (e) {
                res.send(e);
            }
            else {
                let arn = d.SubscriptionArn;
                yield dbconnection_1.DbConnection.query('UPDATE users SET smsarn = $1 WHERE userid = $2', [arn, userid]);
            }
        }));
    }
    else {
        let arn = (yield dbconnection_1.DbConnection.query('SELECT smsarn FROM users WHERE userid = $1', [userid]))[0].smsarn;
        sns.unsubscribe({
            SubscriptionArn: arn
        });
    }
    res.send({ result: 'OK' });
}));
exports.userRouter.get('/:id/status', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let userid = req.param('id');
    let week = new Date();
    week.setDate(week.getDate() - 7);
    let month = new Date();
    month.setDate(month.getDate() - 30);
    // FIXME: select actual people count
    let weekgood = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore > 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let weekneutral = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore = 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let weekbad = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore < 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let monthgood = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore > 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;
    let monthneutral = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore = 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;
    let monthbad = (yield dbconnection_1.DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore < 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;
    res.send({
        weekgood: weekgood,
        weekneutral: weekneutral,
        weekbad: weekbad,
        monthgood: monthgood,
        monthneutral: monthneutral,
        monthbad: monthbad
    });
}));
//# sourceMappingURL=user.route.js.map
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
const AWS = require("aws-sdk");
const Bcrypt = require("bcryptjs");
const dbconnection_1 = require("./db/dbconnection");
function handler(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(event);
        try {
            switch (event.operation) {
                case 'register':
                    {
                        let username = event.username;
                        let password = event.password;
                        let twitter = event.twitter;
                        let email = event.email;
                        let phonenumber = event.phonenumber;
                        yield dbconnection_1.DbConnection.query('INSERT INTO users (username, password, tweethandle, registertime, email, phonenumber, useemail, usesms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [username, Bcrypt.hashSync(password), twitter, new Date().toUTCString(), email, phonenumber, true, true]);
                        callback(null, 'OK');
                    }
                    break;
                case 'login':
                    {
                        let username = event.username;
                        let password = event.password;
                        let res = yield dbconnection_1.DbConnection.query('SELECT userid, password FROM users WHERE username = $1', [username]);
                        if (res[0] && Bcrypt.compareSync(password, res[0].password)) {
                            callback(null, { userid: res[0].userid });
                        }
                        else {
                            callback(new Error('Username or Password error.'), null);
                        }
                    }
                    break;
                case 'friends':
                    {
                        let userid = event.userid;
                        let res = yield dbconnection_1.DbConnection.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
                        callback(null, { friends: res });
                    }
                    break;
                case 'status':
                    {
                        let userid = event.userid;
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
                        callback(null, {
                            weekgood: weekgood,
                            weekneutral: weekneutral,
                            weekbad: weekbad,
                            monthgood: monthgood,
                            monthneutral: monthneutral,
                            monthbad: monthbad
                        });
                    }
                    break;
                case 'settings':
                    {
                        let userid = event.userid;
                        let useemail = event.useemail;
                        let usesms = event.usesms;
                        let res = yield dbconnection_1.DbConnection.query('SELECT email, phonenumber FROM users WHERE userid = $1', [userid]);
                        yield dbconnection_1.DbConnection.query('UPDATE users SET useemail = $1, usesms = $2 WHERE userid = $3', [useemail, usesms, userid]);
                        let sns = new AWS.SNS();
                        if (useemail) {
                            // sns.subscribe({
                            //     Protocol: 'email',
                            //     TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertEmail',
                            //     Endpoint: res[0].email
                            // }, (e, d) => {
                            // });
                        }
                        else {
                            // sns.unsubscribe({
                            //     SubscriptionArn:
                            // });
                        }
                        if (usesms) {
                            // sns.subscribe({
                            //     Protocol: 'sms',
                            //     TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertSMS',
                            //     Endpoint: res[0].phonenumber
                            // }, (e, d) => {
                            // });
                        }
                        else {
                            // sns.unsubscribe({
                            //     SubscriptionArn:
                            // });
                        }
                        callback(null, 'OK');
                    }
                    break;
                case 'sql':
                    {
                        callback(null, yield dbconnection_1.DbConnection.query(event.sql, []));
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

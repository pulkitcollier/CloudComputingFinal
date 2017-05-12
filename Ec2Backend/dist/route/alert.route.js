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
const Request = require("request-promise");
const AWS = require("aws-sdk");
const config_1 = require("../config");
exports.alertRouter = express_1.Router();
exports.alertRouter.get('/work', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let sns = new AWS.SNS(config_1.awsConfig);
    let accRes = yield dbconnection_1.DbConnection.query('SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM (SELECT deviceid, T, X, Y, Z, abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff, abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff, abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff FROM acc)a GROUP BY a.deviceid , a.T;', []);
    let d14 = new Date();
    d14.setDate(d14.getDate() - 14);
    let d7 = new Date();
    d7.setDate(d7.getDate() - 7);
    let lateTweet = yield dbconnection_1.DbConnection.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d14.toUTCString(), d7.toUTCString()]);
    let newTweet = yield dbconnection_1.DbConnection.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d7.toUTCString(), new Date().toUTCString()]);
    for (var i = 0; i < lateTweet.length; i++) {
        var lt = lateTweet[i];
        var nt = newTweet[i];
        let tres = JSON.parse(yield Request.get('http://35.184.204.97:8081/getTstats?favoritesCount=' + lt.favoritescount + '&followerCount=' + lt.followercount + '&friendsCount=' + lt.friendscount + '&averaged_scores=' + lt.averaged_scores + '&activity_count=' + lt.activity_count + '&statusesCount=' + lt.statusescount));
        let acount = Math.abs(nt.activity_count - lt.activity_count);
        let sscore = nt.averaged_scores - lt.averaged_scores;
        let sscoreabs = Math.abs(sscore);
        if (acount > tres.activity_count_std) {
            yield dbconnection_1.DbConnection.query('INSERT INTO alert (userid, friendid, alertcontent, createtime) VALUES ($1, $2, $3, $4)', [lt.userid, nt.userid, `Your Friend ${nt.userid} is having abnormal activities.`, new Date().toUTCString()]);
            sns.publish({
                Message: `Your Friend ${nt.userid} is having abnormal activities.`,
                TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertEmail'
            }, (e, r) => {
            });
            sns.publish({
                Message: `Your Friend ${nt.userid} is having abnormal activities.`,
                TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertSMS'
            }, (e, r) => {
            });
        }
        if (sscoreabs > tres.sentiment_score_std) {
            yield dbconnection_1.DbConnection.query('INSERT INTO alert (userid, friendid, alertcontent, createtime) VALUES ($1, $2, $3, $4)', [lt.userid, nt.userid, `Your Friend ${nt.userid} is being ${sscore > 0 ? 'happy' : 'sad'}.`, new Date().toUTCString()]);
            sns.publish({
                Message: `Your Friend ${nt.userid} is being ${sscore > 0 ? 'happy' : 'sad'}.`,
                TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertEmail'
            }, (e, r) => {
            });
            sns.publish({
                Message: `Your Friend ${nt.userid} is being ${sscore > 0 ? 'happy' : 'sad'}.`,
                TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertSMS'
            }, (e, r) => {
            });
        }
    }
    res.send({ result: 'OK' });
}));
exports.alertRouter.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let ares = yield dbconnection_1.DbConnection.query('SELECT alertcontent FROM alert', []);
    let alerts = ares.map(a => {
        return a.alertcontent;
    });
    res.send({ alerts: alerts });
}));
//# sourceMappingURL=alert.route.js.map
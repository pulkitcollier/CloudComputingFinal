import { Router } from 'express';
import { DbConnection } from "../db/dbconnection";
import * as Request from 'request-promise';
import * as AWS from 'aws-sdk';
import { awsConfig } from "../config";

export const alertRouter = Router();

alertRouter.get('/work', async (req, res) => {
    let sns = new AWS.SNS(awsConfig);

    let accRes = await DbConnection.query('SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM (SELECT deviceid, T, X, Y, Z, abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff, abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff, abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff FROM acc)a GROUP BY a.deviceid , a.T;', []);

    let d14 = new Date();
    d14.setDate(d14.getDate() - 14);
    let d7 = new Date();
    d7.setDate(d7.getDate() - 7);

    let lateTweet = await DbConnection.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d14.toUTCString(), d7.toUTCString()]);
    let newTweet = await DbConnection.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d7.toUTCString(), new Date().toUTCString()]);

    for (var i = 0; i < lateTweet.length; i++) {
        var lt = lateTweet[i];
        var nt = newTweet[i];
        let tres = JSON.parse(await Request.get('http://35.184.204.97:8081/getTstats?favoritesCount=' + lt.favoritescount + '&followerCount=' + lt.followercount + '&friendsCount=' + lt.friendscount + '&averaged_scores=' + lt.averaged_scores + '&activity_count=' + lt.activity_count + '&statusesCount=' + lt.statusescount));

        let acount = Math.abs(nt.activity_count - lt.activity_count);
        let sscore = nt.averaged_scores - lt.averaged_scores;
        let sscoreabs = Math.abs(sscore);

        if (acount > tres.activity_count_std) {
            await DbConnection.query('INSERT INTO alert (userid, friendid, alertcontent, createtime) VALUES ($1, $2, $3, $4)', [lt.userid, nt.userid, `Your Friend ${nt.userid} is having abnormal activities.`, new Date().toUTCString()]);
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
            await DbConnection.query('INSERT INTO alert (userid, friendid, alertcontent, createtime) VALUES ($1, $2, $3, $4)', [lt.userid, nt.userid, `Your Friend ${nt.userid} is being ${sscore > 0 ? 'happy' : 'sad'}.`, new Date().toUTCString()]);
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
});

alertRouter.get('/', async (req, res) => {
    let ares = await DbConnection.query('SELECT alertcontent FROM alert', []);
    let alerts = ares.map(a => {
        return a.alertcontent;
    });
    res.send({ alerts: alerts });
});

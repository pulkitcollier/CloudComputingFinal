import * as AWS from "aws-sdk";
import * as Lambda from "aws-lambda";
import * as Request from 'request-promise';

import { DbConnection } from "./db/dbconnection";

export async function handler(event: any, context: Lambda.Context, callback: Lambda.Callback): Promise<void> {
    let conn = new DbConnection();

    try {
        let accRes = await conn.query('SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM (SELECT deviceid, T, X, Y, Z, abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff, abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff, abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff FROM acc)a GROUP BY a.deviceid , a.T;', []);

        let d14 = new Date();
        d14.setDate(d14.getDate() - 14);
        let d7 = new Date();
        d7.setDate(d7.getDate() - 7);

        let lateTweet = await conn.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d14.toUTCString(), d7.toUTCString()]);
        let newTweet = await conn.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d7.toUTCString(), new Date().toUTCString()]);



        console.log(newTweet);
        console.log(lateTweet[0].favoritesCount);
        console.log(lateTweet[0].followerCount);
        console.log(lateTweet[0].friendsCount);
        console.log(lateTweet[0].averaged_scores);
        console.log(lateTweet[0].activity_count);
        console.log(lateTweet[0].statusesCount);

        //http://35.184.204.97:8081/getTstats?favoritesCount=19607&followerCount=1243&friendsCount=657&averaged_scores=0.999&activity_count=1&statusesCount=14259
                callback(null, 'OK');

    } catch (ex) {
        callback(new Error(ex), null);
    }
}

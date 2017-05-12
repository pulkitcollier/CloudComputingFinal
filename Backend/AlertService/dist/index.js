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
const dbconnection_1 = require("./db/dbconnection");
function handler(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let conn = new dbconnection_1.DbConnection();
        try {
            let accRes = yield conn.query('SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM (SELECT deviceid, T, X, Y, Z, abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff, abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff, abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff FROM acc)a GROUP BY a.deviceid , a.T;', []);
            let d14 = new Date();
            d14.setDate(d14.getDate() - 14);
            let d7 = new Date();
            d7.setDate(d7.getDate() - 7);
            let lateTweet = yield conn.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d14.toUTCString(), d7.toUTCString()]);
            let newTweet = yield conn.query('select  userid, avg(followercount) as followerCount, avg(favoritecount) as favoritesCount, avg(friendcount) as friendsCount, avg(statuscount) as statusesCount, count(*) as activity_count, avg(tweetscore) as averaged_scores from tweet where createtime BETWEEN $1 and $2 group by userid;', [d7.toUTCString(), new Date().toUTCString()]);
            console.log(newTweet);
            console.log(lateTweet[0].favoritesCount);
            console.log(lateTweet[0].followerCount);
            console.log(lateTweet[0].friendsCount);
            console.log(lateTweet[0].averaged_scores);
            console.log(lateTweet[0].activity_count);
            console.log(lateTweet[0].statusesCount);
            //http://35.184.204.97:8081/getTstats?favoritesCount=19607&followerCount=1243&friendsCount=657&averaged_scores=0.999&activity_count=1&statusesCount=14259
        }
        catch (ex) {
            callback(new Error(ex), null);
        }
    });
}
exports.handler = handler;

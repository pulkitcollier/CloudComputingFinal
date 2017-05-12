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
const analyzer_1 = require("./sentiment/analyzer");
const crawler_1 = require("./twitter/crawler");
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
const lonMin = -74.036179;
const lonMax = -73.897476;
const latMin = 40.695737;
const latMax = 40.883929;
function handler(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let conn = new dbconnection_1.DbConnection();
        let analyzer = new analyzer_1.SentimentAnalyzer();
        let crawler = new crawler_1.TweetCrawler();
        try {
            if (event.operation && event.operation === 'tweets') {
                let userid = event.userid;
                let friends = yield conn.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
                let tweets = yield Promise.all(friends.map((f) => __awaiter(this, void 0, void 0, function* () {
                    let t = (yield conn.query('SELECT tweetcontent, tweetscore, longitude, latitude FROM tweet WHERE id = (SELECT MAX(id) FROM tweet WHERE userid = $1)', [f.friendid]))[0];
                    let name = (yield conn.query('SELECT username FROM users WHERE userid = $1', [f.friendid]))[0];
                    console.log(t);
                    console.log(name);
                    return {
                        username: name.username,
                        tweet: t.tweetcontent,
                        score: t.tweetscore,
                        lon: t.longitude,
                        lat: t.latitude
                    };
                })));
                callback(null, tweets);
            }
            else {
                let res = yield conn.query('SELECT userid, tweethandle FROM users', []);
                res.forEach((r) => __awaiter(this, void 0, void 0, function* () {
                    let q = yield conn.query('SELECT MAX(id) as mid FROM tweet WHERE userid = $1', [r.userid]);
                    let since = q[0].mid == null ? 1 : q[0].mid;
                    console.log(since);
                    let tweets = ((yield crawler.craw(r.tweethandle, since)).data);
                    console.log(tweets.length);
                    let objs = yield Promise.all(tweets.map((t) => __awaiter(this, void 0, void 0, function* () {
                        return [
                            r.userid,
                            t.user.followers_count,
                            t.favorite_count,
                            t.user.friends_count,
                            t.user.statuses_count,
                            yield analyzer.analyze(t.text),
                            t.text,
                            t.created_at,
                            getRandom(lonMin, lonMax),
                            getRandom(latMin, latMax),
                            t.id
                        ];
                    })));
                    yield conn.query(format('INSERT INTO tweet (userid, followercount, favoritecount, friendcount, statuscount, tweetscore, tweetcontent, createtime, longitude, latitude, id) VALUES %L', objs), []);
                }));
            }
        }
        catch (ex) {
            callback(new Error(ex), null);
        }
    });
}
exports.handler = handler;

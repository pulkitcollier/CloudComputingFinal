import * as AWS from "aws-sdk";
import * as Lambda from "aws-lambda";
import * as Request from 'request-promise';
import * as Twit from 'twit';
import * as format from 'pg-format';

import { DbConnection } from './db/dbconnection';
import { SentimentAnalyzer } from './sentiment/analyzer';
import { TweetCrawler } from './twitter/crawler';

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

const lonMin = -74.036179;
const lonMax = -73.897476;
const latMin = 40.695737;
const latMax = 40.883929;

export async function handler(event: any, context: Lambda.Context, callback: Lambda.Callback): Promise<void> {
    let conn = new DbConnection();
    let analyzer = new SentimentAnalyzer();
    let crawler = new TweetCrawler();

    try {
        if (event.operation && event.operation === 'tweets') {
            let userid = event.userid;
            let friends = await conn.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
            let tweets = await Promise.all(friends.map(async f => {
                let t = (await conn.query('SELECT tweetcontent, tweetscore, longitude, latitude FROM tweet WHERE id = (SELECT MAX(id) FROM tweet WHERE userid = $1)', [f.friendid]))[0];
                let name = (await conn.query('SELECT username FROM users WHERE userid = $1', [f.friendid]))[0];

                console.log(t);
                console.log(name);
                return {
                    username: name.username,
                    tweet: t.tweetcontent,
                    score: t.tweetscore,
                    lon: t.longitude,
                    lat: t.latitude
                };
            }));

            callback(null, tweets);
        } else {
            let res = await conn.query('SELECT userid, tweethandle FROM users', []);

            res.forEach(async r => {
                let q = await conn.query('SELECT MAX(id) as mid FROM tweet WHERE userid = $1', [r.userid]);
                let since = q[0].mid == null ? 1 : q[0].mid;
                console.log(since);

                let tweets = <any>((await crawler.craw(r.tweethandle, since)).data);
                console.log(tweets.length);

                let objs = await Promise.all(tweets.map(async t => {
                    return [
                        r.userid,
                        t.user.followers_count,
                        t.favorite_count,
                        t.user.friends_count,
                        t.user.statuses_count,
                        await analyzer.analyze(t.text),
                        t.text,
                        t.created_at,
                        getRandom(lonMin, lonMax),
                        getRandom(latMin, latMax),
                        t.id
                    ];
                }));

                await conn.query(format('INSERT INTO tweet (userid, followercount, favoritecount, friendcount, statuscount, tweetscore, tweetcontent, createtime, longitude, latitude, id) VALUES %L', objs), []);
            });
            callback(null, 'OK');
        }
    } catch (ex) {
        callback(new Error(ex), null);
    }
}

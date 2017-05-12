import { Router } from 'express';
import { DbConnection } from "../db/dbconnection";
import * as format from 'pg-format';

import { TweetCrawler } from '../twitter/crawler';
import { SentimentAnalyzer } from '../sentiment/analyzer';

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

const lonMin = -74.036179;
const lonMax = -73.897476;
const latMin = 40.695737;
const latMax = 40.883929;

export const tweetRouter = Router();

tweetRouter.get('/work', async (req, res) => {
    let crawler = new TweetCrawler();
    let analyzer = new SentimentAnalyzer();

    let r = await DbConnection.query('SELECT userid, tweethandle FROM users', []);

    r.forEach(async r => {
        let q = await DbConnection.query('SELECT MAX(id) as mid FROM tweet WHERE userid = $1', [r.userid]);
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

        await DbConnection.query(format('INSERT INTO tweet (userid, followercount, favoritecount, friendcount, statuscount, tweetscore, tweetcontent, createtime, longitude, latitude, id) VALUES %L', objs), []);
    });
    res.send({ result: 'OK' });
});

tweetRouter.get('/:id', async (req, res) => {
    let userid = req.param('id');
    let friends = await DbConnection.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
    let tweets = await Promise.all(friends.map(async f => {
        let t = (await DbConnection.query('SELECT tweetcontent, tweetscore, longitude, latitude FROM tweet WHERE id = (SELECT MAX(id) FROM tweet WHERE userid = $1)', [f.friendid]))[0];
        let name = (await DbConnection.query('SELECT username FROM users WHERE userid = $1', [f.friendid]))[0];

        return {
            username: name.username,
            tweet: t.tweetcontent,
            score: t.tweetscore,
            lon: t.longitude,
            lat: t.latitude
        };
    }));

    res.send({ tweets: tweets });
});

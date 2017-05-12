import { Router } from 'express';
import { DbConnection } from "../db/dbconnection";
import * as Bcrypt from 'bcryptjs';
import * as AWS from 'aws-sdk';
import { awsConfig } from "../config";

export const userRouter = Router();

userRouter.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let twitter = req.body.twitter;
    let email = req.body.email;
    let phonenumber = req.body.phonenumber;

    await DbConnection.query('INSERT INTO users (username, password, tweethandle, registertime, email, phonenumber, useemail, usesms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [username, Bcrypt.hashSync(password), twitter, new Date().toUTCString(), email, phonenumber, false, false]);
    res.send({ result: 'OK' });
});

userRouter.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let r = await DbConnection.query('SELECT userid, password FROM users WHERE username = $1', [username]);

    if (r[0] && Bcrypt.compareSync(password, r[0].password)) {
        res.send({ userid: r[0].userid });
    } else {
        res.send('Username of Password Error.');
    }
});

userRouter.get('/:id/friends', async (req, res) => {
    let userid = req.param('id');
    let r = await DbConnection.query('SELECT friendid FROM friendship WHERE userid = $1', [userid]);
    let friends = await Promise.all(r.map(async f => {
        let username = (await DbConnection.query('SELECT username FROM users WHERE userid = $1', [f.friendid]))[0].username;
        return {
            userid: f.friendid,
            username: username
        };
    }));
    res.send({ friends: friends });
});

userRouter.post('/:id/friends', async (req, res) => {
    let userid = req.param('id');
    let friendname = req.body.friendname;

    let friendid = (await DbConnection.query('SELECT userid FROM users WHERE username = $1', [friendname]))[0].userid;
    await DbConnection.query('INSERT INTO friendship (userid, friendid) VALUES ($1, $2)', [userid, friendid]);

    res.send({ result: 'OK' });
});

userRouter.delete('/:id/friends', async (req, res) => {
    let userid = req.param('id');
    let friendname = req.body.friendname;

    let friendid = (await DbConnection.query('SELECT userid FROM users WHERE username = $1', [friendname]))[0].userid;
    await DbConnection.query('DELETE FROM friendship WHERE userid = $1 AND friendid = $2', [userid, friendid]);

    res.send({ result: 'OK' });
});

userRouter.get('/:id/settings', async (req, res) => {
    let userid = req.param('id');
    let r = await DbConnection.query('SELECT useemail, usesms FROM users WHERE userid = $1', [userid]);
    res.send(r[0]);
});

userRouter.post('/:id/settings', async (req, res) => {
    let userid = req.param('id');
    let useemail = req.body.useemail;
    let usesms = req.body.usesms;

    let r = await DbConnection.query('SELECT email, phonenumber FROM users WHERE userid = $1', [userid]);
    await DbConnection.query('UPDATE users SET useemail = $1, usesms = $2 WHERE userid = $3', [useemail, usesms, userid]);

    let sns: any = new AWS.SNS(awsConfig);
    if (useemail) {
        sns.subscribe({
            Protocol: 'email',
            TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertEmail',
            Endpoint: r[0].email
        }, async (e, d) => {
            if (e) {
                res.send(e);
            } else {
                let arn = d.SubscriptionArn;
                await DbConnection.query('UPDATE users SET emailarn = $1 WHERE userid = $2', [arn, userid]);
            }
        });
    } else {
        let arn = (await DbConnection.query('SELECT emailarn FROM users WHERE userid = $1', [userid]))[0].emailarn;
        sns.unsubscribe({
            SubscriptionArn: arn
        });
    }

    if (usesms) {
        sns.subscribe({
            Protocol: 'sms',
            TopicArn: 'arn:aws:sns:us-east-1:472999334680:AlertSMS',
            Endpoint: r[0].phonenumber
        }, async (e, d) => {
            if (e) {
                res.send(e);
            } else {
                let arn = d.SubscriptionArn;
                await DbConnection.query('UPDATE users SET smsarn = $1 WHERE userid = $2', [arn, userid]);
            }
        });
    } else {
        let arn = (await DbConnection.query('SELECT smsarn FROM users WHERE userid = $1', [userid]))[0].smsarn;
        sns.unsubscribe({
            SubscriptionArn: arn
        });
    }
    res.send({ result: 'OK' });
});

userRouter.get('/:id/status', async (req, res) => {
    let userid = req.param('id');

    let week = new Date();
    week.setDate(week.getDate() - 7);
    let month = new Date();
    month.setDate(month.getDate() - 30);

    // FIXME: select actual people count
    let weekgood = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore > 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let weekneutral = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore = 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let weekbad = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore < 0 AND createtime > $2', [userid, week.toUTCString()]))[0].count;
    let monthgood = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore > 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;
    let monthneutral = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore = 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;
    let monthbad = (await DbConnection.query('SELECT COUNT(*) FROM tweet WHERE userid = $1 AND tweetscore < 0 AND createtime > $2', [userid, month.toUTCString()]))[0].count;

    res.send({
        weekgood: weekgood,
        weekneutral: weekneutral,
        weekbad: weekbad,
        monthgood: monthgood,
        monthneutral: monthneutral,
        monthbad: monthbad
    });
});

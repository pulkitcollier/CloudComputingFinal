import * as e from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { normalizePort, processHeader } from './helper';

import { indexRouter } from './route/index.route';
import { userRouter } from "./route/user.route";
import { tweetRouter } from "./route/tweet.route";
import { sensorRouter } from "./route/sensor.route";
import { alertRouter } from "./route/alert.route";

const port = normalizePort(process.env.PORT || 3000);

const app: e.Application = e();

// static settings
{
    app.use(processHeader());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(e.static(join(__dirname, 'www')));
    app.use((req, res, next) => {
        console.log(req.path);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}

// routes settings
{
    app.use('/', indexRouter);
    app.use('/users', userRouter);
    app.use('/tweets', tweetRouter);
    app.use('/sensors', sensorRouter);
    app.use('/alerts', alertRouter);
}

// error handling
{
    app.use((req, res, next) => {
        var err = new Error('404 - Not Found');
        err['status'] = 404;
        next(err);
    });
    app.use((error, req, res, next) => {
        res.status(error['status'] || 500);
        res.send({
            message: error.message,
            error
        });
    });
}

// processing logic srartup
{
}

app.listen(port, () => {
    console.log(`App started on port: ${port}...`);
});

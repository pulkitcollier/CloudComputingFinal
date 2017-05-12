"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e = require("express");
const bodyParser = require("body-parser");
const path_1 = require("path");
const helper_1 = require("./helper");
const index_route_1 = require("./route/index.route");
const user_route_1 = require("./route/user.route");
const tweet_route_1 = require("./route/tweet.route");
const sensor_route_1 = require("./route/sensor.route");
const alert_route_1 = require("./route/alert.route");
const port = helper_1.normalizePort(process.env.PORT || 3000);
const app = e();
// static settings
{
    app.use(helper_1.processHeader());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(e.static(path_1.join(__dirname, 'www')));
    app.use((req, res, next) => {
        console.log(req.path);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
}
// routes settings
{
    app.use('/', index_route_1.indexRouter);
    app.use('/users', user_route_1.userRouter);
    app.use('/tweets', tweet_route_1.tweetRouter);
    app.use('/sensors', sensor_route_1.sensorRouter);
    app.use('/alerts', alert_route_1.alertRouter);
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
//# sourceMappingURL=index.js.map
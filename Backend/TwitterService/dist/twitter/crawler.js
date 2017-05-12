"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Twit = require("twit");
const twitConfig = {
    consumer_key: 'HJJanxUBXwvG8cRqhCbrqXie0',
    consumer_secret: 'uZDVdSbNjwDf7rkCxX8vWPeft9Z3ZcKqoMFiOgQAt2NCUtBeTl',
    access_token: '834226946137587712-tSfyAtNhcQfALdDh5ql0o8lSW8jnJ1e',
    access_token_secret: 'x2l5xoDDnQuhUBdo3698362gFWYpaTXd9F6rpffDsDJSa'
};
class TweetCrawler {
    constructor() {
        this.twit = new Twit(twitConfig);
    }
    craw(screenName, sinceId) {
        return this.twit.get('statuses/user_timeline', { screen_name: screenName, since_id: sinceId });
    }
    get(resource, query) {
        return this.twit.get(resource, query);
    }
}
exports.TweetCrawler = TweetCrawler;

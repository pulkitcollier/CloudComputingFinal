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
const Twit = require("twit");
const location_1 = require("./location");
const data_1 = require("./data");
const csvwriter_1 = require("../csv/csvwriter");
const sentiment_1 = require("../watson/sentiment");
class TwitterStreamRetriever {
    constructor(twitConfig, watsonConfig) {
        this.count = 1;
        this.twit = new Twit(twitConfig);
        this.writer = new csvwriter_1.CSVWriter(data_1.Data.Fields);
        this.analyzer = new sentiment_1.SentimentAnalyzer(watsonConfig);
    }
    bootstrap() {
        let stream = this.twit.stream('statuses/filter', { locations: location_1.location.Manhattan });
        stream.on('tweet', (tweet) => __awaiter(this, void 0, void 0, function* () {
            try {
                let d = new data_1.Data();
                d.Id = tweet.id;
                d.Content = tweet.text;
                d.User = tweet.user.name;
                d.Timestamp = Date.now();
                d.Score = yield this.analyzer.analyze(d.Content);
                this.writer.write(d.toArray());
                if (this.count % 100 === 0)
                    console.log(`Recorded tweet: ${this.count++}`);
            }
            catch (err) {
                console.log(`Cannot score ${tweet.text}`);
            }
        }));
    }
}
exports.TwitterStreamRetriever = TwitterStreamRetriever;
//# sourceMappingURL=twitter.js.map
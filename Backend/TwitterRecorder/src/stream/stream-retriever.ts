import * as Twit from 'twit';
import {location} from './location';
import {Data} from './data';
import {CSVWriter} from "../csv/csvwriter";
import {SentimentAnalyzer} from '../watson/sentiment-analyzer';

export class TwitterStreamRetriever {
    private readonly twit: Twit;
    private readonly writer: CSVWriter;
    private readonly analyzer: SentimentAnalyzer;
    private currConfigNum: number = -1;

    constructor(twitConfig: Twit.Options, watsonConfig: any[]) {
        this.twit = new Twit(twitConfig);
        this.writer = new CSVWriter(Data.Fields);
        this.analyzer = new SentimentAnalyzer(watsonConfig);
    }

    bootstrap(): void {
        let stream: NodeJS.ReadableStream = this.twit.stream('statuses/filter', <Twit.Params>{locations: location.Manhattan});
        stream.on('tweet', async(tweet) => {
            let d: Data = new Data();
            d.UserId = tweet.user.id;
            d.UserName = tweet.user.name;
            d.FollowerCount = tweet.user.followers_count;
            d.FriendCount = tweet.user.friends_count;

            d.Content = tweet.text;
            if (tweet.coordinates && tweet.coordinates.coordinates) {
                d.Longitude = tweet.coordinates.coordinates[0];
                d.Latitude = tweet.coordinates.coordinates[1];
            } else if (tweet.place && tweet.place.bounding_box && tweet.place.bounding_box.coordinates) {
                d.Longitude = tweet.place.bounding_box.coordinates[0][0][0];
                d.Latitude = tweet.place.bounding_box.coordinates[0][0][1];
            }
            d.Timestamp = Date.now();
            d.FavoriteCount = tweet.favorite_count;
            d.RetweetCount = tweet.retweet_count;
            d.Truncated = tweet.truncated ? 1 : 0;
            d.ReplyTo = tweet.in_reply_to_user_id ? tweet.in_reply_to_user_id : 'NULL';

            try {
                d.Score = await this.analyzer.analyze(d.Content);
            } catch (err) {
                d.Score = 'NULL';
                console.log(`Cannot score (${err}) ${tweet.text}`);
            }
            this.writer.write(d.toArray());
        });
    }
}

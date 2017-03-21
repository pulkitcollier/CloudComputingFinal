import * as Twit from 'twit';
import { location } from './location';
import { Data } from './data';
import { CSVWriter } from "../csv/csvwriter";
import { SentimentAnalyzer } from '../watson/sentiment';

export class TwitterStreamRetriever {
    private readonly twit: Twit;
    private readonly writer: CSVWriter;
    private readonly analyzer: SentimentAnalyzer;
    private count: number = 1;

    constructor(twitConfig: Twit.Options, watsonConfig: any) {
        this.twit = new Twit(twitConfig);
        this.writer = new CSVWriter(Data.Fields);
        this.analyzer = new SentimentAnalyzer(watsonConfig);
    }

    bootstrap(): void {
        let stream: NodeJS.ReadableStream = this.twit.stream('statuses/filter', <Twit.Params>{ locations: location.Manhattan });
        stream.on('tweet', async (tweet) => {
            try {
                let d: Data = new Data();
                d.Id = tweet.id;
                d.Content = tweet.text;
                d.User = tweet.user.name;
                d.Timestamp = Date.now();
                d.Score = await this.analyzer.analyze(d.Content);

                this.writer.write(d.toArray());
                if (this.count % 100 === 0) console.log(`Recorded tweet: ${this.count++}`);
            } catch (err) {
                console.log(`Cannot score ${tweet.text}`);
            }
        });
    }
}

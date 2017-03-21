import * as Twit from 'twit';
import { location } from './location';
import { Data } from './data';
import { CSVWriter } from "../csv/csvwriter";
import { SentimentAnalyzer } from '../watson/sentiment';

export class TwitterStreamRetriever {
    private readonly twit: Twit;
    private readonly writer: CSVWriter;
    private analyzer: SentimentAnalyzer;
    private readonly watsonConfig: any[];
    private currConfigNum: number = 0;

    constructor(twitConfig: Twit.Options, watsonConfig: any) {
        this.twit = new Twit(twitConfig);
        this.writer = new CSVWriter(Data.Fields);
        this.watsonConfig = watsonConfig;

        this.switchConfig();
    }

    private switchConfig(): void {
        this.currConfigNum = this.currConfigNum < 4 ? this.currConfigNum + 1 : 0;
        this.analyzer = new SentimentAnalyzer(this.watsonConfig[this.currConfigNum]);
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
            } catch (err) {
                console.log(`Cannot score ${tweet.text}`);
            }
        });
    }
}

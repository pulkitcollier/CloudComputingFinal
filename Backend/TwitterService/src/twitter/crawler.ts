import * as Twit from 'twit';

export class TweetCrawler {

    private twit: Twit = new Twit(twitConfig);

    craw(screenName: string, sinceId: string): Promise<Twit.PromiseResponse> {
        return this.twit.get('statuses/user_timeline', { screen_name: screenName, since_id: sinceId });
    }

    get(resource: string, query: Twit.Params): Promise<Twit.PromiseResponse> {
        return this.twit.get(resource, query);
    }

}

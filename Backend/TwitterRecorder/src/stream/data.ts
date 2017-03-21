export class Data {
    static Fields: string[] = ['UserId', 'UserName', 'FollowerCount', 'FriendCount',
        'Content', 'Latitude', 'Longitude', 'Timestamp', 'FavoriteCount', 'RetweetCount', 'Truncated', 'ReplyTo', 'Score'];

    UserId: number;
    UserName: string;
    FollowerCount: number;
    FriendCount: number;

    Content: string;
    Latitude: number;
    Longitude: number;
    Timestamp: number;
    FavoriteCount: number;
    RetweetCount: number;
    Truncated: number;
    ReplyTo: number;

    Score: number | string;

    toArray(): any[] {
        return [this.UserId, this.UserName, this.FollowerCount, this.FriendCount,
            this.Content, this.Latitude, this.Longitude, this.Timestamp, this.FavoriteCount, this.RetweetCount, this.Truncated, this.ReplyTo, this.Score];
    }
}

export class Data {
    static Fields: string[] = ['UserId', 'UserName', 'FollowerCount', 'FriendCount',
        'Content', 'Location', 'Timestamp', 'FavoriteCount', 'RetweetCount', 'Truncated', 'IsReply', 'Score'];

    UserId: number;
    UserName: string;
    FollowerCount: number;
    FriendCount: number;

    Content: string;
    Location: { Latitude: number, Longitude: number };
    Timestamp: number;
    FavoriteCount: number;
    RetweetCount: number;
    Truncated: boolean;
    ReplyTo?: number;

    Score?: number;

    toArray(): any[] {
        return [this.UserId, this.UserName, this.FollowerCount, this.FriendCount,
        this.Content, this.Location, this.Timestamp, this.FavoriteCount, this.RetweetCount, this.Truncated, this.ReplyTo, this.Score];
    }
}
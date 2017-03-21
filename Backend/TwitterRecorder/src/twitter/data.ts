export class Data {
    static Fields: string[] = ['Id', 'Content', 'User', 'Timestamp', 'Score'];

    Id: number;
    Content: string;
    User: string;
    Timestamp: number;
    Score: number;

    toArray(): any[] {
        return [this.Id, this.Content, this.User, this.Timestamp, this.Score];
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Data {
    toArray() {
        return [this.Id, this.Content, this.User, this.Timestamp, this.Score];
    }
}
Data.Fields = ['Id', 'Content', 'User', 'Timestamp', 'Score'];
exports.Data = Data;
//# sourceMappingURL=data.js.map
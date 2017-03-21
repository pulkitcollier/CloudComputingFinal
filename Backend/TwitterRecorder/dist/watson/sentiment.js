"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watson_developer_cloud_1 = require("watson-developer-cloud");
class SentimentAnalyzer {
    constructor(config) {
        this.analyzer = new watson_developer_cloud_1.NaturalLanguageUnderstandingV1(config);
    }
    analyze(text) {
        let param = {
            text: text,
            features: {
                sentiment: {
                    document: true
                }
            }
        };
        return new Promise((resolve, reject) => {
            this.analyzer.analyze(param, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.sentiment.document.score);
            });
        });
    }
}
exports.SentimentAnalyzer = SentimentAnalyzer;
//# sourceMappingURL=sentiment.js.map
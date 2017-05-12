"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watson_developer_cloud_1 = require("watson-developer-cloud");
const config_1 = require("../config");
class SentimentAnalyzer {
    constructor() {
        this.config = config_1.watsonConfig;
        this.currConfigNum = 0;
        this.switchConfig();
    }
    switchConfig() {
        this.analyzer = new watson_developer_cloud_1.NaturalLanguageUnderstandingV1(this.config[this.currConfigNum]);
        console.log(`Switching to key: ${this.currConfigNum}.`);
        this.currConfigNum = this.currConfigNum < this.config.length - 1 ? this.currConfigNum + 1 : 0;
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
                if (err) {
                    if (err.message === 'limit exceeded for free plan') {
                        this.switchConfig();
                    }
                    reject(err);
                }
                else
                    resolve(res.sentiment.document.score);
            });
        });
    }
}
exports.SentimentAnalyzer = SentimentAnalyzer;

import { NaturalLanguageUnderstandingV1 } from 'watson-developer-cloud';

export class SentimentAnalyzer {
    private readonly analyzer: NaturalLanguageUnderstandingV1;

    constructor(config: any) {
        this.analyzer = new NaturalLanguageUnderstandingV1(config);
    }

    analyze(text: string): Promise<number> {
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
                if (err) reject(err);
                else resolve(res.sentiment.document.score);
            });
        });
    }
}
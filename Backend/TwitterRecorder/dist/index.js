"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitter_1 = require("./twitter/twitter");
const config_1 = require("./config");
new twitter_1.TwitterStreamRetriever(config_1.twitConfig, config_1.watsonConfig).bootstrap();
//# sourceMappingURL=index.js.map
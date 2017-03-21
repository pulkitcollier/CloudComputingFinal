import { TwitterStreamRetriever } from './twitter/twitter';
import { twitConfig, watsonConfig } from './config';

new TwitterStreamRetriever(twitConfig, watsonConfig).bootstrap();
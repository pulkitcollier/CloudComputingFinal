import { TwitterStreamRetriever } from './stream/stream-retriever';
import { twitConfig, watsonConfig } from './config';

new TwitterStreamRetriever(twitConfig, watsonConfig).bootstrap();
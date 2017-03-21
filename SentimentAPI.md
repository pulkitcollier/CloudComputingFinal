# IBM Natural Language Understanding API

[API Reference](https://www.ibm.com/watson/developercloud/natural-language-understanding/api/v1/#post-analyze)

### Credentials
key1
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "1cf24c73-d509-4cef-b381-e68021d54064",
  "password": "ZRjLQk2JGzQQ"
}
```
key2-plan:try1
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "032f97ea-4ede-4b08-af60-35e2108cc187",
  "password": "sDvgBDdRB1nS"
}
```
key3-plan:try2
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "a6439d46-0dc6-4c04-9e9d-d246abbab4ff",
  "password": "7EkoBVTHL1lJ"
}
```
key4-plan:try3
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "fb0d03af-cea5-438c-8c95-7857111a021a",
  "password": "sUMEuRhRPeoK"
}
```


### SDK
```bash
npm install watson-developer-cloud
```

### Authentication
```javascript
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '{username}',
  'password': '{password}',
  'version_date': '2017-02-27'
});
```

### Request
```javascript
var parameters = {
  'text': tweet.content, 
  'features': {
    'sentiment': {
      'document': true
    }
  }
}

natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});
```

* Reponse
```json
{
 "sentiment": {
  "document": {
   "score": -0.478408,
   "label": "negative"
  }
 }
}
```

### Tweet fields
[Twitter API Overview](https://dev.twitter.com/overview/api/tweets)

- Users: 
1. id
2. followers_count
3. friends_count
4. name

- Tweet:
0. text #actual content 
1. coordinates # for geo info
2. created_at #time
3. favorite_count 
4. retweet_count
5. truncated #boolean: indicates whether the value of the text parameter was truncated, for example, as a result of a retweet exceeding the 140 character Tweet length. Truncated text will end in ellipsis, like this ...
6. possibly_sensitive #boolean: Nullable This field only surfaces when a Tweet contains a link. 
7. user.id #who posted this tweet
8. in_reply_to_user_id #nullable if it is not a reply

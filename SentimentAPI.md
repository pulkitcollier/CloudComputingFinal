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
key2
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "e986a3c6-23b0-42f7-a472-5d11a1252096",
  "password": "gqumT5KzcaXe"
}
```
key3
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "63ea14dc-7f3a-490c-85cf-340cfb93961d",
  "password": "mrRj8bK40pZV"
}
```
key4
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "b4e343ad-fb04-4a70-9c26-3aea94abd3be",
  "password": "a6nQt2gTQkO6"
}
```
key5
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "f29cc04d-f319-4f0e-b76a-2de788c043f9",
  "password": “NrBabQg87uPy”

}
```
key6
```json
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "893cd3a5-0187-41ad-9dae-67100ab10204",
  "password": "MpGnVsNhzb4X"
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

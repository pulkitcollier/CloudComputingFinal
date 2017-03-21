# IBM Natural Language Understanding

[API Reference](https://www.ibm.com/watson/developercloud/natural-language-understanding/api/v1/#post-analyze)

### credentials
```
{
  "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
  "username": "1cf24c73-d509-4cef-b381-e68021d54064",
  "password": "ZRjLQk2JGzQQ"
}
```

### npm
```
npm install watson-developer-cloud
```

### authentication
```
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '{username}',
  'password': '{password}',
  'version_date': '2017-02-27'
});
```

### request
```
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '{username}',
  'password': '{password}',
  'version_date': '2017-02-27'
});

var parameters = {
  'text': tweet.content, 
  'features': {
    'sentiment': {
      'document':true
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
reponse
```
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

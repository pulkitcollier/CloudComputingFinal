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

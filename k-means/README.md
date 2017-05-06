# Profiling user behavior using K-means

### data source
719 user and their aggreagted weekly behavior in Manhattan region   

### final result  
pick `n_cluster = 2`, based on the `silhouette_score`   

### silhouette plot:
activity count vs. averaged sentiment score  
![alt text](https://github.com/MZhoume/E6998S5/blob/master/k-means/plot.png)

### cluster center (values are scaled)  

cluster 0  
followerCount -0.0819706488981  
favoritesCount -0.104241812162  
friendsCount -0.229337873988  
statusesCount -0.184377636026  
activity_count -0.299912118789  
averaged_scores 0.0132953221303  

cluster 1  
followerCount 0.346841793297   
favoritesCount 0.441077599762  
friendsCount 0.970395630071  
statusesCount 0.780155711621  
activity_count 1.26901590399  
averaged_scores -0.0562563970413  

### cluster feature importance    
left most important, right most least important   
  
Cluster 0: averaged_scores; followerCount; favoritesCount; statusesCount; friendsCount; activity_count;  
Cluster 1: activity_count; friendsCount; statusesCount; favoritesCount; followerCount; averaged_scores;  

### cluster interpretation

cluster interpretation
the second cluster (label 1) is the much smaller cluster, where there is higher follower, favarites count, activity_count, but the averaged_scores is much lower  

### threshold based on clusters

cluster 1 sentiment score mean: 0.08360699882213349  
cluster 1 sentiment score std: 0.29093559299695276  
cluster 0 sentiment score mean: 0.10865536663218373  
cluster 1 sentiment score std: 0.37495564769102363  
cluster 1 acitivty count mean: 11.97278911564626  
cluster 1 acitivty count std: 7.633690267430216   
cluster 0 acitivty count mean: 3.6607717041800645  
cluster 1 acitivty count std: 2.797923899514602    

### alert logic  
if sentiment score 1 std above mean, alert: user is happier;  
elif acitivty 1st lower and sentiment is 1 std lower, alert: user is sadier and low activity;      
elif sentiment is 1 std lower, alert: user is sadier;  

### data required to predict cluster label
features: followerCount, favoritesCount, friendsCount, statusesCount, activity_count, averaged_scores 
`averaged_scores` is the aggregated tweet sentiment scores per week / total number of tweets per week   

### running logic 
1. when each tweet flushes in, backend calls Natural Language Understanding API to get its sentiment score
2. backend keeps a counter of the weekly aggregated score (weekly_score += score) in the database or stores each tweet_id, its score and a time stamp nto the database , and calculate each user's aggregated sentiment score on a weekly basis. 
3. backend keeps a counter of number of tweets made by the user on a weekly basis, or simply keeps tweet_id and time_stamp in the database, and perform SQL count every week. 
4. each week, clf.predict([followerCount, favoritesCount, friendsCount, statusesCount, activity_count, averaged_scores]), and given cluster id, get the alert threshold for each user. 


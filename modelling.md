# Profiling user behavior using K-means

### final result  
pick `n_cluster = 2`, based on the `silhouette_score`   

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
the second cluster (1) is the small cluster, where there is higher follower, favarites count, activity_cout, but the averaged_scores is much lower  

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

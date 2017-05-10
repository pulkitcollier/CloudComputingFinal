# Modelling Description

## Table of Content
- [AWS RDS(Postgres)](#pg)
- [Tweet User Profiling](#tf)
- [Accelerometer Data Clustering](#ac) 

### <a name=pg></a> AWS RDS(Postgres）Endpoint
 
Endpoint: cc-apollo.cbnpvhclb9ix.us-east-1.rds.amazonaws.com:5432/apollo  

username: yh2901  
password: emilyhua  

main postgres quering:
1. generate acc model input
```
SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, 
          sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff 
FROM
(SELECT deviceid, T, X, Y, Z, 
       abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff,
       abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff,
       abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff
FROM acc)a
GROUP BY a.deviceid , a.T;
```
returns 
```
1	2017-05-08 17:05:00.0	1365.9446356864705882	1300.4917711764705882	1555.6344253941176471	23217.28597024	21966.626767	26374.7551293  
2	2017-05-08 17:05:00.0	6096.8248121570588235	5348.0361829411764706	6619.1764253941176471	103642.24897024	90774.881767	112454.9691293  
```


### <a name=tf></a> Tweet User Profiling using K-means
### REST
http://35.184.204.97:8081/getTstats?favoritesCount=19607&followerCount=1243&friendsCount=657&averaged_scores=0.999&activity_count=1&statusesCount=14259

returns:
```
for cluster 0:
{"activity_count_std": 2.798, "cluster_number": 0, "sentiment_score_std": 0.375}  

for cluster 1:  
{"activity_count_std": 7.634, "cluster_number": 1, "sentiment_score_std": 0.291}
```
```
payload = {  
    "followerCount": 1243,  
"favoritesCount": 19607,  
"friendsCount": 657,  
"statusesCount": 14259,  
"activity_count": 1,  
"averaged_scores": 0.999,  
}  
post = requests.post(url, params=payload)  
#post = requests.post(url, data=json.dumps(payload))  
print(post.text)   
```
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
cluster 1 acitivty count mean: 11.97278911564626  
cluster 1 acitivty count std: 7.633690267430216

cluster 0 sentiment score mean: 0.10865536663218373  
cluster 0 sentiment score std: 0.37495564769102363  
cluster 0 acitivty count mean: 3.6607717041800645  
cluster 0 acitivty count std: 2.797923899514602    

### alert logic  
if sentiment score is 1 std above mean, alert: user is happier;  
elif acitivty is 1 std lower and sentiment is 1 std lower, alert: user is sadier and low activity;      
elif sentiment is 1 std lower, alert: user is sadier;  

### data required to predict cluster label
features: followerCount, favoritesCount, friendsCount, statusesCount, activity_count, averaged_scores   
`averaged_scores` is the aggregated tweet sentiment scores per week / total number of tweets per week   

### running logic 
1. when each tweet flushes in, backend calls Natural Language Understanding API to get its sentiment score
2. backend (keeps a counter of the weekly aggregated score (weekly_score += score) in the database) or (stores each tweet_id, its score and a time stamp into the database , and use SQL to calculate each user's aggregated sentiment score on a weekly basis). 
3. backend (keeps a counter of number of tweets made by the user on a weekly basis), or (simply keeps tweet_id and time_stamp in the database, and perform SQL count every week). 
4. each week, clf.predict([followerCount, favoritesCount, friendsCount, statusesCount, activity_count, averaged_scores]), and given cluster id, get the alert threshold for each user.   

## <a name=ac></a> Accelerometer Data Clustering
### REST
http://35.184.204.97:8081/getAstats?X_avg=0.87&X_absdif=212750.185&Y_absdif=193742.799&Z_absdif=233020.013&Z_avg=4.791&Y_avg=2.875

returns:
```
for cluster 0 
{"Z_absdif_std": 112456.086, "cluster_number": 0, "X_avg_std": 1.387, "Z_avg_std": 2.166, "X_absdif_std": 103641.064, "Y_avg_std": 2.069, "Y_absdif_std": 90782.264} 

for cluster 1
{"Z_absdif_std": 26375.872, "cluster_number": 1, "X_avg_std": 2.123, "Z_avg_std": 3.229, "X_absdif_std": 23216.101, "Y_avg_std": 2.937, "Y_absdif_std": 21974.009}
```
```
payload = { # predict 0
    "X_avg": 0.870 ,
    "Y_avg":  2.875,
    "Z_avg": 4.791,
    "X_absdif": 212750.185,
    "Y_absdif":   193742.799,
    "Z_absdif":  233020.013,
}
```
### data source
[Accelerometer Biometric Competition](https://www.kaggle.com/c/accelerometer-biometric-competition/data)

### processed dataset description:
387 unique users's milisecond level X,Y,Z recordings. 
if zoomed out to second level, each user (device ID) has aggregated data for example:  
![alt text](https://github.com/MZhoume/E6998S5/blob/master/k-means/acc_s_plot.png) 

### features 
features: ['X_avg', 'Y_avg', 'Z_avg', 'X_absdif', 'Y_absdif', 'Z_absdif']  
where X_avg is averged X coordinates within a second interval     
      Y_avg is averged Y coordinates within a second interval     
      Z_avg is averged Z coordinates within a second interval      
      X_absdif is the accumulated absolute difference in X value within a second interval   
      Y_absdif is the accumulated absolute difference in Y value within a second interval   
      Z_absdif is the accumulated absolute difference in Z value within a second interval   
      
### metrics
pick `n_clusters = 2`, based on it having the highest silhouette score.      
10362 second level aggregated samples. 


### silhouette plot  
Z_absdif vs. Z_avg  
![alt text](https://github.com/MZhoume/E6998S5/blob/master/k-means/accelorometer_plot.png)  

### centroid center
cluster 0  (smaller class) 
X_avg 0.136169661507  
Y_avg -0.210280809267  
Z_avg -0.105182184924  
X_absdif 3.20219695185  
Y_absdif 3.20059614029  
Z_absdif 3.18194324775  

cluster 1
X_avg -0.00866534209588  
Y_avg 0.0133815060443 
Z_avg 0.00669341176789  
X_absdif -0.203776169663    
Y_absdif -0.203674299837    
Z_absdif -0.202487297584    

### feature importance rank (left most importance)
Cluster 0: X_absdif; Y_absdif; Z_absdif; X_avg; Z_avg; Y_avg;    
Cluster 1: Y_avg; Z_avg; X_avg; Z_absdif; Y_absdif; X_absdif;    

### cluster interpretation:
Cluster 0 is a cluster where large `Z_absdif`, `Y_absdif`,`X_absdif`  indicate large up-down movement (lift (picking up or dropping the device)), large tilt (lean back or forward), large twist(like turning a doorknob)    
  
Cluster 1's center indicates it is relative stable   
### std, mean based on clustering:
cluster 1 X_avg mean: 0.568  
cluster 1 X_avg std: 2.123  
cluster 0 X_avg mean: 0.870  
cluster 0 X_avg std: 1.387  


cluster 1 Y_avg mean: 3.522  
cluster 1 Y_avg std: 2.937  
cluster 0 Y_avg mean: 2.875  
cluster 0 Y_avg std: 2.069  


cluster 1 Z_avg mean: 5.146  
cluster 1 Z_avg std: 3.229  
cluster 0 Z_avg mean: 4.791  
cluster 0 Z_avg std: 2.166  


cluster 1 X_absdif mean: 18507.932  
cluster 1 X_absdif std: 23216.101  
cluster 0 X_absdif mean: 212750.185  
cluster 0 X_absdif std: 103641.064  


cluster 1 Y_absdif mean: 17586.737  
cluster 1 Y_absdif std: 21974.009  
cluster 0 Y_absdif mean: 193742.799  
cluster 0 Y_absdif std: 90782.264  

 
cluster 1 Z_absdif mean: 21612.124  
cluster 1 Z_absdif std: 26375.872  
cluster 0 Z_absdif mean: 233020.013  
cluster 0 Z_absdif std: 112456.086  





### alert logic:
if previously clustered as 1 but now predicted as 0: alert -> "user's phone encounters drastic movement";    
if stays within cluster 1 but the feature values are now 2 std away from the mean, alert -> "user's phone is likely encountering some unstable movement"   

### further improvement with more data:
create user biometric from accelerometer data 

### data processed with hive
hive ql: be aware of nanosecond linux timestamp will creak on Python Pandas
```
SELECT a.T_seclevel as T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, 
          sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff 
FROM
 (SELECT Device,from_unixtime(CAST(T/1000 as BIGINT), 'yyyy-MM-dd HH:MM:SS')  as T_seclevel, X, Y, Z, 
 	abs(LAG(X, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - X) as X_absdiff,
 	abs(LAG(Y, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Y) as Y_absdiff, 
 	abs(LAG(Z, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Z) as Z_absdiff 
  FROM acc where Device = 7)a 
GROUP BY a.Device , a.T_seclevel;
```
![alt text](https://github.com/MZhoume/E6998S5/blob/master/k-means/acc_hive.png)

CREATE TABLE IF NOT EXISTS tweet_table ( user_id int, follower_count int, favorite_count int,
friend_count int, status_count int, tweet_id int, tweet_score String, time_stamp String)
COMMENT "cloud computing class project"
ROW FORMAT DELIMITED
FIELDS TERMINATED BY "\t"
LINES TERMINATED BY "\n"
STORED AS TEXTFILE;


hive> select * from tweet_table;
OK
1	1243	19607	657	14259	1	0.9		2017-04-26 18:54:28
1	1243	19607	657	14259	2	0.7		2017-04-27 18:54:28
1	1243	19607	657	14259	3	0.8		2017-04-28 18:54:28
1	1243	19607	657	14259	3	0.6		2017-04-29 18:54:29
2	1243	19607	657	14259	1	-0.5	2017-04-26 18:54:28
2	1243	19607	657	14259	2	-0.4	2017-04-27 18:54:28
1	1243	19607	657	14259	3	-0.1	2017-04-28 18:54:28
1	1243	19607	657	14259	3	-0.3	2017-04-29 18:54:29
Time taken: 0.189 seconds, Fetched: 8 row(s)

INSERT INTO TABLE tweet_table
  VALUES ('follower_count', 1243), ('favorites_count', 19607), ('friend_count', 657), ('status_count', 14259), ('tweet_id', 1), ('tweet_score', 0.9), ('time_stamp', '2017-04-26 18:54:28');


  INSERT INTO TABLE tweet_table
  VALUES (1, 1243, 19607, 657, 14259, 1, 0.9, "2017-04-26 18:54:28")

  INSERT INTO TABLE tweet_table
  VALUES (1, 1243, 19607, 657, 14259, 2, 0.7, "2017-04-27 18:54:28"), (1243, 19607, 657, 14259, 3, 0.8, "2017-04-28 18:54:28")
 
 INSERT INTO TABLE tweet_table
 VALUES (2, 1243, 19607, 657, 14259, 1, -0.5, "2017-04-26 18:54:28"), (2, 1243, 19607, 657, 14259, 2, -0.4, "2017-04-27 18:54:28"), (1, 1243, 19607, 657, 14259, 3, -0.1, "2017-04-28 18:54:28"), (1, 1243, 19607, 657, 14259, 3, -0.3, "2017-04-29 18:54:29")
 
 INSERT INTO TABLE tweet_table
 VALUES (1, 1243, 19607, 657, 14259, 1, 0.9, "2017-04-26 18:54:28"), (1, 1243, 19607, 657, 14259, 2, 0.7, "2017-04-27 18:54:28"), (1, 1243, 19607, 657, 14259, 3, 0.8, "2017-04-28 18:54:28"), (1, 1243, 19607, 657, 14259, 3, 0.6, "2017-04-29 18:54:29")

unix_timestamp(time_stamp, 'yyyy-MM-dd')

select  user_id, count(*) as total_activity_count, avg(tweet_score) as avg_score from tweet_table 
where unix_timestamp(time_stamp, 'yyyy-MM-dd') BETWEEN unix_timestamp("2017-04-26", 'yyyy-MM-dd') and unix_timestamp("2017-04-27", 'yyyy-MM-dd') 
group by user_id;

Total MapReduce CPU Time Spent: 5 seconds 850 msec
OK
1	2	0.8
2	2	-0.45
Time taken: 86.201 seconds, Fetched: 2 row(s)

#############tweet table###############
drop table if exists tweet;
create table tweet(
	tweetid int primary key,
    userid int,
    followercount int,
    favoritecount int,
    friendcount int,
    statuscount int,
	tweetscore numeric,
	tweetcontent text,
	createtime timestamp
);

INSERT INTO tweet
(tweetid, userid, followercount, favoritecount, friendcount, statuscount, tweetscore, tweetcontent, createtime)
VALUES (1, 1, 1243, 19607, 657, 14259, 0.8, 'I love MOMA, what a wonderful place! Moden art rock!', '2017-05-08 10:00:06' ),
(2, 1, 1243, 19607, 657, 14260, 0.6, 'Nice weather; Spring is finally here #Central Park', '2017-05-09 11:10:54' )

INSERT INTO tweet
(tweetid, userid, followercount, favoritecount, friendcount, statuscount, tweetscore, tweetcontent, createtime)
VALUES 
(3, 2, 3, 50, 30, 29, -0.7, 'I hate the final week... always so stressful!', '2017-05-08 10:00:06' ),
(4, 2, 3, 50, 31, 30, -0.5, 'Why do we have an idot as the president?????', '2017-05-09 11:10:54' )


select  userid, 
        avg(followercount) as followerCount,
        avg(favoritecount) as favoritesCount,
        avg(friendcount) as friendsCount,
        avg(statuscount) as statusesCount,
        count(*) as activity_count, 
        avg(tweetscore) as averaged_scores
from tweet 
where createtime BETWEEN '2017-05-08' and '2017-05-09'
group by userid;

################ accelorometer ###############
drop table if exists acc;
create table acc(
	recordid int primary key,
    userid int,
    deviceid int,
    T timestamp, 
    X numeric,
    Y numeric,
	Z numeric
);
INSERT INTO acc
(recordid, userid, deviceid, T, X, Y, Z)
VALUES (1, 1, 1, '2017-05-08 17:05:00', 0.3405087,8.308413,4.1405845),
(2,1,1,'2017-05-08 17:05:00', 0.38136974,8.390134,4.2495475),
(3,1,1, '2017-05-08 17:05:00',0.27240697,8.471856,4.018002),
(4,1,1, '2017-05-08 17:05:00',0.14982383,8.430995,4.2904086),
(5,1,1, '2017-05-08 17:05:00',0.27240697,8.430995,4.481094),
(6,1,1, '2017-05-08 17:05:00',0.42223078,8.471856,4.7126393),
(7,1,1, '2017-05-08 17:05:00',0.38136974,8.390134,4.3993716),
(8,1,1, '2017-05-08 17:05:00', 0.313268,8.281172,4.3993716),
(9,1,1, '2017-05-08 17:05:00', 0.23154591,8.308413,4.671778),
(10,1,1,'2017-05-08 17:05:00', 0.38136974,8.390134,4.2495475),
(11,1,1, '2017-05-08 17:05:00',0.27240697,8.471856,4.018002),
(12,1,1, '2017-05-08 17:05:00',0.14982383,8.430995,4.2904086),
(13,1,1, '2017-05-08 17:05:00',0.27240697,8.430995,4.481094),
(14,1,1, '2017-05-08 17:05:00',0.42223078,8.471856,4.7126393),
(15,1,1, '2017-05-08 17:05:00',0.38136974,8.390134,4.3993716),
(16,1,1, '2017-05-08 17:05:00', 0.313268,8.281172,4.3993716),
(17,1,1, '2017-05-08 17:05:00', 23216.101,21974.009,26375.872)

INSERT INTO acc
(recordid, userid, deviceid, T, X, Y, Z)
VALUES (34, 1, 2, '2017-05-08 17:05:00', 0.3405087,8.308413,4.1405845),
(18,1,2,'2017-05-08 17:05:00', 0.38136974,8.390134,4.2495475),
(19,1,2, '2017-05-08 17:05:00',0.27240697,8.471856,4.018002),
(20,1,2, '2017-05-08 17:05:00',0.14982383,8.430995,4.2904086),
(21,1,2, '2017-05-08 17:05:00',0.27240697,8.430995,4.481094),
(22,1,2, '2017-05-08 17:05:00',0.42223078,8.471856,4.7126393),
(23,1,2, '2017-05-08 17:05:00',0.38136974,8.390134,4.3993716),
(24,1,2, '2017-05-08 17:05:00', 0.313268,8.281172,4.3993716),
(25,1,2, '2017-05-08 17:05:00', 0.23154591,8.308413,4.671778),
(26,1,2,'2017-05-08 17:05:00', 0.38136974,8.390134,4.2495475),
(27,1,2, '2017-05-08 17:05:00',0.27240697,8.471856,4.018002),
(28,1,2, '2017-05-08 17:05:00',0.14982383,8.430995,4.2904086),
(29,1,2, '2017-05-08 17:05:00',0.27240697,8.430995,4.481094),
(30,1,2, '2017-05-08 17:05:00',0.42223078,8.471856,4.7126393),
(31,1,2, '2017-05-08 17:05:00',0.38136974,8.390134,4.3993716),
(32,1,2, '2017-05-08 17:05:00', 0.313268,8.281172,4.3993716),
(33,1,2, '2017-05-08 17:05:00', 103641.064, 90782.264,112456.086)


SELECT deviceid, a.T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, 
          sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff 
FROM
(SELECT deviceid, T, X, Y, Z, 
       abs(X - lag(X) OVER (PARTITION BY  deviceid ORDER BY T)) as X_absdiff,
       abs(Y - lag(Y) OVER (PARTITION BY  deviceid ORDER BY T)) as Y_absdiff,
       abs(Z - lag(Z) OVER (PARTITION BY  deviceid ORDER BY T)) as Z_absdiff
FROM acc)a
GROUP BY a.deviceid , a.T;

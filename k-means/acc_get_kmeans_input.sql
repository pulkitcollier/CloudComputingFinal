hadoop fs -put acc_train.csv

CREATE TABLE IF NOT EXISTS acc ( T String, X String, Y String, Z String, Device String)
COMMENT "cloud computing class accelormeter"
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' STORED AS TEXTFILE
LOCATION '/user/yh1008/acc';

load data inpath '/user/yh1008/acc_train.csv' overwrite into table acc;

select  from_unixtime(CAST("1336645068311"/1000 as BIGINT), 'yyyy-MM-dd HH:MM:SS') from acc;
select unix_timestamp("1336645068311", 'YYYY-MM-DD HH:MM:SS.fffffffff') from acc;
SELECT FROM_UNIXTIME(CAST(T AS BIGINT)) FROM acc where Device = 45 and T=1343258848649;
> 2012-07-25 07:27:28

SELECT SECOND(FROM_UNIXTIME(CAST(T AS BIGINT))) FROM acc where Device = 45 and T=1343258848649;
> 28


unix_timestamp("4536-03-06 04:57:29")

# working: 
SELECT a.Device, a.T_seclevel as T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM (SELECT Device,from_unixtime(CAST(T/1000 as BIGINT), 'yyyy-MM-dd HH:MM:SS')  as T_seclevel, X, Y, Z, abs(LAG(X, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - X) as X_absdiff, abs(LAG(Y, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Y) as Y_absdiff, abs(LAG(Z, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Z) as Z_absdiff FROM acc)a GROUP BY a.Device , a.T_seclevel;

# better formatted for reading:
SELECT a.T_seclevel as T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, 
          sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff 
FROM
 (SELECT Device,from_unixtime(CAST(T/1000 as BIGINT), 'yyyy-MM-dd HH:MM:SS')  as T_seclevel, X, Y, Z, 
 	abs(LAG(X, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - X) as X_absdiff,
 	abs(LAG(Y, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Y) as Y_absdiff, 
 	abs(LAG(Z, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Z) as Z_absdiff 
  FROM acc where Device = 7)a 
GROUP BY a.Device , a.T_seclevel;

# trivial test
 create table acc_temp_7 as SELECT Device,from_unixtime(CAST(T/1000 as BIGINT), 'yyyy-MM-dd HH:MM:SS')  as T_seclevel, X, Y, Z, abs(LAG(X, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - X) as X_absdiff, abs(LAG(Y, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Y) as Y_absdiff, abs(LAG(Z, 1, 0) OVER (PARTITION BY  Device ORDER BY T) - Z) as Z_absdiff FROM acc where Device = 7

SELECT a.T_seclevel as T, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM acc_temp_7 as a GROUP BY a.Device and a.T_seclevel

SELECT  a.T_seclevel, avg(a.X) as X_avg, avg(a.Y) as Y_avg, avg(a.Z) as Z_avg, sum(a.X_absdiff) as X_absdiff, sum(a.Y_absdiff) as Y_absdiff, sum(a.Z_absdiff) as Z_absdiff FROM acc_temp_7 as a GROUP BY a.Device, a.T_seclevel

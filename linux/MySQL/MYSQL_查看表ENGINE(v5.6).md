MYSQL: 查看表ENGINE(v5.6)
2016年2月6日
11:39
 
## 查看mysql的表engine
## 去了解数据库，很重要的一点要知道表engine，才能针对性的去做配置
mysql> show global variables like '%engine%';
+---------------------------+--------+
| Variable_name             | Value  |
+---------------------------+--------+
| default_storage_engine    | InnoDB |
| enforce_storage_engine    |        |
| engine_condition_pushdown | ON     |
| storage_engine            | InnoDB |
+---------------------------+--------+
4 rows in set (0.00 sec)

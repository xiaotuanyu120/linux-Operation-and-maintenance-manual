NGINX: 配置cache server
2016年1月19日
14:48
 
0、完整配置
********************************************************
proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m 
                 use_temp_path=off;
 
server {
...
    location / {
        proxy_cache my_cache;
        proxy_cache_revalidate on;
        proxy_cache_min_uses 3;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_lock on;
 
        proxy_pass http://my_upstream;
    }
}
********************************************************
PS:use_temp_path=off总是报错invalid，不知道何解
 
1、基础的缓存配置
## 缓存只需要两个directive：proxy_cache_path和proxy_cache
proxy_cache_path负责指定缓存路径和配置缓存参数
proxy_cache负责使proxy_cache_path生效
 
## 示例配置
********************************************************
proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m 
                 use_temp_path=off;
 
server {
...
    location / {
        proxy_cache my_cache;
        proxy_pass http://my_upstream;
    }
}
********************************************************
## proxy_cache_path详解
/path/to/cache         用来缓存的路径
levels=1:2             用来指定一个2层目录结构来缓存，比默认的全部放在一层的缓存有效率
keys_zone=my_cache:10m 配置一个大小10m，名称为my_cache的key的内存储存空间
max_size=10g           配置缓存容量上限，超过容量上限时，会自动清除最低频的cache
inactive=60m           配置缓存未被hit的最长存活时间，默认10分钟
use_temp_path=off      跳过先用临时目录缓存，然后拷贝到缓存目录的过程
 
2、过期的也比没有好
************************************************************
location / {
    ...
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
}
************************************************************
## 指定在web服务器返回error timeout或各种5xx错误时，到缓存中返回过期的信息，而不是返回错误
 
3、其它有用的配置
************************************************************
location / {
        ......
        proxy_cache_revalidate on;
        proxy_cache_min_uses 3;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_lock on;
        ......
}
************************************************************
## 详解
proxy_cache_revalidate on;
若请求已被缓存，但过期，则对源nginx请求时附加上If-Modified-Since字段，源服务器上比对后只有状态为修改过的时候才会传送内容，否则不发送内容，节省带宽
proxy_cache_min_uses 3;
设置放入缓存的最少访问此数，默认是1
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
重点是updating，这个设置在更新旧内容时，依然返回旧内容，直到新内容完全传送到cache完毕
proxy_cache_lock on;
当对同一资源有多个请求，而这个资源并未被缓存的情况下，只有第一个请求发送给源服务器，其它请求等待该资源被缓存后返回该缓存。
 

NGINX: 配置拒绝IP访问
2016年1月14日
15:48
 
## 需求背景
有时候为了防止恶意攻击ip,而不是攻击域名时无法暂停解析去服务器进行操作的情况,需要禁掉ip直接访问web服务
 
## 参考页面
http://nginx.org/en/docs/http/server_names.html
 
## 配置内容
# vim /usr/local/nginx/conf/nginx.conf
***************************************
## 在http{}块中,server{}上面添加新的server{}
server {
        listen      80 default_server;
        server_name _;
        return      444;
    }
***************************************

http://stackoverflow.com/questions/16157893/nginx-proxy-pass-404-error-dont-understand-why
http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass
A request URI is passed to the server as follows:

If the proxy_pass directive is specified with a URI, then when a request is passed to the server, the part of a normalized request URI matching the location is replaced by a URI specified in the directive:
location /name/ {
    proxy_pass http://127.0.0.1/remote/;
}
If proxy_pass is specified without a URI, the request URI is passed to the server in the same form as sent by a client when the original request is processed, or the full normalized request URI is passed when processing the changed URI:
location /some/path/ {
    proxy_pass http://127.0.0.1;
}
Before version 1.1.12, if proxy_pass is specified without a URI, the original request URI might be passed instead of the changed URI in some cases.

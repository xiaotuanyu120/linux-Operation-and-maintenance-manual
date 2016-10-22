Redirect all HTTP requests to HTTPS with Nginx
Tuesday, July 12, 2016
2:16 PM
 
All login credentials transferred over plain HTTP can easily be sniffed by an MITM attacker, but is is not enough to encrypt the login forms. If you are visiting plain HTTP pages while logged in, your session can be hijacked and not even two-factor authentication will protect you. To protect all info sent between your visitors - which includes you - and your web server, we will redirect all requests that's coming over plain HTTP to the HTTPS equivalent.
 
It is not really necessary to use HTTPS for absolutely all requests, but it makes your life much easier to just handle one scheme and redirect all plain HTTP traffic to the equivalent HTTPS resource. So please make sure you setup HTTPS for the same hostname that you use for plain HTTP. Do NOT use secure.example.com if your regular hostname is example.com or www.example.com. The only difference should be the scheme - nothing else. This will save you from a lot of headaches further down the road.
1. Setup HTTPS on Nginx
2. Optimize HTTPS on Nginx and get a A+ score on the SSLlabs test.
3. Optionally, set up HTTP Public Key Pinning (HPKP)
4. Redirect all HTTP traffic to HTTPS in your Nginx config: server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 301 https://$host$request_uri;
} 
Now all traffic for http://example.com/foobar is redirected to https://example.com/foobar. Please note that while this works fine for GET requests, the postdata is not sent to the new URL for POST requests. This is usually not an issue if you're using WordPress - at least not if your web site is coded somewhat properly - as all your forms should use the URL WordPress is configured to use.
The redirect response is sent with the HTTP status code 301, which tells the browser (and search engines) that this a permanent redirect. This makes the browser remember the redirect, so that next time they visit, the browser will do the redirect internally. If you set the HSTS header - which you should - the browser will even do this for every single request to your domain.
Note that the above is a very general purpose Nginx config that will redirect all hostnames on the server. You are free to specify the specific hostnames you want to have redirected. Also: If you're a little paranoid - which is not a bad thing in web security - you will note that it's using the Nginx $host variable. This variable can be set by the HTTP Host header - provided by the client. It is most likely safe to use in this manner, but as a principle it's better to play it safe by using variables we set ourselves:
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name example.com www.example.com;
        return 301 https://$server_name$request_uri;
} 
Unfortunately, we have to use the $request_uri variable - which we have very little control over. To remove malicious request URIs, you should look into getting a WAF (Web Application Firewall).
Clipped from: https://bjornjohansen.no/redirect-to-https-with-nginx

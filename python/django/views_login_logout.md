---
title: views: login and logout
date: 2016-11-10 16:28:00
categories: python/django
tags: [python,django,login,logout]
---
### 如何在django中实现login和logout

----

#### 1. login功能  

**前端页面内容**
``` html
<form  action="/login/" method="POST">
 {% csrf_token %}
  <input name="username" id="UserName" type="text" class="form-control" placeholder="UserName">
  <input name="password" id="PassWord" type="password" class="form-control" placeholder="PassWord">
  <button type="submit" class="btn btn-primary" >Login In</button>
</form>
```
- `csrf_token`是django的一个密码认证的中间件
- form的`method`是`POST`，因为要post数据到django，由django相应的`views`处理
- form的`action`指定的内容就是post的目标url
- form包含`name`为"username"和"password"两个text和一个button

**views功能编写**
``` python
from django.contrib.auth import authenticate, login, logout

@csrf_protect
def login_user(request):
    logout(request)
    username = password = ''
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/home/')
    return render_to_response('devops/login.html', context_instance=RequestContext(request))
```
- `request.POST['']`中的`username`和`password`对应的就是前端页面的text的`name`
- 使用authenticate先认证，有效后才login

----

#### logout功能
**前端页面内容**
``` html
<form class="navbar-form navbar-right inline" method='POST' action="/logout/">
  {% csrf_token %}
  <button type="submit" class="btn btn-danger">Logout</button>
</form>
```
- 和login功能相似，但此处只需要一个button

**views内容**
``` python
@login_required
def logout_user(request):
    logout(request)
    return redirect('login_user')
```
- `login_required`意思是只有登录的用户才可以访问此功能
- 直接执行`logout(request)`,django会自动去找request中的用户信息，然后登出它

> PS:  
若想获取登录用户名称，可直接使用`request.user.username`

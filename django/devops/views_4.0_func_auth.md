---
title: views: 4.0 控制function访问权限
date: 2016-12-01 15:35:00
categories: django/devops
tags: [python,django,auth]
---
### 4.0 控制views中function的访问权限
`views.py`
``` python
from django.contrib.auth.decorators import user_passes_test


def check_permission(user):
    allowed_user = settings.DASHBOARD_USERS
    if user.username not in allowed_user:
        return False
    else:
        return True


@user_passes_test(check_permission)
@login_required
def dashboard(request):
    pass
```
`settings.py`
``` python
# views's function permission list
DASHBOARD_USERS = ["admin", "someuser"]
```

在上面的范例中，只有DASHBOARD_USERS中的用户，才能够访问dashboard这个function。  

因为我们通过user_passes_test来在运行dashboard之前将USER对象传递给了check_permission函数来处理。  
[django USER DOC](https://docs.djangoproject.com/en/1.10/ref/contrib/auth/#django.contrib.auth.models.User)  
[django user_passes_test DOC](https://docs.djangoproject.com/en/1.10/topics/auth/default/#django.contrib.auth.decorators.user_passes_test)

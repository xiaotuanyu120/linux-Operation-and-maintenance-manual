---
title: template: 1.0 使用dict
date: 2016-11-18 17:36:00
categories: python/django
tags: [python,django,template]
---
### 1.0 template中使用dict
----
#### 1. 当我们使用list时
``` html
\{\% for li in list \%\}
<li>\{\{ li \}\}</li>
\{\% endfor \%\}
```
----
#### 2. 当我们使用dict时
``` html
<!-- key和value获取 -->
\{\% for key, value in dict.items \%\}
<li>\{\{ key \}\} - \{\{ value \}\}</li>
\{\% endfor \%\}

<!-- 仅获取key -->
\{\% for key in dict.keys \%\}
<li>\{\{ key \}\}</li>
\{\% endfor \%\}
```

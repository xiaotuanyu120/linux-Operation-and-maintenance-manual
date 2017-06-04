---
title: func: search(google cse)
date: 2017-06-04 10:58:00
categories: blog/func
tags: [search,google]
---
### func: search(google cse)

---

### 1. 什么是google cse？
google cse([customized search engine](https://cse.google.com/cse/))是一个谷歌提供的自定义搜索引擎，在上面注册以后，它会给你生成代码，你只需要把代码拷贝粘贴到你的前端页面中即可。

---

### 2. 简单示例
首先在google的cse页面创建自己的搜索引擎，然后输入搜索的域名和自定义样式，最终google会生成如下的类似一段代码
``` javascript
<div>
 <script type="text/javascript">
  (function() {
    var cx = '012345678921360531439:ff68trchadg';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
  </script>
 <gcse:search>
 </gcse:search>
</div>
```
> 其中cx是给你的引擎代号，将这部分代码拷贝到前端页面中，基本上搜索功能就能用了

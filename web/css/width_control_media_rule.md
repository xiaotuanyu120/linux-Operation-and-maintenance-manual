---
title: css: 使用@media规则来控制不同浏览器页面宽度
date: 2017-01-19 16:39:00
categories: web/css
tags: [css]
---
### css: 使用@media规则来控制不同设备页面宽度

---

### 1. css文件内容
``` css
.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto
}
@media (min-width: 768px) {
    .container {
        width: 750px
    }
}
@media (min-width: 992px) {
    .container {
        width: 970px
    }
}
@media (min-width: 1200px) {
    .container {
        width: 1170px
    }
}
```
其中@media除了min-width还有很多其他判断条件可使用，详情可参见[文档](http://www.w3schools.com/cssref/css3_pr_mediaquery.asp)  
此处的例子是bootstrap中的使用方法，应对不同宽度浏览器下，如何根据浏览器宽度来调整页面宽度，其中min-width也可以按照情况使用max-width

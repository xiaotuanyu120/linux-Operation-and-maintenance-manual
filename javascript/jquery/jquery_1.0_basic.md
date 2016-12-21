---
title: jquery: 1.0 基础知识
date: 2016-11-16 16:05:00
categories: javascript/jquery
tags: [django,javascript,jquery]
---
### jquery: 1.0 基础知识

----

### 1. jquery
#### 1) 等待全部页面元素加载完毕才执行js
``` javascript
$(document).ready(function(){
  some_action();
})

//或者

$(function(){
  some_action();
})
```

#### 2) 获取某class的元素值
``` javascript
//html
<select class="form-control" id="selbrand" name="selbrand">
  <option>商品1</option>
  <option>商品2</option>
</select>

//jquery
selbrand = $("#selbrand").val();
```

#### 3) 删除和增加属性
``` javascript
//增加属性
$("#some").attr("attr_name", "attr_value")
$("#some").attr("attr_name")
$("#some").prop("attr_name", true)

//删除属性
$("#some").removeAttr("attr_name")
$("#some").prop("attr_name", false)
```

#### 4) 选择元素
``` javascript
//选择id
$("#some_id")

//选择类
$(".some_class")

//选择当前元素
$(this)

//选择多个元素
$("selection1, selection2, selection3 ...")
```

#### 5) 传递django的变量值给jquery
``` javascript
//html content
<button type="submit" class="btn btn-primary" value='Click' id="btn2" user=\{\{ request.user.username \}\}>test</button>

//javascript
$("#btn2").click(function(){
  alert($(this).attr("user"));
});
```

#### 6) 显示和隐藏元素
``` javascript
//隐藏
$("#someid").hide()
//指定隐藏过程时间
$("#someid").hide(100)

//显示
$("#someid").show()
//指定显示过程时间
$("#someid").show(100)
```

#### 7) form元素的reset
``` javascript
//会将from中的元素都reset成初始化的状态
$("#someformid")[0].reset()
```

#### 8) append方法
``` javascript
$("#someid").append(somelist[i] + "<br>");
//输入源为somelist
//将list中的值换行增加到someid的html内容中
```

#### 9) for循环
``` javascript
for (i=0;i<somelist.length;i++) {
  $("#someid").append(somelist[i] + "<br>");
}
```

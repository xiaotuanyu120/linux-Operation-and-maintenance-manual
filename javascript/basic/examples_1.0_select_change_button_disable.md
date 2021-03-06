---
title: 实例: 1.0 根据select的内容来改变button的disabled属性
date: 2016-11-02 16:56:00
categories: javascript/basic
tags: [javascript]
---
### 实例: 1.0 根据select的内容来改变button的disabled属性

---

### 1. 问题背景
有一个form，包含一个select下拉选框，一个button。默认button的disabled属性是true，希望当检测到select改变，且不等于默认值时，将button的disabled属性设置为false，以达到避免用户在页面刚刷新出来，select中的值还是默认值时误操作点击了button。

---

### 2. script内容
逻辑很简单，当select对象改变时，检查其值。根据其值来判断接下来的行动  
".prop(property_name, value)"，使用这个语句来改变对象的属性值
``` javascript
<script>
$(document).ready(function(){
    $("#selbrand").change(function(){
       selbrand = $("#selbrand").val();
       if (selbrand != "请选择产品"){
         $("#MyButton").prop("disabled", false);
       }
       else {
         $("#MyButton").prop("disabled", true);
       }
    });
  });
</script>
```

---

### 3. html内容
重点其实就是看两个元素的id，js通过$("#id_name")来选择一个元素
``` html
<form method="POST" action="">

          <div class="form-group">
            <label class="control-label" for="selbrand">Brand</label>
            <select class="form-control" id="selbrand" name="selbrand">
              <option>请选择产品</option>
              <option>brand1</option>
              <option>brand2</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" name="run" id="MyButton" value="Click" disabled>restart</button>
        </form>
```

---
title: 实例: 1.1 根据select和input的内容来改变button的disabled属性
date: 2017-04-26 17:56:00
categories: javascript/basic
tags: [javascript]
---
### 1. 问题背景
根据select，input等综合因素，来判断确认的button是否拥有disable属性，主要用于防止误提交。

---

### 2. script内容
逻辑很简单，当select或input对象改变时，检查其值。根据其值来判断接下来的行动
``` javascript
$(document).ready(function(){
  // disable save button
  $("#saveNote").prop("disabled", true);

  // function to change button status
  function button_status(){
     checkBoxQuantum = $("#checkBoxQuantum").val();
     messageWrite = $.trim(document.getElementById('messageWrite').value);
     AuthorName = $.trim(document.getElementById('AuthorName').value);
     if (checkBoxQuantum == "请选择" || messageWrite == '' || AuthorName == ''){
       $("#saveNote").prop("disabled", true);
     }
     else {
       $("#saveNote").prop("disabled", false);
     }
  }

  // set button status in these cases
  $("#checkBoxQuantum").change(function(){
     button_status();
  });
  $("#messageWrite").on("change paste keyup", function() {
    button_status();
  });
  $("#AuthorName").on("change paste keyup", function() {
    button_status();
  });
})
```
>
0. 首先button添加disable属性
1. 判断了select和input的状态改变
2. 获取select和input的值，根据一定条件判断，select是否正却选择，input是否为空，判断后决定button的disable属性

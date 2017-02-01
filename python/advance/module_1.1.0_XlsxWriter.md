---
title: module: 1.1.0 XlsxWriter 初识
date: 2017-02-01 16:38:00
categories: python/advance
tags: [python,module]
---
### module: 1.1.0 XlsxWriter 初识

---

### 1. XlsxWriter模块
[官方文档](http://xlsxwriter.readthedocs.io/)  
XlsxWriter是一个创建excel文件的python模块

---

### 2. 使用实例
``` python
import xlsxwriter

# 这里是从一个类中抽出的函数，只需要关系xlsxwriter的实现就好，其他代码可以忽视
def xlsx_write(self):
    """将结果输出到excel文件中"""
    # 创建文件和sheet
    workbook = xlsxwriter.Workbook(self.xlsx_file)
    worksheet = workbook.add_worksheet()
    # 格式化列宽
    worksheet.set_column('A:A', 20)
    worksheet.set_column('B:B', 50)
    # 格式化垂直居中和自动wrap换行
    format = workbook.add_format()
    format.set_text_wrap()
    format.set_align('vcenter')
    # 使用write方法写入到文件的工作表中
    for i in range(len(self.host_list())):
        num = str(i+1)
        row_col_A = 'A' + num
        host_name = self.host_list()[i]
        worksheet.write(row_col_A, host_name, format)

        row_col_B = 'B' + num
        host_state = self.host_state(host_name)
        worksheet.write(row_col_B, host_state, format)
```

---
title: ANSIBLE: py函数解析yaml文件
date: 2016-10-07 15:29:00
categories: devops/ansible
tags:
---

---
title: python解析yaml文件(ansible)
date: 2016-10-07 15:34:00
categories: python
tags: [ansible, python, yaml]
---
### 安装模块
``` bash
pip install pyyaml
```

### 函数内容
``` python
import yaml

def yaml_parser(file):
    with open('file', 'r') as f:
        yml = yaml.load(f)[0]
return yml
```

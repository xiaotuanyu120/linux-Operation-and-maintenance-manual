FAB: 函数对外接口控制
2016年3月24日
16:20
 
## 只要给fuction命名的时候采用"_func_name"这种"_"开头的函数名称，就会隐藏该函数的对外接口
 
## 修改之前
# vim ./main.py
*********************************************
......
from keygen_ssh import key_gen as key_gen
from keygen_ssh import key_copy as key_copy
......
*********************************************
# fab -f main.py -l
Available commands:
 
    key_copy
    key_gen
    ssh_key_copy
    ssh_key_gen
 
## 修改之后
# vim ./main.py
*********************************************
......
from keygen_ssh import key_gen as _key_gen
from keygen_ssh import key_copy as _key_copy
......
*********************************************
# fab -f main.py -l
Available commands:
 
    ssh_key_copy
    ssh_key_gen

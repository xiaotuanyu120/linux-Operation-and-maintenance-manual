---
title: 错误: 3.0 CTR mode needs counter parameter, not IV
date: 2018-02-08 09:45:00
categories: python/advance
tags: [python,paramiko,error]
---
### 错误: 3.0 CTR mode needs counter parameter, not IV

---

### 1. ansible 使用paramiko ssh连接时报错
#### 1) 错误信息
``` python
paramiko.transport Unknown exception: CTR mode needs counter parameter, not IV
paramiko.transport Traceback (most recent call last):
paramiko.transport   File "/usr/lib/python2.6/site-packages/paramiko/transport.py", line 1535, in run
paramiko.transport     self.kex_engine.parse_next(ptype, m)
paramiko.transport   File "/usr/lib/python2.6/site-packages/paramiko/kex_group1.py", line 68, in parse_next
paramiko.transport     return self._parse_kexdh_reply(m)
paramiko.transport   File "/usr/lib/python2.6/site-packages/paramiko/kex_group1.py", line 108, in _parse_kexdh_reply
paramiko.transport     self.transport._activate_outbound()
paramiko.transport   File "/usr/lib/python2.6/site-packages/paramiko/transport.py", line 1825, in _activate_outbound
paramiko.transport     engine = self._get_cipher(self.local_cipher, key_out, IV_out)
paramiko.transport   File "/usr/lib/python2.6/site-packages/paramiko/transport.py", line 1473, in _get_cipher
paramiko.transport     return self._cipher_info[name]['class'].new(key, self._cipher_info[name]['mode'], iv, counter)
paramiko.transport   File "/usr/lib64/python2.6/site-packages/Crypto/Cipher/AES.py", line 95, in new
paramiko.transport     return AESCipher(key, *args, **kwargs)
paramiko.transport   File "/usr/lib64/python2.6/site-packages/Crypto/Cipher/AES.py", line 59, in __init__
paramiko.transport     blockalgo.BlockAlgo.__init__(self, _AES, key, *args, **kwargs)
paramiko.transport   File "/usr/lib64/python2.6/site-packages/Crypto/Cipher/blockalgo.py", line 141, in __init__
paramiko.transport     self._cipher = factory.new(key, *args, **kwargs)
paramiko.transport ValueError: CTR mode needs counter parameter, not IV
```
#### 2) 解决方案：
``` bash
vim /usr/lib/python2.6/site-packages/paramiko/transport.py
# 搜索_get_cipher，修改该函数内的下面一行
             #return self._cipher_info[name]['class'].new(key, self._cipher_info[name]['mode'], iv, counter)
             return self._cipher_info[name]['class'].new(key, self._cipher_info[name]['mode'], '', counter)
```
> [stackoverflow参考链接](https://stackoverflow.com/questions/42029415/paramiko-futurewarning-ctr-mode-needs-counter-parameter)  
[github 代码](https://github.com/paramiko/paramiko/pull/714/commits/4752287a7379da61245087ee7e35635a4e42bb3f)

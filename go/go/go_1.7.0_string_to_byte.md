---
title: GO 1.7.0 string转换成byte
date: 2017-06-20 13:15:00
categories: go/go
tags: [go,byte,string]
---
### GO 1.7.0 string转换成byte

---

### 1. string转换成byte示例
``` go
package main

import (
	"fmt"
)

func main() {
	s := []byte("hello, byte")
	fmt.Printf("type: %T\nvalue: %v\nstring: %v\n", s, s, string(s))
}
```
输出结果
``` bash
type: []uint8
value: [104 101 108 108 111 44 32 98 121 116 101]
string: hello, byte
```
> playground: https://play.golang.org/p/b3ZSefMGrv

---
title: GO 2.1.0 slice append元素和extend新slice
date: 2018-07-10 15:26:00
categories: go/go
tags: [go,slice]
---
### GO 2.1.0 slice append元素和extend新slice

---

### 1. slice append by item
``` golang
var slice1, slice2 []string
slice1 = []string{"1", "2"}
slice2 = []string{"3", "4"}
fmt.Println(append(slice1, "1", "2"))
```
结果是[1 2 1 2]

### 2. slice extend another slice
``` golang
var slice1, slice2 []string
slice1 = []string{"1", "2"}
slice2 = []string{"3", "4"}
fmt.Println(append(slice1, slice2...))
```
结果是[1 2 3 4]
> 重点是那三个点  
[golang博客文档](https://blog.golang.org/slices)

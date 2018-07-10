---
title: GO 2.2.0 查看object的type的三种方法
date: 2018-07-10 17:46:00
categories: go/go
tags: [go,interface,type]
---
### GO 2.2.0 查看object的type的三种方法

---

### 1. 查看object的type的三种方法
``` golang
package main

import (
	"fmt"
	"reflect"
)

func main() {
	var var1, var2, var3 interface{}

	var1 = "string"
	fmt.Printf("type is :%s\n", type1(var1))

	var2 = []string{"str1", "str2"}
	fmt.Printf("type is :%s\n", type2(var2))

	var3 = 666
	fmt.Printf("type is :%s\n", type3(var3))
}

// using format print
func type1(v interface{}) string {
	return fmt.Sprintf("%T", v)
}

// using reflect
func type2(v interface{}) string {
	return reflect.TypeOf(v).String()
}

// using switch type
func type3(v interface{}) string {
	switch v.(type) {
	case int:
		return "int"
	case float64:
		return "float64"
	//... etc
	default:
		return "unknown"
	}
}

```
结果是
type is :string
type is :[]string
type is :int

> [stackoverflow上关于查看object type的问答](https://stackoverflow.com/questions/20170275/how-to-find-a-type-of-an-object-in-golang?rq=1)

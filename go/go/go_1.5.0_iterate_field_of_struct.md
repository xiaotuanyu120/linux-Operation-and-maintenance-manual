---
title: GO 1.5.0 遍历struct的fields
date: 2017-06-19 11:38:00
categories: go/go
tags: [go,iterate,struct]
---
### GO 1.5.0 遍历struct的fields

---

### 1. 使用reflect遍历struct的fields
``` go
package main

import (
	"fmt"
	"reflect"
)

type server struct {
	UUID         string `json:"uuid"`
	SN           string `json:"sn"`
	IP           string `json:"ip"`
	CPU          string `json:"cpu"`
	Memory       string `json:"memory"`
	Disktype     string `json:"disktype"`
	Disksize     string `json:"disksize"`
	NIC          string `json:"nic"`
	Manufacturer string `json:"manufacturer"`
	Model        string `json:"model"`
	IDC          string `json:"idc"`
	Comment      string `json:"comment"`
}

func main() {
	ser := server{UUID: "1", IP: "192.168.0.11"}
	fmt.Printf("%v\n", ser)
	// 获取ser指针包含的值s
	s := reflect.ValueOf(&ser).Elem()
	// 获取s的类型typeOfS
	typeOfS := s.Type()
	// 根据field个数s.NumField来遍历s
	for i := 0; i < s.NumField(); i++ {
		// 获取每个field对象f
		f := s.Field(i)
		// field的index是i
		// field名称是typeOfS.Field(i).Name
		// field类型是f.Type()
		// fieldvalue是f.Interface()
		fmt.Printf("%d: %s %s = %v\n", i,
			typeOfS.Field(i).Name, f.Type(), f.Interface())
	}
}
```
> 我们在`s := reflect.ValueOf(&ser).Elem()`中使用了`Elem()`，因为我们传入的是`&ser`，同时也可以使用`s := reflect.ValueOf(ser)`

---

### 2. 执行结果
``` bash
go build
./go-rest-api
{1  192.168.0.11         }
0: UUID string = 1
1: SN string =
2: IP string = 192.168.0.11
3: CPU string =
4: Memory string =
5: Disktype string =
6: Disksize string =
7: NIC string =
8: Manufacturer string =
9: Model string =
10: IDC string =
11: Comment string =
```

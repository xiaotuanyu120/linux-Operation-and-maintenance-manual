---
title: GO 1.6.0 reflect获取struct的tag值
date: 2017-06-20 10:15:00
categories: go/go
tags: [go,iterate,struct,reflect]
---
### GO 1.6.0 reflect获取struct的tag值

---

### 0. 问题背景
有时候我们在创建struct的时候，会给struct增加tag值，例如
``` go
type User struct {
	name string `json:"name-field" sql:"name-sql"`
	age  int
}
```
有时候我们需要获取json或者sql对应的field名称

---

### 1. 使用TypeOf获取struct的tag值
``` go
package main

import (
	"fmt"
	"reflect"
)

type User struct {
	name string `json:"name-field" sql:"name-sql"`
	age  int
}

func main() {
	user := User{"John Doe The Fourth", 20}

	fieldT, ok := reflect.TypeOf(user).FieldByName("name")
	if !ok {
		panic("Field not found")
	}
	vT, ok := fieldT.Tag.Lookup("sql")
	if !ok {
		panic("pattern not found")
	}
	fmt.Printf("%v\n", vT)
}
```

---

### 2. 使用ValueOf获取struct的tag值
``` go
package main

import (
	"fmt"
	"reflect"
)

type User struct {
	name string `json:"name-field" sql:"name-sql"`
	age  int
}

func main() {
	user := User{"John Doe The Fourth", 20}

	fieldV, ok := reflect.ValueOf(user).Type().FieldByName("name")
	if !ok {
		panic("Field not found")
	}
	vV, _ := fieldV.Tag.Lookup("sql")
	if !ok {
		panic("pattern not found")
	}
	fmt.Printf("%v\n", vV)
}
```

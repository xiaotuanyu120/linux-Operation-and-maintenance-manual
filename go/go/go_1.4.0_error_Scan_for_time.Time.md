---
title: GO 1.4.0 Scan() 支持time.Time
date: 2017-06-07 14:34:00
categories: go/go
tags: [go,sql]
---
### GO 1.4.0 Scan() 支持time.Time

---

### 1. issue描述
错误信息
```
sql: Scan error on column index 10: unsupported Scan, storing driver.Value type []uint8 into type *time.Time
```
sql报错相关go语句
``` go
// 数据库记录类型
type server struct {
	UUID         string
	Sn           string
	IP           string
	CPU          string
	Memory       string
	Disktype     string
	Disksize     string
	Nic          string
	Manufacturer string
	Model        string
	Expiredate   time.Time
	Idc          string
	Comment      string
}

// 数据库连接
db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/assets")

// scan语句
var stmt *sql.Stmt
stmt, err = db.Prepare("SELECT * FROM assets.server;")
if err != nil {
  log.Fatal(err)
}
// defer stmt.Close()

var rows *sql.Rows
rows, err = stmt.Query()
if err != nil {
  log.Fatal(err)
}
defer rows.Close()

for rows.Next() {
  var uuid string
  var sn string
  var ip string
  var cpu string
  var memory string
  var disktype string
  var disksize string
  var nic string
  var manufacturer string
  var model string
  var expiredate time.Time
  var idc string
  var comment string

  err = rows.Scan(
    &uuid,
    &sn,
    &ip,
    &cpu,
    &memory,
    &disktype,
    &disksize,
    &nic,
    &manufacturer,
    &model,
    &expiredate,
    &idc,
    &comment,
  )
  if err != nil {
    log.Fatal(err)
  }

  ser := server{
    uuid,
    sn,
    ip,
    cpu,
    memory,
    disktype,
    disksize,
    nic,
    manufacturer,
    model,
    expiredate,
    idc,
    comment,
  }

  var serJSON []byte
  serJSON, err = json.Marshal(ser)
  if err != nil {
    fmt.Println(err)
    return
  }
  result = append(result, string(serJSON))
}
```
> 因为expiredate是time.Time类型，所以导致scan函数执行时报错

---

### 2. 解决方案
https://github.com/Go-SQL-Driver/MySQL/issues/9
``` go
// 按照issues里面的提示修改db连接语句，增加?parseTime=true
db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/assets?parseTime=true")
```

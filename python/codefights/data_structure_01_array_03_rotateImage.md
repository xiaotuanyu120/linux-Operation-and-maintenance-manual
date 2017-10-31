---
title: array 03: rotate image(翻转列表，解压参数)
date: 2017-10-31 13:47:00
categories: python/codefights
tags: [interview,codefights]
---
### array 03: rotate image(翻转列表，解压参数)

---

### 1. 题目
> Note: Try to solve this task in-place (with O(1) additional memory), since this is what you'll be asked to do during an interview.

You are given an n x n 2D matrix that represents an image. Rotate the image by 90 degrees (clockwise).

**Example**

- For
```
a = [[1, 2, 3],
     [4, 5, 6],
     [7, 8, 9]]
```
the output should be  
```
rotateImage(a) =
    [[7, 4, 1],
     [8, 5, 2],
     [9, 6, 3]]
```

**Input/Output**
- [time limit] 4000ms (py)

- [input] array.array.integer a    
Guaranteed constraints:  
`1 ≤ a.length ≤ 100`,  
`a[i].length = a.length`,  
`1 ≤ a[i][j] ≤ 104`.

- [output] array.array.integer  

---

### 2. 解法
**个人解法**
``` python
def rotateImage(a):
    shift_a = a[::-1]
    retate_a = [x for x in zip(*shift_a)]
    return retate_a
```
> 原本写的惨不忍睹，这是根据下面精品写法改善了一下可读性贴上来

**精品解法**
``` python
rotateImage = lambda a: zip(*a[::-1])
```
> 重点在于`a[::-1]`翻转列表，`*args`解压参数

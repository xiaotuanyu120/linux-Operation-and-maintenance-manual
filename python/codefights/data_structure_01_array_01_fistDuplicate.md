---
title: array 01: fist duplicate
date: 2017-10-31 13:20:00
categories: python/codefights
tags: [interview,codefights]
---
### array 01: fist duplicate

---

### 1. 题目
> Note: Write a solution with O(n) time complexity and O(1) additional space complexity, since this is what you would be asked to do during a real interview.

Given an array a that contains only numbers in the range from 1 to a.length, find the first duplicate number for which the second occurrence has the minimal index. In other words, if there are more than 1 duplicated numbers, return the number for which the second occurrence has a smaller index than the second occurrence of the other number does. If there are no such elements, return -1.

**Example**

- For `a = [2, 3, 3, 1, 5, 2]`, the output should be  
`firstDuplicate(a) = 3`.  
There are 2 duplicates: numbers 2 and 3. The second occurrence of 3 has a smaller index than than second occurrence of 2 does, so the answer is 3.

- For `a = [2, 4, 3, 5, 1]`, the output should be  
`firstDuplicate(a) = -1`.

**Input/Output**

- [time limit] 4000ms (py)

- [input] array.integer a  
Guaranteed constraints:  
`1 ≤ a.length ≤ 105`,  
`1 ≤ a[i] ≤ a.length`.

- [output] integer  
The element in a that occurs in the array more than once and has the minimal index for its second occurrence. If there are no such elements, return -1.

### 2. 解法
**个人解法**
``` python
def firstDuplicate(a):

    dict = {}
    found = 0

    for i in range(len(a)):
        if a[i] in dict:
            dict[a[i]] += 1
        else:
            dict[a[i]] = 1

        if(dict[a[i]] == 2):
            found = 1
            return a[i]

    if not found:
        return -1
```

**精品解法**
``` python
def firstDuplicate(A):
    for x in A:
        A[abs(x) - 1] *= -1
        if A[abs(x) - 1] > 0:
            return abs(x)
    return -1
```
> 利用了array元素值范围是1到array本身的长度这个条件，每个元素值减一对应array的一个肯定存在的index，轮询array，对每个元素值对应的index初乘以-1，则该值必然为负数，如果检测到该值是正数，说明是元素值第二次存在，则可返回该值。

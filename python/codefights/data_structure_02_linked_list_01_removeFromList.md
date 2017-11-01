---
title: linked list 01: remove from list
date: 2017-11-01 09:29:00
categories: python/codefights
tags: [interview,codefights,linkedlist]
---
### linked list 01: remove from list

---

### 1. 题目
> Note: Try to solve this task in O(n) time using O(1) additional space, where n is the number of elements in the list, since this is what you'll be asked to do during an interview.

Given a singly linked list of integers `l` and an integer `k`, remove all elements from list `l` that have a value equal to `k`.

**Example**

- For `l = [3, 1, 2, 3, 4, 5]` and `k = 3`, the output should be  
`removeKFromList(l, k) = [1, 2, 4, 5]`;

- For `l = [1, 2, 3, 4, 5, 6, 7]` and `k =10`, the output should be  
`removeKFromList(l, k) = [1, 2, 3, 4, 5, 6, 7]`.

**Input/Output**
- [time limit] 4000ms (py)

- [input] linkedlist.integer l   
A singly linked list of integers.  
Guaranteed constraints:
`0 ≤ list size ≤ 105`,
`-1000 ≤ element value ≤ 1000`.

- [input] integer k  
An integer.  
Guaranteed constraints:  
`-1000 ≤ k ≤ 1000`.

- [output] linkedlist.integer  
Return `l` with all the values equal to `k` removed.

---

### 2. 解法
**个人解法**
``` python
# Definition for singly-linked list:
# class ListNode(object):
#     def __init__(self, x):
#         self.value = x
#         self.next = None
#

def removeKFromList(l, k):
    new_l = l
    while new_l:
        if new_l.value == k:
            new_l = new_l.next
        else:
            break
    if new_l:
        curr = new_l.next
        last = new_l
        while curr:
            if curr.value == k:
                last.next = curr.next
                curr = last.next
            else:
                last = curr
                curr = curr.next
    return new_l
```
> 逻辑不够简洁，有很多多余的逻辑

**精品解法**
``` python
def removeKFromList(l, k):
    curr_node = l
    while curr_node and curr_node.next:
        if curr_node.next and curr_node.next.value == k:
            curr_node.next = curr_node.next.next
        else:
            curr_node = curr_node.next
    return l.next if l and l.value == k else l
```
> linked list是不可迭代对象，逻辑是两个节点一起看，后面节点如果值为k，则将前面节点的next指向更后面一个。   
当使用and连接符组成判断条件时，前面的一旦为false，后面的条件不会被检查，这样就避免了很多错误提示。

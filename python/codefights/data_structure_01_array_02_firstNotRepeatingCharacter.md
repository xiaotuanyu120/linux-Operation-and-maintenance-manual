---
title: array 02: fist not repeating character
date: 2017-10-31 13:36:00
categories: python/codefights
tags: [interview,codefights,str.find,str.rfind,str.index,str.rindex]
---
### array 02: fist not repeating character

---

### 1. 题目
> Note: Write a solution that only iterates over the string once and uses O(1) additional memory, since this is what you would be asked to do during a real interview.

Given a string s, find and return the first instance of a non-repeating character in it. If there is no such character, return '\_'.

**Example**

- For `s = "abacabad"`, the output should be  
`firstNotRepeatingCharacter(s) = 'c'`.  
There are 2 non-repeating characters in the string: 'c' and 'd'. Return c since it appears in the string first.

- For `s = "abacabaabacaba"`, the output should be  
`firstNotRepeatingCharacter(s) = '_'`.  
There are no characters in this string that do not repeat.

**Input/Output**

- [time limit] 4000ms (py)
- [input] string s  
A string that contains only lowercase English letters.  
Guaranteed constraints:  
`1 ≤ s.length ≤ 105`.

- [output] char  
The first non-repeating character in `s`, or `'_'` if there are no characters that do not repeat.

---

### 2. 解法
**个人解法**
``` python
def firstNotRepeatingCharacter(s):
    records = {}
    for i in range(0, len(s)):
        char = s[i]
        if not char in records:
            records[char] = [i,0]
        else:
            records[char][1] += 1

    not_repeat_records = {i: j[0] for i, j in records.items() if j[1] == 0}
    if not_repeat_records:
        first_not_repeat_record = sorted(not_repeat_records.items(), key=lambda x: x[1])
        first_not_repeat_char = first_not_repeat_record[0][0]
        return first_not_repeat_char
    else:
        return "_"
```

**精品解法**
``` python
def firstNotRepeatingCharacter(s):
    for c in s:
        if s.find(c) == s.rfind(c):
            return c
    return '_'
```
> 不重复的字符有个特点，从左边数第一个和右边数第一个的index值是相同的，因为c是s中轮询而来，必然存在在s中，所以也可以使用`.index`,`.rindex`来替代`.find`,`.rfind`。

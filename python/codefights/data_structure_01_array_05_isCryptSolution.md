---
title: array 05: is crypt solution(reduce,map,any,all)
date: 2017-10-31 14:40:00
categories: python/codefights
tags: [interview,codefights,reduce,map,any,all]
---
### array 05: is crypt solution(reduce,map,any,all)

---

### 1. 题目
A cryptarithm is a mathematical puzzle for which the goal is to find the correspondence between letters and digits, such that the given arithmetic equation consisting of letters holds true when the letters are converted to digits.

You have an array of strings `crypt`, the cryptarithm, and an an array containing the mapping of letters and digits, `solution`. The array `crypt` will contain three non-empty strings that follow the structure: `[word1, word2, word3]`, which should be interpreted as the `word1 + word2 = word3` cryptarithm.

If `crypt`, when it is decoded by replacing all of the letters in the cryptarithm with digits using the mapping in `solution`, becomes a valid arithmetic equation containing no numbers with leading zeroes, the answer is `true`. If it does not become a valid arithmetic solution, the answer is `false`.

**Example**

- For `crypt = ["SEND", "MORE", "MONEY"]` and
```
solution = [['O', '0'],
            ['M', '1'],
            ['Y', '2'],
            ['E', '5'],
            ['N', '6'],
            ['D', '7'],
            ['R', '8'],
            ['S', '9']]
```
the output should be  
`isCryptSolution(crypt, solution) = true`;  
When you decrypt `"SEND"`, `"MORE"`, and `"MONEY"` using the mapping given in `crypt`, you get `9567 + 1085 = 10652` which is correct and a valid arithmetic equation.

- For `crypt = ["TEN", "TWO", "ONE"]` and
```
solution = [['O', '1'],
            ['T', '0'],
            ['W', '9'],
            ['E', '5'],
            ['N', '4']]
```
the output should be  
`isCryptSolution(crypt, solution) = false`;  
Even though `054 + 091 = 145`, `054` and `091` both contain leading zeroes, meaning that this is not a valid solution.

**Input/Output**
- [time limit] 4000ms (py)

- [input] array.string crypt   
An array of three non-empty strings containing only uppercase English letters.  
Guaranteed constraints:
`crypt.length = 3`,
`1 ≤ crypt[i].length ≤ 14`.

- [input] array.array.char solution  
An array consisting of pairs of characters that represent the correspondence between letters and numbers in the cryptarithm. The first character in the pair is an uppercase English letter, and the second one is a digit in the range from 0 to 9.  
Guaranteed constraints:  
`solution[i].length = 2`,  
`'A' ≤ solution[i][0] ≤ 'Z'`,  
`'0' ≤ solution[i][1] ≤ '9'`,  
`solution[i][0] ≠ solution[j][0], i ≠ j`,  
`solution[i][1] ≠ solution[j][1], i ≠ j`.  
It is guaranteed that `solution` only contains entries for the letters present in `crypt` and that different letters have different values.

- [output] boolean  
Return `true` if the `solution` represents the correct solution to the cryptarithm `crypt`, otherwise return `false`.

---

### 2. 解法
**个人解法**
``` python
def isCryptSolution(crypt, solution):
    def wordTransfer(word, sl_dict):
        nums = ""
        for char in word:
            nums += sl_dict[char]
        return "" if len(nums) > 1 and nums[0] == "0" else int(nums)

    sl_dict = {x[0]: x[1] for x in solution}
    crypt_trans = [wordTransfer(x, sl_dict) for x in crypt]

    if "" in crypt_trans:
        return False
    else:
        if crypt_trans[0] + crypt_trans[1] == crypt_trans[2]:
            return True
        else:
            return False
```

**python2精品解法**
``` python
def isCryptSolution(crypt, solution):
    sl_dict = {char: num for char, num in solution}
    crypt_trans = [reduce(lambda x,y: x+y,map(lambda x: sl_dict[x], word)) for word in crypt]

    return not any(x != "0" and x[0] == "0" for x in crypt_trans) and \
        int(crypt_trans[0]) + int(crypt_trans[1]) == int(crypt_trans[2])
```
> python2版本没有精品解法，是根据下面的python3精品解法改编来。  
重点1：在于嵌套的map和reduce函数  
重点2：在于any和all函数

**python3精品解法**
``` python
def isCryptSolution(crypt, solution):
    dic = {ord(c): d for c, d in solution}
    *v, = map(lambda x: x.translate(dic), crypt)
    return not any(x != "0" and x.startswith("0") for x in v) and \
        int(v[0]) + int(v[1]) == int(v[2])
```
> python3 版本，python2不能用，是因为codefights 不支持import操作，如果要完全模仿py3的写法，需要`import string`

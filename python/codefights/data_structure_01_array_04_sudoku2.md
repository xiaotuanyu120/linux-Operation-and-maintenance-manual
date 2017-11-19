---
title: array 04: sudoku(yield,"%","/")
date: 2017-10-31 14:20:00
categories: python/codefights
tags: [interview,codefights,yield]
---
### array 04: sudoku(yield,"%","/")

---

### 1. 题目
Sudoku is a number-placement puzzle. The objective is to fill a `9 × 9` grid with numbers in such a way that each column, each row, and each of the nine `3 × 3` sub-grids that compose the grid all contain all of the numbers from `1` to `9` one time.

Implement an algorithm that will check whether the given `grid` of numbers represents a valid Sudoku puzzle according to the layout rules described above. Note that the puzzle represented by `grid` does not have to be solvable.

**Example**

- For
```
grid = [['.', '.', '.', '1', '4', '.', '.', '2', '.'],
        ['.', '.', '6', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '1', '.', '.', '.', '.', '.', '.'],
        ['.', '6', '7', '.', '.', '.', '.', '.', '9'],
        ['.', '.', '.', '.', '.', '.', '8', '1', '.'],
        ['.', '3', '.', '.', '.', '.', '.', '.', '6'],
        ['.', '.', '.', '.', '.', '7', '.', '.', '.'],
        ['.', '.', '.', '5', '.', '.', '.', '7', '.']]
```
the output should be  
`sudoku2(grid) = true`;

- For
```
grid = [['.', '.', '.', '.', '2', '.', '.', '9', '.'],
        ['.', '.', '.', '.', '6', '.', '.', '.', '.'],
        ['7', '1', '.', '.', '7', '5', '.', '.', '.'],
        ['.', '7', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '8', '3', '.', '.', '.'],
        ['.', '.', '8', '.', '.', '7', '.', '6', '.'],
        ['.', '.', '.', '.', '.', '2', '.', '.', '.'],
        ['.', '1', '.', '2', '.', '.', '.', '.', '.'],
        ['.', '2', '.', '.', '3', '.', '.', '.', '.']]
```
the output should be  
`sudoku2(grid) = false`;  
The given `grid` is not correct because there are two 1s in the second column. Each column, each row, and each `3 × 3` subgrid can only contain the numbers `1` through `9` one time.

**Input/Output**
- [time limit] 4000ms (py)

- [input] array.array.char grid    
A `9 × 9` array of characters, in which each character is either a digit from `'1'` to `'9'` or a period `'.'`.

- [output] boolean  
Return `true` if `grid` represents a valid Sudoku puzzle, otherwise return `false`.  

---

### 2. 解法
**个人解法**
``` python
def sudoku2(grid):
    # rows check
    for row in grid:
        if not sudoku2_check(row):
            return False

    # columns check
    columns_grid = zip(*grid)
    for col in columns_grid:
        if not sudoku2_check(col):
            return False

    # square check
    squares_grid = []
    for i in xrange(9):
        squares_grid.append([grid[i/3*3 + x][i%3*3 + y] for x in xrange(3) for y in xrange(3)])
    for sqr in squares_grid:
        if not sudoku2_check(sqr):
            return False

    return True


def sudoku2_check(grid_unit):
    nums = [int(x) for x in grid_unit if x != "."]
    for i in nums:
        if not 1 <= i <= 9:
            return False
    return True if len(set(nums)) == len(nums) else False
```
> square check部分参考了精品解法

**精品解法**
``` python
def sudoku2(grid):
    def unique(G):
        G = [x for x in G if x != '.']
        return len(set(G)) == len(G)
    def groups(A):
        B = zip(*A)
        for v in xrange(9):
            yield A[v]
            yield B[v]
            yield [A[v/3*3 + r][v%3*3 +c]
                   for r in xrange(3) for c in xrange(3)]

    return all(unique(grp) for grp in groups(grid))
```
> `unique()`负责给每一个检查单元筛选数字，然后判断是否有重复的数字  
`groups()`负责将array grid分解，一次轮询，迭代输出三个分组元素（行分组、列分组和3x3分组）  
`[A[v/3*3 + r][v%3*3 +c] for r in xrange(3) for c in xrange(3)]`利用了取整和求模的数学运算矩阵轮询，这是重点。

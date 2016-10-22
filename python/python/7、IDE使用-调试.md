7、IDE使用-调试
2015年8月20日
20:57
 
课前回顾
==============================
os.getlogin          #获取当前用户
psutil.user()                  #获取用户列表
pip freeze           #查看安装的第三方模块（pip list）
 
SOURCE DISTRIBUTION
# 查看文件组成结构可参考
https://docs.python.org/2/distutils/sourcedist.html
包含：
sdist命令
manifest.in文件
等内容
 
上课记录
author
contribution-guide
requirements.txt
dev-requirements.txt
 
本节内容
================================
7.1 常用IDE
* PyCharm
* Sublime Text
* Vim:
https://github.com/amix/vimrc          star最高的
https://github.com/the5fire/myvim  阳哥的
 
     配置pep8插件即可
 
加分项：
github有开源项目  star超过100
对知名的开源项目有贡献
 
 
7.2 调试程序：
     IDE中这么做：
 
7.3 在终端怎么处理？
     pdb：详细安装和操作见7.4 ipdb，ipdb就是一个pdb的'ipython'版本
https://docs.python.org/2.7/library/pdb.html
 
7.4 ipdb的使用
7.4.1 ipdb是什么？
ipdb exports functions to access the IPython debugger, which features tab completion, syntax highlighting, better tracebacks, better introspection with the same interface as the pdb module.
 
7.4.2 安装方法
# pip install ipdb
 
源码链接
https://pypi.python.org/packages/source/i/ipdb/ipdb-0.8.1.zip# python setup.py                           #源码安装程序
 
7.4.3 使用方法
1、# python -m ipdb module.py
2、解释器中使用
>>> import ipdb
>>> ipdb.run(statement)
3、程序中增加断点
# python get_tree_dir.py
> /root/python/homework/_7th_1/get_tree_dir.py(26)<module>()
     25     import ipdb;ipdb.set_trace()
---> 26     system('rm -f filepath_info.txt')
     27     with open('filepath_info.txt', 'a') as f:
 
ipdb> where
> /root/python/homework/_7th_1/get_tree_dir.py(26)<module>()
     24     data = sorted(data, cmp=lambda x, y: cmp(len(x[0]), len(y[0])))
     25     import ipdb;ipdb.set_trace()
---> 26     system('rm -f filepath_info.txt')
     27     with open('filepath_info.txt', 'a') as f:
     28         f.write('/root/python/homework\n')
## 'import ipdb;ipdb.set_trace()'来制作人为断点
 
7.5 调试过程命令（跟pdb一样）
h -> help    #help来查看所有操作
 
s --> step in
n  -> next
c -> continue
r -> return   继续执行直到函数返回
w  -> where 展示当前位置，调用栈
l -> list   l 50  显示某一行前后的代码
u  -> up  跳到上一层调用
 
q  -> quit 退出
 
7.6 扩展链接
https://docs.python.org/2/library/pdb.html 
 
课后练习：
1. 写一个程序，给一个路径，把目录结构写到一个文件中，保持层级关系。
2. 同ipython一样，有一个工具叫做ipdb，学会使用它，然后写一个简单的教程，贴到论坛。
3.    补充习题：
写一个程序统计代码行数,可以统计信息包括:代码行数,注释行数(代码尾部的注释也算)
使用方法:  python collection.py  .  (指当前文件夹下所有的py文件） 
 
1、解法1
====================================================
#!/usr/bin/python
# coding=utf-8
 
 
'''get the path info and put it into a file'''
 
import os
import subprocess
 
 
def cmd(command):
    process = subprocess.Popen(
        args=command,
        stdout=subprocess.PIPE,
        shell=True
    )
    return process.communicate()[0]
 
 
if __name__ == '__main__':
    path = '/root/python/homework'
    cmdline = 'tree ' + path
    result = cmd(cmdline)
 
    os.system('rm -f filepath_info_2.txt')
    with open('filepath_info_2.txt', 'a') as f:
        f.write(result)
 
 
1、解法2
=======================================
#!/usr/bin/python
 
 
'''get the path info and put it into a file'''
 
import glob
from os import walk, system
 
 
def path_structure(path):
    result = {}
    for dirname, subdirs, filenames in walk(path):
        result[dirname] = filenames
        result[dirname].extend(subdirs)
        for subdir in subdirs:
            if not glob.glob(path+subdir) == []:
                result[subdir] = glob.glob(path+subdir)
    return result
 
 
if __name__ == '__main__':
    path = "/root/python/homework"
    data = path_structure(path).items()
    data = sorted(data, cmp=lambda x, y: cmp(len(x[0]), len(y[0])))
    import ipdb;ipdb.set_trace()
    system('rm -f filepath_info.txt')
    with open('filepath_info.txt', 'a') as f:
        f.write('/root/python/homework\n')
        for i in range(len(data)):
            f.write('\t|-- %s\n' % data[i][0])
            for j in range(len(data[i][1])):
                f.write('\t|\t|-- %s\n' % data[i][1][j])
3、答案
=======================================
'''Analysis the number of code lines and
annotation lines of *.py file in current folder
'''
 
import os
import re
import sys
 
 
def get_file_list(dir_path):
    file_result = []
    all_file = [x for x in os.listdir(dir_path) if os.path.isfile(x)]
    for f in all_file:
        fname, ext = os.path.splitext(f)
        if ext == '.py':
            file_result.append(f)
    return file_result
 
 
def get_analysis_info(fname):
    analysis_result = {"Annotation": 0, "Code": 0, "Total": 0, "Spaces": 0}
    with open(fname) as f:
        flag = [0]
        for line in f:
            if flag[0] == 0:
                if re.search('^\s*$', line):
                    analysis_result["Spaces"] += 1
                elif re.search(r'^\s*("""|\'\'\')', line):
                    if re.search(r'^\s*("""|\'\'\').*("""|\'\'\')$', line):
                        analysis_result["Annotation"] += 1
                    else:
                        flag[0] += 1
                elif re.search('\s+#', line):
                    analysis_result["Annotation"] += 1
                    if not re.search('^\s*#', line):
                        analysis_result["Code"] += 1
                else:
                    analysis_result["Code"] += 1
            elif re.search(r'^.*("""|\'\'\')\s*$', line):
                analysis_result["Annotation"] += flag[0] + 1
                flag[0] = 0
            else:
                flag[0] += 1
            analysis_result["Total"] += 1
    return analysis_result
 
 
def get_path():
    try:
        sys.argv[1]
    except IndexError as e:
        print "Error: you must assign a PATH!", e
        sys.exit(0)
    return sys.argv[1]
 
 
if __name__ == '__main__':
    dir_path = get_path()
    file_list = get_file_list(dir_path)
    for fname in file_list:
        a_result = get_analysis_info(fname).items()
        p_result = ['\t%10s : %-d' % (k, v) for k, v in a_result]
        print '\t----------------------------'
        print '\t%10s : %-s\n' % ('Filename', fname)
        for i in p_result:
            print i 
阳哥答案
# coding:utf-8
 
import argparse
import os
 
parser = argparse.ArgumentParser(description='statistics the number of lines of code')
parser.add_argument('-p', '--path', default='.', dest='dirpath', type=str,
                    help='设定路径')
parser.add_argument('-l', '--language', default='python', dest='lang', type=str,
                    help='输入你想统计的语言，支持: python, ruby, c, java, 注：可以输入多个用英文逗号分隔')
parser.add_argument('-d', '--depth', default=1, dest='depth', type=int,
                    help='想要遍历的深度, 默认是1')
 
 
LANG_POSTFIX = {
    'python': '.py',
    'java': '.java',
    'ruby': '.rb',
    'c': '.c'
}
 
 
def collect_files(path, depth):
    """
    收集所有的文件，包含路径
    """
    list_files = []
 
    def recurse_dir(_path, _depth):
        if _depth < 1:
            return None
 
        for d in os.listdir(_path):
            full_path = os.path.join(_path, d)
            if os.path.isfile(full_path):
                list_files.append(full_path)
            else:
                recurse_dir(full_path, _depth-1)
 
    recurse_dir(path, depth)
 
    return list_files
 
 
def statics_by_lang(lang, files):
    result = {}
    postfix = LANG_POSTFIX.get(lang)
    if not postfix:
        return None
 
    real_files = filter(lambda x: x.endswith(postfix), files)
    for file_name in real_files:
        result[file_name] = parse_file(file_name)
 
    return result
 
 
def parse_file(file_name):
    comment_count = 0  # 测试注释
    code_count = 0
    blank_count = 0
    t = "####"
 
    with open(file_name) as f:
        multi_flag = False
        multi_count = 0
 
        for line in f:
            line = line.strip('\n').strip()
 
            if not multi_flag and is_comment(line):
                comment_count += 1
 
            elif not multi_flag and (line.startswith("'''") or line.startswith('"""')):
                multi_flag = True
                if len(line) > 3:
                    multi_count += 1
 
            elif multi_flag and (line.endswith("'''") or line.endswith('"""')):
                if len(line) > 3:
                    multi_count += 1
 
                multi_flag = False
                comment_count += multi_count
                multi_count = 0
 
            elif multi_flag and line:
                multi_count += 1
 
            elif line == '':
                # 处理空行
                blank_count += 1
            else:
                # 剩余的就是有效代码
                code_count += 1
 
    return comment_count, blank_count, code_count
 
 
def is_comment(line):
    """
    判断是否为注释行:
    规则：
        1. 以#开头
        2. 结尾注释有 # ，并且不是被写在字符串中的
    """
    if line.startswith('#'):
        return True
 
    if '#' in line:
        line = line.rsplit('#', 1)[-1]
        if '\'' not in line and '\"' not in line:
            return True
 
    return False
 
 
def main():
    args = parser.parse_args()
 
    files = collect_files(args.dirpath, args.depth)
    results = statics_by_lang(args.lang.lower(), files)
    for file_name, value in results.items():
        print file_name
        print '\t注释: %s, 空行:%s, 代码行数:%s' % value
 
    sum_values = zip(*results.values())
    print '总计:'
    print '\t注释:%s, 空行:%s, 代码行数:%s' % tuple(map(sum, sum_values))
 
 
if __name__ == '__main__':
    main()

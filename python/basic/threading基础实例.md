threading基础实例
2015年9月22日
14:20
 
Two example of run task with threading and not
==================================================
First: without threading
## file content
import threading
import time
 
def task():
    print 'worker'
    time.sleep(1)          # 任务很简单，打印单词，然后sleep 1s
 
if __name__ == "__main__":
    start = time.time()
    for i in range(5):
        task()
    print time.time() - start          # 这里统计执行时间 
## result
# python thread_no.py
worker
worker
worker
worker
worker
5.05284118652             # 能明显感觉出1秒的sleep时间 
Second: with threading
## file content
import threading
import time
 
def task():
    print 'worker'
    time.sleep(1)
 
if __name__ == "__main__":
    start = time.time()
    for i in range(5):
        t = threading.Thread(target = task)
        t.start()     # 与上面的区别仅仅是这里做了thread处理
    print time.time() - start 
## result
# python thread.py
worker
worker
worker
worker
worker
0.0138309001923            # 结果瞬间出现，用时很短

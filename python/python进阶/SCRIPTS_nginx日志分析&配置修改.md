SCRIPTS: nginx日志分析&配置修改
2015年11月25日 星期三
11:01
 
问题：
发现nginx日志中有大量ip攻击，每个ip在5分钟内的访问量达到1000以上，于是做一个脚本，如果访问量5分钟内超过200的，会在响应的vhost配置文件中添加"deny ip_address"
脚本特点：
 
#!/usr/bin/python
# deny ip that attack our server
 
import sys
 
'''this is a script to deny more than 200 times access per day'''
 
class log_manager(object):
    def __init__(self):
        '''prepare ip_cahce and ip_deny_cache'''
        self.ip_cache = {}
        self.ip_deny_cache = []
 
    def count_ip(self, file_in):
        '''open log file and count times each ip appeared'''
        try:
            f = file(file_in)
            for line in f:
                ip = line.split(' ')[0]
                if ip in self.ip_cache:
                    self.ip_cache[ip] += 1
                else:
                    self.ip_cache[ip] = 1
            return True
        except IOError as e:
            print 'file ',file_in,' isn\'t exist',e
            return False
        finally:
            f.close()
 
    def deny_ip(self, ip_list):
        '''filt the ip that need to be denied'''
        for i,v in enumerate(ip_list):
            if v[1] >= 200:            # 这里判断访问次数，超过这个数字的就列入黑名单
                self.ip_deny_cache.append(v[0])
        return True
 
class conf_manager(object):
    def __init__(self):
        self.file_in_list = []
        self.ip_need_write = []
 
    def get_current_conf(self, conf_file):
        try:
            f = file(conf_file)
            for line in f:
                self.file_in_list.append(line.strip())
            return True
        except IOError as e:
            print 'file ',conf_file,' isn\'t exist',e
            return False
        finally:
            f.close()
 
    def prepare_ip_need_write(self, ip_deny_list):
        for ip in ip_deny_list:
            ip_in_conf = True
            for line in self.file_in_list:
                if ip in line:
                    ip_in_conf = True
                    break
                else:
                    ip_in_conf = False
            if not ip_in_conf:
                self.ip_need_write.append(ip)
        return True
 
    def write_into_conf(self, conf_file):
        if self.file_in_list[-1].strip() == self.file_in_list[-2].strip() == '}':
            for ip in self.ip_need_write:
                self.file_in_list.insert(-2, 'deny '+ip+';')
            str_f = '\n'.join(self.file_in_list)
            try:
                f_result = file(conf_file, 'w')
                f_result.write(str_f)
                f_result.close()
            except IOError as e:
                print 'file ',conf_file,' isn\'t exist',e
                return False
            finally:
                f_result.close()
        else:
            print 'the last two lines of conf file is not "}"'
            print 'pls mod and try again("}\\n}" is right)'
 
 
if __name__ == "__main__":
    log = sys.argv[1]
    conf = sys.argv[2]
 
# open log file and find out which ip need to deny
    log_m = log_manager()
    log_m.count_ip(log)
    log_ip_list = log_m.ip_cache.items()
    log_m.deny_ip(log_ip_list)
 
# open conf file and find out which ip need to write into conf by filtting the deny ip
    conf_m = conf_manager()
    conf_m.get_current_conf(conf)
    conf_m.prepare_ip_need_write(log_m.ip_deny_cache)
    conf_m.write_into_conf(conf)
 

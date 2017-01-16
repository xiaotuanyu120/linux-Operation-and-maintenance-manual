``` bash
#!/bin/bash
log_file=(/tmp/tomcat1/logs/catalina.out
          /tmp/tomcat2/logs/catalina.out)
date_str=`date +%Y%m%d-%H%M%S`

# 备份
for i in ${log_file[@]};
do
    cp ${i} ${i}-${date_str}
    echo > ${i}
done

# 删除大于7天的备份
for i in ${log_file[@]};
do
    find `dirname ${i}` -name ${i}* -mtime +7 | xargs -i rm -rf {}
done
```

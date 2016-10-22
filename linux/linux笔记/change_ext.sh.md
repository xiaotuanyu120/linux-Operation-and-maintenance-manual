for file in `ls .`
do
cat $file > ${file%.txt}.md
done

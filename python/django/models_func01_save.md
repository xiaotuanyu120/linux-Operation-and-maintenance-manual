model save
2016年10月11日
16:16
 
class Brand(models.Model):
    brand = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)
 
    def __str__(self):
        return self.brand
 
    def __unicode__(self):
        return self.brand
 
 
class Host(models.Model):
    service_type_list = {
        ('web', "web"),
        ('ser', "service"),
    }
    host = models.GenericIPAddressField()
    hosttag = models.CharField(max_length=20)
    brand = models.ForeignKey(Brand, null=True)
    service_type = models.CharField(max_length=3, choices=service_type_list, default='web')
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)
 
    def __str__(self):
        return self.host
 
    def __unicode__(self):
        return self.host
 
    def save(self, *args, **kwargs):
        self.hosttag = self.host + '_' + self.brand.brand + '_' + self.service_type
        print self.hosttag
        super(Host, self).save(*args, **kwargs)
 
里面的self.brand.brand因为brand是外键，所以需要使用brand引用类Brand的brand变量才可以，否则只是引用了一个类名称

from django.db import models
from django.contrib.auth.models import User


class Player(models.Model) :
    user = models.OneToOneField(User, on_delete=models.CASCADE)#当user删除时执行的delete函数
    photo = models.URLField(max_length=256, blank=True)

    def __str__(self):
        return str(self.user)


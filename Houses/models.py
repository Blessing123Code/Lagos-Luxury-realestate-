from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    is_agent = models.BooleanField(default=False)
    phone = models.CharField(max_length=11,blank=True)

    def __str__(self):
        return f"{self.user.username} {'Agent'if self.is_agent else 'Buyer'}"

class property(models.Model):
    PROPERTY_TYPES = (
        ('house', 'House'),
        ('shortlet', 'Shortlet'),
        ('land','Land'),
        ('apartment','Apartment'),
        ('duplex', 'Duplex')
    )
    Title = models.CharField(max_length=200, default="Untitled")
    Description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, null = True)
    location = models.CharField(max_length=250, null=True, blank=True)
    Property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES, null=True, blank=True)
    bathroom = models.IntegerField(default=1) 
    bedroom = models.IntegerField(default=1)
    image = models.ImageField(upload_to='property_photos/', null = True)
    agent = models.ForeignKey(User,on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField( default=timezone.now)

    class Meta:
        verbose_name_plural = "properties"
    def __str__(self):
        return f'{self.Title} {self.price}'
    
from rest_framework import serializers
from .models import property

class propertyserializer(serializers.ModelSerializer):
    image = serializers.ImageField(required = False, allow_null = True)
    class Meta:
        model = property
        fields = '__all__'
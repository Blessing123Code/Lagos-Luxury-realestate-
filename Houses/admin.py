from django.contrib import admin
from  .models import UserProfile,property

admin.site.register(UserProfile)
@admin.register(property)
class propertyAdmin(admin.ModelAdmin):
    list_display = ('Title','price','Property_type','location','agent','created_at')
    list_filter = ('Property_type', 'created_at')
    search_fields = ('Title','location','Description','Property_type')
from django.urls import path
from . import views

urlpatterns = [
  path('api/properties/', views.Property_list_api, name='property-list-api'),
  path('api/properties/<int:pk>/', views.property_detail_api, name='property-detail-api'),
]
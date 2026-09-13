from rest_framework.decorators import api_view, parser_classes, permission_classes  #tells Django
from rest_framework.response import Response #packages our JSON data to send back over HTTP
from .models import property
from .serializers import propertyserializer
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@permission_classes([IsAuthenticatedOrReadOnly])
def Property_list_api(request):
    if request.method == 'GET':
        properties = property.objects.all().order_by('-created_at')

        location = request.GET.get('location')
        property_type = request.GET.get('property_type')
        max_price = request.GET.get('max_price')

        if location:
            properties = properties.filter(location__icontains=location)
        if property_type:
            properties = properties.filter(property_type__iexact=property_type)
        if max_price:
            properties = properties.filter(price__lte=max_price)

            
        serializer = propertyserializer(properties, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = propertyserializer(data=request.data)
        if serializer.is_valid():  # or serializer.is_valid()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def property_detail_api(request, pk):
    try:
        property_item = property.objects.get(pk=pk)
    except property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = propertyserializer(property_item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = propertyserializer(property_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        property_item.delete()
        return Response({'message': 'Property deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ProductSerializer
# Create your views here.
from .models import Product

class ProductViewSet(viewsets.ModelViewSet):
    queryset=Product.objects.all().order_by('id')
    serializer_class=ProductSerializer
    
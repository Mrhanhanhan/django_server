from django.urls import URLPattern, path
from game.views import index

urlpatterns = [
    path("",index, name="index")
]
from django.urls import path
from .views import insertar_inventario, get_inventarios,actualizar_inventario,eliminar_inventario

urlpatterns = [
    path('insertar', insertar_inventario),
    path('actualizar', actualizar_inventario),
    path('getInventarios', get_inventarios),
    path('eliminar/<int:id_inventario>', eliminar_inventario),

]

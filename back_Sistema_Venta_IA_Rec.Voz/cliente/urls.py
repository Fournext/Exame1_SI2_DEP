from django.urls import path
from .views import registrar_Cliente,obtener_clientes,obtener_cliente_nombre,actualizar_cliente,eliminar_cliente

urlpatterns = [
    path('registrar', registrar_Cliente),
    path('getclientes', obtener_clientes),
    path('getcliente/<str:nombre>', obtener_cliente_nombre),
    path('actualizar', actualizar_cliente),
    path('eliminar', eliminar_cliente),
]
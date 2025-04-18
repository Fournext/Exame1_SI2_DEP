from django.urls import path
from .views import login,register,agregar_permiso,actualizar_password,obtener_usuario_por_id,obtener_username_por_email

urlpatterns = [
    path('login', login, name='login'),
    path('register', register, name='register'),
    path('permisos', agregar_permiso),
    path('newPassword/<str:username>', actualizar_password),
    path('getUser/<int:id_usuario>', obtener_usuario_por_id),
    path('username_email/<str:email>', obtener_username_por_email),

]
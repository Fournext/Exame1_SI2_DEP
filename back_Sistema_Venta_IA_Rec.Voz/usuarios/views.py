from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .serializers import LoginSerializer, RegisterSerializer
from .utils import generate_jwt
from django.db import connection 
# Create your views here.

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            token = generate_jwt(user)
            return Response({'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        if (Usuario.objects.filter(username=data['username']).exists()):
            return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        nuevo_usuario = Usuario(
            username=data['username'],
            email=data['email'],
            tipo_usuario=data['tipo_usuario'],
            estado=data['estado']
        )
        nuevo_usuario.set_password(data['password'])
        nuevo_usuario.save()

        return Response({'mensaje': 'Usuario registrado con éxito'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def agregar_permiso(request):
    username = request.data.get('username')
    tipo_crear = request.data.get('crear')
    tipo_editar = request.data.get('editar')
    tipo_eliminar = request.data.get('eliminar')
    tipo_ver = request.data.get('ver')
    tipo_ventana = request.data.get('ventana')


    if not username:
        return Response({'error': 'El username y los permisos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL insertar_permisos(%s, %s, %s, %s, %s, %s)", 
                [username, tipo_ventana, tipo_crear, tipo_editar, tipo_eliminar, tipo_ver]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Permiso agregado con éxito'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def actualizar_password(request, username):
    # Obtener el nuevo password desde la petición
    nuevo_password = request.data.get('password')

    if not nuevo_password:
        return Response({'error': 'El nuevo password es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Buscar al usuario por el nombre de usuario
        usuario = Usuario.objects.get(username=username)
        
        # Actualizar el password del usuario
        usuario.set_password(nuevo_password)
        usuario.save()
        
        return Response({'mensaje': 'Contraseña actualizada con éxito'}, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def obtener_usuario_por_id(request, id_usuario):
    try:
        usuario = Usuario.objects.get(id=id_usuario)
        serializer = RegisterSerializer(usuario)  # Usa el serializer adecuado según los campos que quieras mostrar
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def obtener_username_por_email(request, email):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT obtener_username_por_email(%s)", [email])
            username = cursor.fetchone()[0]
            return Response({'username': username}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


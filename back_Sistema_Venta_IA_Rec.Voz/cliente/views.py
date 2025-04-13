from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente
from .serializers import ClienteSerializer
from django.db import connection 
# Create your views here.


@api_view(['POST'])
def registrar_Cliente(request):
    nombre_completo = request.data.get('nombre_completo')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    estado = request.data.get('estado')
    username = request.data.get('username')

    if Cliente.objects.filter(nombre_completo=nombre_completo).exists():
            return Response({'error': 'El Cliente ya existe'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL registrar_cliente(%s, %s, %s, %s, %s)", 
                [nombre_completo, direccion, telefono, estado, username]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Cliente agregado con éxito'}, status=status.HTTP_200_OK)



@api_view(['GET'])
def obtener_clientes(request):
    clientes = Cliente.objects.all()
    serializer = ClienteSerializer(clientes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_cliente_nombre(request, nombre):
    try:
        cliente = Cliente.objects.get(nombre_completo=nombre)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Cliente.DoesNotExist:
        return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def actualizar_cliente(request):
    nombre_completo = request.data.get('nombre_completo')
    direccion = request.data.get('direccion')
    telefono = request.data.get('telefono')
    estado = request.data.get('estado')
    id_usuario = request.data.get('id_usuario')
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL actualizar_cliente(%s, %s, %s, %s, %s)", 
                [nombre_completo, direccion, telefono, estado, id_usuario]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Cliente actualizado con éxito'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def eliminar_cliente(request):
    id_usuario = request.data.get('id_usuario')
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL eliminar_cliente_usuario(%s)", 
                [id_usuario]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Cliente y Usuario Eliminado con éxito'}, status=status.HTTP_200_OK)


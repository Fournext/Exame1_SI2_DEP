from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection 
# Create your views here.



@api_view(['POST'])
def insertar_producto(request):
    descripcion = request.data.get('descripcion')
    categoria = request.data.get('categoria')
    marca = request.data.get('marca')
    estado = request.data.get('estado')
    precio = request.data.get('precio')
    costo = request.data.get('costo')

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL insertar_producto(%s, %s, %s, %s, %s, %s)", 
                [descripcion, categoria, marca, estado, precio, costo]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Producto insertado con éxito'}, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def actualizar_producto(request, id_producto):
    descripcion = request.data.get('descripcion')
    categoria = request.data.get('categoria')
    marca = request.data.get('marca')
    estado = request.data.get('estado')
    precio = request.data.get('precio')
    costo = request.data.get('costo')
    print(request.data)
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL actualizar_producto(%s, %s, %s, %s, %s, %s, %s)", 
                [id_producto, descripcion, categoria, marca, estado,precio,costo]
            )
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Producto actualizado con éxito'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_productos(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_productos_todo()")
            columns = [col[0] for col in cursor.description]
            productos = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(productos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_producto(request, id_producto):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_producto_todo(%s)", [id_producto])
            columns = [col[0] for col in cursor.description]
            producto = dict(zip(columns, cursor.fetchone()))
        
        if producto:
            return Response(producto, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_productosFIltro(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_productos_activos()")
            columns = [col[0] for col in cursor.description]
            productos = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(productos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_productoFiltro(request, id_producto):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_producto_activo(%s)", [id_producto])
            columns = [col[0] for col in cursor.description]
            producto = dict(zip(columns, cursor.fetchone()))
        
        if producto:
            return Response(producto, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def eliminar_producto(request,id_producto):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL eliminar_producto(%s)", 
                [id_producto]
            )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'mensaje': 'Producto Eliminado con éxito'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def insertar_actualizar_imagen(request):
    try:
        id_producto = request.data.get('id_producto')
        url = request.data.get('url')

        # Validar que los datos no sean nulos
        if not id_producto or not url:
            return Response({'error': 'Faltan datos requeridos (id_producto o url).'}, status=status.HTTP_400_BAD_REQUEST)

        # Ejecutar el procedimiento
        with connection.cursor() as cursor:
            cursor.execute("CALL insertar_actualizar_imagen_producto(%s, %s)", [id_producto, url])

        return Response({'mensaje': 'Procedimiento ejecutado correctamente.'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def obtener_url_producto(request, id_producto):
    try:
        # Ejecutar la función en la base de datos
        with connection.cursor() as cursor:
            cursor.execute("SELECT obtener_url_producto(%s);", [id_producto])
            resultado = cursor.fetchone()  # Obtener el resultado de la función

        # Verificar si se obtuvo algún resultado
        if resultado and resultado[0]:
            return Response({'url': resultado[0]}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No se encontró la URL para el producto.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
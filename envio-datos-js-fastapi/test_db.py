import sqlite3
from database import init_db, insertar_producto, obtener_productos

# Inicializar la base de datos
print("Creando base de datos...")
init_db()

# Insertar un producto de prueba
print("Insertando producto...")
producto = insertar_producto("Laptop", 15000.0, "Laptop gaming")
print("Producto insertado:", producto)

# Ver todos los productos
print("Obteniendo productos...")
productos = obtener_productos()
print("Productos en la base:", productos)
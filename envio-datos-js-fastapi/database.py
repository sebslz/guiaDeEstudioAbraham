import sqlite3
from typing import Dict, List

def init_db():
    """Inicializa la base de datos y crea la tabla productos"""
    conn = sqlite3.connect('productos.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            descripcion TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def insertar_producto(nombre: str, precio: float, descripcion: str = "") -> Dict:
    """Inserta un nuevo producto en la base de datos"""
    # Paso 1: Conectar a la base de datos
    conn = sqlite3.connect('productos.db')
    cursor = conn.cursor()
    
    # Paso 2: Ejecutar la consulta INSERT
    cursor.execute(
        "INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)",
        (nombre, precio, descripcion)
    )
    
    # Paso 3: Obtener el ID del producto que acabamos de insertar
    producto_id = cursor.lastrowid
    
    # Paso 4: Guardar los cambios
    conn.commit()
    
    # Paso 5: Cerrar la conexión
    conn.close()
    
    # Paso 6: Retornar el producto como diccionario
    return {
        "id": producto_id,
        "nombre": nombre,
        "precio": precio,
        "descripcion": descripcion
    }

def obtener_productos() -> List[Dict]:
    """Obtiene todos los productos de la base de datos"""
    # Paso 1: Conectar a la base de datos
    conn = sqlite3.connect('productos.db')
    cursor = conn.cursor()
    # Paso 2: Ejecutar SELECT
    cursor.execute("SELECT * FROM productos")
    
    # Paso 3: Obtener todos los resultados
    filas = cursor.fetchall()
    
    # Paso 4: Cerrar conexión
    conn.close()
    
    # Paso 5: Convertir cada fila en diccionario
    productos = []
    for fila in filas:
        producto = {
            "id": fila[0],      # Primera columna
            "nombre": fila[1],  # Segunda columna  
            "precio": fila[2],  # Tercera columna
            "descripcion": fila[3]  # Cuarta columna
        }
        productos.append(producto)
    
    return productos
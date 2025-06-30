from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import init_db, insertar_producto, obtener_productos
from pydantic import BaseModel
import uvicorn

# Modelo para recibir datos
class ProductoRequest(BaseModel):
    nombre: str
    precio: float
    descripcion: str = ""

# Crear la aplicación FastAPI
app = FastAPI()

# Servir archivos estáticos (HTML, JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Inicializar base de datos al arrancar
@app.on_event("startup")
async def startup_event():
    init_db()

# Ruta principal - servir el HTML
@app.get("/")
async def read_root():
    return FileResponse('static/index.html')

# Endpoint para crear productos
@app.post("/productos")
async def crear_producto(producto: ProductoRequest):
    print(f"Recibiendo producto: {producto}")  # ← LOG AGREGADO
    try:
        nuevo_producto = insertar_producto(
            nombre=producto.nombre,
            precio=producto.precio,
            descripcion=producto.descripcion
        )
        print(f"Producto creado: {nuevo_producto}")  # ← LOG AGREGADO
        return nuevo_producto
    except Exception as e:
        print(f"Error al crear producto: {e}")  # ← LOG AGREGADO
        raise e

# Endpoint para listar productos
@app.get("/productos")
async def listar_productos():
    productos = obtener_productos()
    return productos

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
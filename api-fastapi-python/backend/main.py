from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

# Los datos (temporal para aprendizaje)
productos = [
    {"id": 1, "nombre": "Laptop", "precio": 999.99, "descripcion": "Laptop gaming"},
    {"id": 2, "nombre": "Mouse", "precio": 25.50, "descripcion": "Mouse inalámbrico"},
    {"id": 3, "nombre": "Teclado", "precio": 75.00, "descripcion": "Teclado mecánico"},
    {"id": 4, "nombre": "Tapete Gamming", "precio": 25.00, "descripcion": "Teclado gamming"}
]

# Nuevo endpoint
@app.get("/productos")
def obtener_productos():
    return productos
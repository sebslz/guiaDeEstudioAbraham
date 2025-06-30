from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from models import LoginData, Token, User
from database import authenticate_user
from auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from dependencies import get_current_user

# Crear la aplicación FastAPI
app = FastAPI(title="API con Rutas Protegidas", version="1.0.0")

# Configurar CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción especifica dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=Token)
async def login(login_data: LoginData):
    """
    Endpoint para autenticar usuario y generar token JWT
    """
    # Verificar credenciales
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@app.get("/perfil", response_model=User)
async def get_perfil(current_user: User = Depends(get_current_user)):
    """
    🔒 RUTA PROTEGIDA - Requiere token JWT válido
    Devuelve información del perfil del usuario autenticado
    """
    return current_user

@app.get("/")
async def root():
    """Endpoint público de prueba"""
    return {"message": "API funcionando correctamente"}
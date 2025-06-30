from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import verify_token
from database import get_user
from models import User

# Esquema para manejar tokens Bearer
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependencia que extrae y valida el token JWT del header Authorization
    """
    token = credentials.credentials  # Extrae el token del header "Bearer token"
    
    # Verifica el token y obtiene el username
    username = verify_token(token)
    
    # Busca el usuario en la base de datos
    user = get_user(username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Devuelve solo los datos públicos del usuario
    return User(
        username=user.username,
        email=user.email,
        full_name=user.full_name
    )
from models import UserInDB
from auth import get_password_hash
from auth import verify_password

# Base de datos simulada en memoria
fake_users_db = {
    "abraham": UserInDB(
        username="abraham",
        email="abraham@email.com",
        full_name="Abraham Desarrollador",
        hashed_password=get_password_hash("123456")
    ),
    "maria": UserInDB(
        username="maria",
        email="maria@email.com", 
        full_name="Maria González",
        hashed_password=get_password_hash("password123")
    )
}

def get_user(username: str):
    """Busca un usuario en la base de datos"""
    if username in fake_users_db:
        return fake_users_db[username]
    return None

def authenticate_user(username: str, password: str):
    """Autentica un usuario verificando username y password"""
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


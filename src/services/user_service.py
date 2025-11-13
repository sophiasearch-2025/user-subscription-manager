from passlib.context import CryptContext
from src.api.models import UserCreate, UserResponse
import uuid

# Configuración para encriptar contraseñas (Hashing)
# Usamos pbkdf2_sha256 que es más compatible y no tiene el error de longitud
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Simulación de Base de Datos (Aquí conectaríamos PostgreSQL después)
FAKE_USER_DB = []

class UserService:
    
    def get_password_hash(self, password: str) -> str:
        """Convierte texto plano a hash seguro."""
        # --- DEBUG: Imprimir qué estamos recibiendo ---
        print(f"DEBUG: Password recibido: '{password}' - Largo: {len(password)}")
        # ----------------------------------------------
        return pwd_context.hash(password)

    async def create_user(self, user_in: UserCreate) -> UserResponse:
        # 1. Verificar si el email ya existe (Lógica de negocio)
        for user in FAKE_USER_DB:
            if user["email"] == user_in.email:
                raise ValueError("El email ya está registrado")

        # 2. Encriptar la contraseña (Nunca guardar texto plano)
        hashed_password = self.get_password_hash(user_in.password)

        # 3. Crear el objeto usuario para guardar
        new_user_entry = {
            "id": str(uuid.uuid4()), # Generar ID único
            "full_name": user_in.full_name,
            "email": user_in.email,
            "hashed_password": hashed_password, # Guardamos el hash, no la pass real
            "is_active": True
        }

        # 4. Guardar en la "Base de Datos"
        FAKE_USER_DB.append(new_user_entry)
        print(f"💾 Usuario guardado: {new_user_entry}") # Log para ver que funciona

        # 5. Retornar respuesta (sin la contraseña)
        return UserResponse(
            id=new_user_entry["id"],
            full_name=new_user_entry["full_name"],
            email=new_user_entry["email"],
            is_active=new_user_entry["is_active"]
        )
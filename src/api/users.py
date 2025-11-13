from fastapi import APIRouter, HTTPException, status
from src.api.models import UserCreate, UserResponse
from src.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Sophia-Search Accounts"] # Etiqueta para la documentación
)

user_service = UserService()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_sophia_account(user_data: UserCreate):
    """
    API para crear una cuenta en Sophia-Search.
    Recibe: Nombre, Email, Password.
    Valida: Formato de email y longitud de contraseña.
    """
    try:
        # El servicio se encarga de encriptar y guardar
        new_user = await user_service.create_user(user_data)
        return new_user
    except ValueError as e:
        # Si el email ya existe, devolvemos error 400
        raise HTTPException(status_code=400, detail=str(e))
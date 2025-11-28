from typing import Optional

from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    cost_price: float
    selling_price: float
    category: Optional[str] = None
    stock_available: int
    units_sold: int
    customer_rating: Optional[float] = None


class ProductCreate(ProductBase):
    # Allow database to auto-generate product_id when creating via API.
    product_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    category: Optional[str] = None
    stock_available: Optional[int] = None
    units_sold: Optional[int] = None
    customer_rating: Optional[float] = None
    demand_forecast: Optional[float] = None
    optimized_price: Optional[float] = None


class ProductRead(ProductBase):
    product_id: int
    demand_forecast: Optional[float] = None
    optimized_price: Optional[float] = None

    class Config:
        orm_mode = True


class OptimizeRequest(BaseModel):
    product_id: int


class OptimizeResponse(BaseModel):
    product_id: int
    optimized_price: float


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user_id: int
    user_name: str
    email: str
    user_role: int


class RegisterRequest(BaseModel):
    user_name: str
    email: str
    password: str



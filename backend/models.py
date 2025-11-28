from sqlalchemy import Column, Integer, String, Float, Text

from .database import Base


class Product(Base):
    __tablename__ = "products"

    # Single primary key column – auto-incrementing product_id
    product_id = Column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    category = Column(String(255), nullable=True)
    stock_available = Column(Integer, nullable=False, default=0)
    units_sold = Column(Integer, nullable=False, default=0)
    customer_rating = Column(Float, nullable=True)
    demand_forecast = Column(Float, nullable=True)
    optimized_price = Column(Float, nullable=True)



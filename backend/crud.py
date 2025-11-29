from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas
from .ml import estimate_demand_forecast, predict_price


def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    return db.query(models.Product).offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: int) -> Optional[models.Product]:
    # product_id is the single primary key
    return (
        db.query(models.Product)
        .filter(models.Product.product_id == product_id)
        .first()
    )


def get_product_by_product_id(db: Session, product_id: int) -> Optional[models.Product]:
    return get_product_by_id(db, product_id)


def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    data = product.dict(exclude_unset=True)
    # If product_id is None auto-generate it.
    if data.get("product_id") is None:
        data.pop("product_id", None)
    db_product = models.Product(**data)

    if db_product.demand_forecast is None:
        db_product.demand_forecast = estimate_demand_forecast(db_product)

    # optimized_price call
    db_product.optimized_price = predict_price(db_product)

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(
    db: Session, db_product: models.Product, update_data: schemas.ProductUpdate
) -> models.Product:
    data = update_data.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(db_product, key, value)

    # If units_sold changed, keep demand_forecast in sync with our rule.
    if "units_sold" in data:
      db_product.demand_forecast = estimate_demand_forecast(db_product)

    # If key pricing inputs changed, recompute optimized_price.
    if any(key in data for key in ("cost_price", "selling_price", "units_sold")):
        db_product.optimized_price = predict_price(db_product)

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, db_product: models.Product) -> None:
    db.delete(db_product)
    db.commit()


# def upsert_product_from_row(db: Session, row: dict) -> models.Product:
#     """
#     Upsert helper used during CSV ingestion.
#     `row` is expected to use the CSV column names.
#     """
#     product_id = int(row["product_id"])
#     existing = get_product_by_product_id(db, product_id)

#     payload = schemas.ProductCreate(
#         product_id=product_id,
#         name=row["name"],
#         description=row.get("description"),
#         cost_price=float(row["cost_price"]),
#         selling_price=float(row["selling_price"]),
#         category=row.get("category"),
#         stock_available=int(row["stock_available"]),
#         units_sold=int(row["units_sold"]),
#         customer_rating=float(row["customer_rating"])
#         if row.get("customer_rating")
#         else None,
#         demand_forecast=float(row["demand_forecast"])
#         if row.get("demand_forecast")
#         else None,
#         optimized_price=float(row["optimized_price"])
#         if row.get("optimized_price")
#         else None,
#     )

#     if existing:
#         return update_product(
#             db,
#             existing,
#             schemas.ProductUpdate(**payload.dict(exclude={"product_id"})),
#         )

#     return create_product(db, payload)



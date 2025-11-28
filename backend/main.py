from typing import List

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db
from .ml import predict_price


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Price Optimization Tool")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/products", response_model=List[schemas.ProductRead])
def list_products(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return crud.get_products(db, skip=skip, limit=limit)


@app.get("/api/products/{product_id}", response_model=schemas.ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@app.post("/api/products", response_model=schemas.ProductRead)
def create_product(
    product: schemas.ProductCreate, db: Session = Depends(get_db)
):
    if product.product_id is not None:
        existing = crud.get_product_by_product_id(db, product.product_id)
        if existing:
            raise HTTPException(
                status_code=400, detail="product_id already exists"
            )
    return crud.create_product(db, product)


@app.put("/api/products/{product_id}", response_model=schemas.ProductRead)
def update_product(
    product_id: int,
    product_update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
):
    db_product = crud.get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return crud.update_product(db, db_product, product_update)


@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    crud.delete_product(db, db_product)
    return Response(status_code=204)


@app.post(
    "/api/products/{product_id}/optimize",
    response_model=schemas.OptimizeResponse,
)
def optimize_product_price(
    product_id: int, db: Session = Depends(get_db)
):
    db_product = crud.get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    optimized_price = predict_price(db_product)
    db_product.optimized_price = optimized_price
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return schemas.OptimizeResponse(
        product_id=db_product.product_id,
        optimized_price=optimized_price,
    )


@app.post("/api/ingest-from-csv")
def ingest_from_csv(db: Session = Depends(get_db)):
    """
    Helper endpoint to quickly load data from the provided CSV into PostgreSQL.
    """
    import csv
    from pathlib import Path

    csv_path = Path("product data.csv")
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="CSV file not found")

    with csv_path.open(mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            crud.upsert_product_from_row(db, row)
            count += 1

    return {"rows_ingested": count}


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)



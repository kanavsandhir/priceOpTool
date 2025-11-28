## Price Optimization Tool

This project is a simple end‑to‑end **Price Optimization Tool** built with:

- **Backend**: `FastAPI` + `PostgreSQL` + `SQLAlchemy`
- **Frontend**: `React` (Vite)
- **Data/ML**: `pandas` + `scikit-learn` (optional, with a rule‑based fallback)

The tool ingests the provided `product data.csv` file into PostgreSQL and exposes
APIs to browse products and generate optimized prices.

### Backend – FastAPI

**Run locally**

1. Create and configure a PostgreSQL database (for example):

   - **DB name**: `price_optimization`
   - **User**: `postgres`
   - **Password**: `postgres`

2. Set the `DATABASE_URL` environment variable (or change the default in
   `backend/database.py`):

   ```bash
   set DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/price_optimization
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the API server (from the project root):

   ```bash
   uvicorn backend.main:app --reload
   ```

5. Load data from `product data.csv`:

   - `POST http://localhost:8000/api/ingest-from-csv`

6. Once data is ingested, the ML model is trained automatically on startup and
   re-trained after ingestion.

**Key endpoints**

- `GET /api/health` – health check
- `GET /api/products` – list products
- `GET /api/products/{id}` – get a single product (DB primary key)
- `POST /api/products` – create a product
- `PUT /api/products/{id}` – update a product
- `POST /api/products/{id}/optimize` – generate and persist an optimized price
- `POST /api/ingest-from-csv` – ingest data from `product data.csv`

### Frontend – React (Vite)

The frontend lives in the `frontend` folder and assumes the API is running on
`http://localhost:8000` with `/api` routes.

**Run locally**

From the `frontend` directory:

```bash
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:5173` and is pre‑configured
to proxy `/api` calls to the FastAPI backend.

### Notes

- The provided `product data.csv` is used both to **seed the database** and to
  **train** a simple regression model that predicts `optimized_price`.
- If training fails or there is not enough data, the system falls back to a
  **rule‑based heuristic** that adjusts price based on cost, demand forecast,
  and customer rating.



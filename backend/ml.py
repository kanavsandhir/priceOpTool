from . import models


def predict_price(product: models.Product) -> float:
    """
    Predict an optimized price for the given product using a
    simple, fully explainable rule that assumes:

    demand_forecast = units_sold

    1. Start from a base price that guarantees at least 20% margin.
    2. Adjust that base price based on demand bands derived from units_sold.
    """
    if product.cost_price is None or product.selling_price is None:
        return product.selling_price or product.cost_price or 0.0

    base_price = max(product.selling_price, product.cost_price * 1.20)

    units = product.units_sold or 0

    if units >= 200:
        optimized = base_price * 1.10  # +10% 
    elif units >= 100:
        optimized = base_price * 1.05  # +5% 
    else:
        optimized = base_price * 0.95  # -5% 

    return round(optimized, 2)


def estimate_demand_forecast(product: models.Product) -> float:
    """
    Estimate demand forecast for a new / updated product.

    Per the simplified assumption, we set:

        demand_forecast = units_sold
    """
    units = product.units_sold or 0
    return float(units)



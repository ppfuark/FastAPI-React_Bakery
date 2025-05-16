from fastapi import APIRouter
from api.v1.routes import card_routes, product_routes

api_router = APIRouter()

api_router.include_router(card_routes.router, prefix="", tags=["Card"])
api_router.include_router(product_routes.router, prefix="", tags=["Product"])

from typing import List
from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.all_models import Card, CardProduct, Product
from schemas.schemas import CardCreate, CardResponse, CardProductCreate, CardProductResponse
from core.deps import get_session

router = APIRouter(prefix="/cards")

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CardResponse)
async def post_card(card: CardCreate, db: AsyncSession = Depends(get_session)):
    new_card = Card(**card.dict())
    db.add(new_card)
    await db.commit()
    await db.refresh(new_card)
    return new_card

@router.get("/", response_model=List[CardResponse])
async def get_cards(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Card))
    return result.scalars().all()

@router.get("/{card_id}", response_model=CardResponse)
async def get_card(card_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Card).filter(Card.id == card_id))
    card = result.scalar_one_or_none()
    if card:
        return card
    raise HTTPException(detail="Card not found!", status_code=status.HTTP_404_NOT_FOUND)

@router.post("/{card_id}/products", response_model=CardProductResponse)
async def add_product_to_card(card_id: int, card_product: CardProductCreate, db: AsyncSession = Depends(get_session)):
    card_result = await db.execute(select(Card).filter(Card.id == card_id))
    card = card_result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    product_result = await db.execute(select(Product).filter(Product.id == card_product.product_id))
    product = product_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item_result = await db.execute(
        select(CardProduct).filter(CardProduct.card_id == card_id, CardProduct.product_id == card_product.product_id)
    )
    existing_item = existing_item_result.scalar_one_or_none()

    if existing_item:
        existing_item.quantity += card_product.quantity
    else:
        existing_item = CardProduct(card_id=card_id, product_id=card_product.product_id, quantity=card_product.quantity)
        db.add(existing_item)

    await db.commit()
    await db.refresh(existing_item)
    return existing_item

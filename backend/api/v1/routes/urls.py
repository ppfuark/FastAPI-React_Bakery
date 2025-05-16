from typing import List
from fastapi import APIRouter, status, Depends, HTTPException, Response

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models import all_models
from schemas import schemas
from core.deps import get_session

router = APIRouter()

@router.post("/cards", status_code=status.HTTP_201_CREATED, response_model=schemas.CardResponse)
async def post_card(card: all_models.Card, db:AsyncSession = Depends(get_session)):
    new_card = all_models.Card(name=card.name, is_active=card.is_active)

    db.add(new_card)
    
    await db.commit()
    return new_card

@router.get('/cards', response_model=List[all_models.Card])
async def ger_cards(db: AsyncSession = Depends(get_session)):
    async with db:
        query = select(all_models.Card)
        result = await db.execute(query)

        cards: List[all_models.Card] = result.scalars().all()

        return cards
    
@router.get('cards/{card_id}', response_model=all_models.Card, status_code=status.HTTP_200_OK)
async def get_card(card_id:int, db: AsyncSession = Depends(get_session)):
    async with db:
        query = select(all_models.Card).filter(all_models.Card.id == card_id)
        result = await db.execute(query)

        card = result.scalar_one_or_none()

        if card:
            return card
        else: 
            raise HTTPException(detail="Card not found!", status_code=status.HTTP_404_NOT_FOUND)
        

@router.put("/{card_id}", response_model=all_models.Card, status_code=status.HTTP_202_ACCEPTED)
async def put_card(card_id:int, card: schemas.CardResponse, db: AsyncSession = Depends(get_session)):
    async with db:
        query = select(all_models.Card).filter(all_models.Card.id == card_id)
        result = await db.execute(query)

        card = result.scalar_one_or_none()

        card_up = result.scalar_one_or_none()

        if card_up:
            card_up.is_active = card.is_active

            await db.commit()
            return card_up
        else:
            raise HTTPException(detail="Card not found!", status_code=status.HTTP_404_NOT_FOUND)
        
@router.delete("cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(card_id: int, db: AsyncSession = Depends(get_session)):
    async with db:
        query = select(all_models.Card).filter(all_models.Card.id == card_id)
        result = await db.execute(query)

        card = result.scalar_one_or_none()

        if card:
            await db.delete(card_id)
            await db.commit()
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        else:
            raise HTTPException(detail="Card not found!", status_code=status.HTTP_404_NOT_FOUND)
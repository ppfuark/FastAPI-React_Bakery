from sqlalchemy import Column, Integer, ForeignKey
from core.configs import settings
from sqlalchemy.orm import relationship

#============================================= CardProduct ========================================================#
class CardProduct(settings.DBBaseModel):
    __tablename__ = 'card_products'
    
    id = Column(Integer, primary_key=True)
    card_id = Column(Integer, ForeignKey('cards.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer)
    
    
    card = relationship("Card", back_populates="products")
    product = relationship("Product", back_populates="cards")
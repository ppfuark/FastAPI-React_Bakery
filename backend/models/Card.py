from sqlalchemy import Column, Integer, String
from core.configs import settings
from sqlalchemy.orm import relationship

#============================================= Card ========================================================#
class Card(settings.DBBaseModel):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    is_active = Column(Integer, default=1)  
    
    
    products = relationship("CardProduct", back_populates="card")
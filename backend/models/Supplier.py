from sqlalchemy import Column, Integer, String
from core.configs import settings
from sqlalchemy.orm import relationship
from . import all_models

#============================================= Supplier ========================================================#
class Supplier(settings.DBBaseModel):
    __tablename__ = 'suppliers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    
    
    products = relationship("Product", secondary=all_models.product_supplier, back_populates="suppliers")
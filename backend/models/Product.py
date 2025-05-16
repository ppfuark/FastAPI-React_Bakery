from sqlalchemy import Column, Integer, String, Float
from core.configs import settings
from sqlalchemy.orm import relationship
from models.association_tables import product_supplier, sale_product


#============================================= Product ========================================================#
class Product(settings.DBBaseModel):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(100))
    price = Column(Float)
    quantity = Column(Integer)  
    
    sales = relationship("Sale", secondary=sale_product, back_populates="products")
    suppliers = relationship("Supplier", secondary=product_supplier, back_populates="products")
    cards = relationship("CardProduct", back_populates="product")
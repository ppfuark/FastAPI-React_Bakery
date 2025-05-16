from sqlalchemy import Column, Integer, ForeignKey, Float
from core.configs import settings
from sqlalchemy.orm import relationship
from . import all_models

#============================================= Sale ========================================================#
class Sale(settings.DBBaseModel):
    __tablename__ = 'sales'

    id = Column(Integer(), primary_key=True, index=True)
    total = Column(Float)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    card_id = Column(Integer, ForeignKey('cards.id'))

    employee = relationship("Employee", back_populates="sales")
    card = relationship("Card", back_populates="sales")
    products = relationship("Product", secondary=all_models.sale_product, back_populates="sales")

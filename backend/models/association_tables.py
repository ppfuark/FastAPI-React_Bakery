# models/association_tables.py
from sqlalchemy import Column, Integer, ForeignKey, Table
from core.configs import settings

Base = settings.DBBaseModel

product_supplier = Table(
    'product_supplier', Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id')),
    Column('supplier_id', Integer, ForeignKey('suppliers.id'))
)

sale_product = Table(
    'sale_product', Base.metadata,
    Column('sale_id', Integer, ForeignKey('sales.id')),
    Column('product_id', Integer, ForeignKey('products.id')),
    Column('quantity', Integer)
)

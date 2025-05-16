from sqlalchemy import Column, Integer, String
from core.configs import settings
from sqlalchemy.orm import relationship


#============================================= Employee ========================================================#
class Employee(settings.DBBaseModel):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    role = Column(String(100))  
    
    sales = relationship("Sale", back_populates="employee")
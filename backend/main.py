from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import Table  
import uvicorn
from typing import List
from fastapi.middleware.cors import CORSMiddleware


from models import Base, Product, Card, Employee, Supplier, Sale, CardProduct, engine, sale_product  
from schemas import (
    ProductCreate, ProductResponse, ProductUpdate,
    CardCreate, CardResponse, CardProductCreate, CardProductResponse,
    EmployeeCreate, EmployeeResponse,
    SupplierCreate, SupplierResponse,
    SaleCreate, SaleResponse
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/')
def hello_world():
    return {'message': 'E-Commerce System API'}


@app.post('/products/', response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get('/products/', response_model=List[ProductResponse])
def read_products(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Product).offset(skip).limit(limit).all()

@app.get('/products/{product_id}', response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put('/products/{product_id}', response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@app.post('/cards/', response_model=CardResponse)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    db_card = Card(**card.model_dump())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.get('/cards/', response_model=List[CardResponse])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Card).offset(skip).limit(limit).all()

@app.get('/cards/{card_id}', response_model=CardResponse)
def read_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@app.post('/cards/{card_id}/products/', response_model=CardProductResponse)
def add_product_to_card(
    card_id: int, 
    card_product: CardProductCreate, 
    db: Session = Depends(get_db)
):
    card = db.query(Card).filter(Card.id == card_id).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    
    product = db.query(Product).filter(Product.id == card_product.product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing_item = db.query(CardProduct).filter(
        CardProduct.card_id == card_id,
        CardProduct.product_id == card_product.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += card_product.quantity
    else:
        existing_item = CardProduct(
            card_id=card_id,
            product_id=card_product.product_id,
            quantity=card_product.quantity
        )
        db.add(existing_item)
    
    db.commit()
    db.refresh(existing_item)
    return existing_item


@app.post('/employees/', response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.get('/employees/', response_model=List[EmployeeResponse])
def read_employees(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Employee).offset(skip).limit(limit).all()


@app.post('/suppliers/', response_model=SupplierResponse)
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = Supplier(name=supplier.name)
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    
    for product_id in supplier.product_ids:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            db_supplier.products.append(product)
    
    db.commit()
    return db_supplier

@app.get('/suppliers/', response_model=List[SupplierResponse])
def read_suppliers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).offset(skip).limit(limit).all()
    return suppliers


@app.post("/sales/", response_model=SaleResponse)
def create_sale(sale_data: dict, db: Session = Depends(get_db)):
    try:
        
        employee = db.query(Employee).filter(Employee.id == sale_data["employee_id"]).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        card = db.query(Card).filter(Card.id == sale_data["card_id"]).first()
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")

        
        new_sale = Sale(employee_id=sale_data["employee_id"], card_id=sale_data["card_id"], total=0.0)
        db.add(new_sale)
        db.commit()
        db.refresh(new_sale)

        total = 0.0

        
        for item in sale_data.get("products", []):
            product = db.query(Product).filter(Product.id == item["product_id"]).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product with ID {item['product_id']} not found")

            
            if product.quantity < item["quantity"]:
                raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.id}")

            product.quantity -= item["quantity"]
            total += product.price * item["quantity"]

            
            db.execute(sale_product.insert().values(sale_id=new_sale.id, product_id=product.id, quantity=item["quantity"]))

        
        new_sale.total = total
        db.commit()
        db.refresh(new_sale)

        return new_sale  

    except Exception as e:
        db.rollback()
        print(f"Internal error: {e}")
        raise HTTPException(status_code=500, detail="Internal error")
    
    

@app.get('/sales/', response_model=List[SaleResponse])
def read_products(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Sale).offset(skip).limit(limit).all()

@app.get("/sales/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    
    sale = db.query(Sale).filter(Sale.id == sale_id).first()

    
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    
    sale_with_employee_card = db.query(Sale, Employee, Card).\
        filter(Sale.id == sale_id).\
        join(Employee, Employee.id == Sale.employee_id).\
        join(Card, Card.id == Sale.card_id).\
        first()
    
    
    if not sale_with_employee_card:
        raise HTTPException(status_code=404, detail="Sale details (employee or card) not found")
    
    
    products = db.query(Product).\
        join(sale_product, sale_product.c.product_id == Product.id).\
        filter(sale_product.c.sale_id == sale_id).\
        all()
    
    
    sale_data = sale_with_employee_card[0]
    employee_data = sale_with_employee_card[1]
    card_data = sale_with_employee_card[2]

    
    sale_response = SaleResponse(
        id=sale_data.id,
        total=sale_data.total,
        employee=EmployeeResponse(id=employee_data.id, name=employee_data.name, role=employee_data.role),
        products=[ProductResponse(id=product.id, name=product.name, description=product.description, price=product.price, quantity=product.quantity) for product in products],
        card=CardResponse(id=card_data.id, name=card_data.name, is_active=card_data.is_active)
    )

    return sale_response

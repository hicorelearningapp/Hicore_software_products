from pydantic import BaseModel
from typing import List, Optional

# ============================================================
# Medicine Type Schemas
# ============================================================
class MedicineTypeBase(BaseModel):
    MedicineType: Optional[str]
    ImgUrl: Optional[str]

    class Config:
        from_attributes = True


class MedicineTypeCreate(MedicineTypeBase):
    MedicineType: str


class MedicineTypeUpdate(MedicineTypeBase):
    pass


class MedicineTypeRead(MedicineTypeBase):
    MedicineTypeId: int


# ============================================================
# Medicine Category Schemas
# ============================================================
class MedicineCategoryBase(BaseModel):
    MedicineTypeId: Optional[int]
    Category: Optional[str]
    ImgUrl: Optional[str]

    class Config:
        from_attributes = True


class MedicineCategoryCreate(MedicineCategoryBase):
    MedicineTypeId: int
    Category: str


class MedicineCategoryUpdate(MedicineCategoryBase):
    pass


class MedicineCategoryRead(MedicineCategoryBase):
    MedicineCategoryId: int


# ------------------------------------------------
# Medicine Schemas
# ------------------------------------------------
class MedicineBase(BaseModel):
    Name: Optional[str]
    GenericName: Optional[str]
    DosageForm: Optional[str]
    Strength: Optional[str]
    Manufacturer: Optional[str]

    PrescriptionRequired: Optional[bool] = False
    Size: Optional[str]
    UnitPrice: Optional[float]
    TherapeuticClass: Optional[str]
    ImgUrl: Optional[str]

    # Categories: Optional[List[str]] = []
    Categories: Optional[str]

    class Config:
        from_attributes = True


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(MedicineBase):
    pass


class MedicineRead(MedicineBase):
    MedicineId: int

    @classmethod
    def from_orm_with_categories(cls, obj):
        # convert comma-separated string back to list
        data = obj.__dict__.copy()
        # if data.get("Categories"):
        #     data["Categories"] = data["Categories"].split(",")
        # else:
        #     data["Categories"] = []
        return cls(**data)


# ============================================================
# Medicine Info Schemas
# ============================================================
class MedicineInfoBase(BaseModel):
    MedicineId: Optional[int]
    QuickFacts: Optional[str]
    AlternateMedicines: Optional[str]
    SideEffects: Optional[str]
    HowWorks: Optional[str]
    Notes: Optional[str]
    Uses: Optional[str]
    Precautions: Optional[str]
    GeneralGuide: Optional[str]

    class Config:
        from_attributes = True


class MedicineInfoCreate(MedicineInfoBase):
    MedicineId: int


class MedicineInfoUpdate(MedicineInfoBase):
    pass


class MedicineInfoRead(MedicineInfoBase):
    MedicineInfoId: int

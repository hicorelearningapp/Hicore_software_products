from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
# Customer
from .api.customer.customer_api import CustomerAPI, AddressAPI
from .api.customer.medicine_api import MedicineAPI, MedicineCategoryAPI, MedicineInfoAPI, MedicineTypeAPI
from .api.customer.cart_api import CartAPI
from .api.customer.order_api import OrderAPI, OrderItemAPI
from .api.customer.prescription_api import PrescriptionAPI
from .api.customer.customer_notification_api import CustomerNotificationAPI
from .api.customer.lap_api import LabAPI, TestAPI, AppointmentAPI
from .api.customer.doctor_api import DoctorAPI, DoctorAppointmentAPI

# Retailer
from .api.retailer.retailer_api import RetailerAPI
from .api.retailer.retailer_inventory_api import RetailerInventoryAPI
from .api.retailer.retailer_order_api import RetailerOrderAPI, RetailerOrderItemAPI
from .api.retailer.retailer_report_api import RetailerReportAPI
from .api.retailer.retailer_dashboard_api import RetailerDashboardAPI
from .api.retailer.customer_invoice_api import CustomerInvoiceAPI
from .api.retailer.retailer_notification_api import RetailerNotificationAPI


# Distributor
from .api.distributor.distributor_api import DistributorAPI
from .api.distributor.distributor_notification_api import DistributorNotificationAPI
from .api.distributor.distributor_inventory_api import DistributorInventoryAPI
from .api.distributor.retailer_invoice_api import RetailerInvoiceAPI
from .api.distributor.distributor_report_api import DistributorReportAPI
from .api.distributor.distributor_dashboard_api import DistributorDashboardAPI
from .api.distributor.pharma_order_api import PharmaOrderAPI




app = FastAPI(title="Medical App API list")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

app.mount("/Images", StaticFiles(directory="Images"), name="Images")


# Customer
customer_api = CustomerAPI()
address_api = AddressAPI()
customer_notification_api = CustomerNotificationAPI()
medicine_type_api = MedicineTypeAPI()
medicine_category_api = MedicineCategoryAPI()
medicine_api = MedicineAPI()
medicine_info_api = MedicineInfoAPI()
cart = CartAPI()
order_api = OrderAPI()
order_item_api = OrderItemAPI()
prescription = PrescriptionAPI()
lab_api = LabAPI()
test_api = TestAPI()
appointment_api = AppointmentAPI()
doctor_api = DoctorAPI()
doctor_appointment_api = DoctorAppointmentAPI()

# Retailer
retailer_api = RetailerAPI()
retailer_inventory_api = RetailerInventoryAPI()
retailer_order_api = RetailerOrderAPI()
retailer_order_item_api = RetailerOrderItemAPI()
retailer_report_api = RetailerReportAPI()
retailer_dashboard_api = RetailerDashboardAPI()
customer_invoice_api = CustomerInvoiceAPI()
retailer_notification_api = RetailerNotificationAPI()


# Distributor
distributor_api = DistributorAPI()
distributor_notification_api = DistributorNotificationAPI()
distributor_inventory_api = DistributorInventoryAPI()
distributor_order_api = DistributorAPI()
retailer_invoice_api = RetailerInvoiceAPI()
distributor_report_api = DistributorReportAPI()
distributor_dashboard_api = DistributorDashboardAPI()
pharma_order_api = PharmaOrderAPI()



# Customer
app.include_router(medicine_api.router, tags=["Medicine"])
app.include_router(medicine_type_api.router, tags=["Medicine Type"])
app.include_router(medicine_info_api.router, tags=["Medicine Info"])
app.include_router(medicine_category_api.router, tags=["Medicine Category"])
app.include_router(cart.router, tags=["Cart"])
app.include_router(order_api.router, tags=["Orders"])
app.include_router(order_item_api.router, tags=["Order Items"])
app.include_router(prescription.router, tags=["Prescription"])
app.include_router(customer_api.router, tags=["Customer"])
app.include_router(address_api.router, tags=["Address"])
app.include_router(customer_notification_api.router, tags=["Customer Notifications"])
app.include_router(lab_api.router, tags=["Lap"])
app.include_router(test_api.router, tags=["Test"])
app.include_router(appointment_api.router, tags=["Appoinment"])
app.include_router(doctor_api.router, tags=["Doctor"])
app.include_router(doctor_appointment_api.router, tags=["Doctor Appoinment"])


# Retailer
app.include_router(retailer_dashboard_api.router, tags=["Retailer Dashboard"])
# app.include_router(retailer_inventory_api.router, tags=["Retailer Inventory"])
app.include_router(retailer_order_api.router, tags=["Retailer Orders"])
app.include_router(retailer_order_item_api.router, tags=["Retailer Order Items"])
app.include_router(customer_invoice_api.router, tags=["Retailer Invoices"])
app.include_router(retailer_report_api.router, tags=["Retailer Reports"])
app.include_router(retailer_api.router, tags=["Retailer"])
app.include_router(retailer_notification_api.router, tags=["Retailer Notifications"])



# Distributor
app.include_router(distributor_api.router, tags=["Distributor"])
app.include_router(distributor_notification_api.router, tags=["Distributor Notification"])
# app.include_router(distributor_inventory_api.router, tags=["Distributor Inventory"])
app.include_router(distributor_order_api.router, tags=["Distributor Orders"])
app.include_router(retailer_invoice_api.router, tags=["Distributor Invoices"])
app.include_router(distributor_report_api.router, tags=["Distributor Report"])
app.include_router(distributor_dashboard_api.router, tags=["Distributor Dashboard"])
# app.include_router(pharma_order_api.router, tags=["Pharma Orders"])




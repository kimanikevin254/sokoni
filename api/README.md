# SOKONI

A comprehensive ecommerce API leveraging the microservices architecture.

## Microservices:

- User Service: Handles user authentication, registration, profile management, and vendor/role management (e.g., customer, admin, vendor). Use JWT for authentication and role-based access control.

- Product Service: Manages the catalog of products, including CRUD operations for products, categories, inventory management, and product listing by vendors.

- Order Service: Deals with orders placed by customers, order statuses, payment integration, and order fulfillment processes.

- Payment Service: Manages payment processing, transaction logs, refunds, and integration with third-party payment gateways (e.g., Stripe, PayPal).

- Notification Service: Sends notifications like order confirmations, shipping updates, and promotional emails/messages to customers and vendors using email, SMS, or push notifications.
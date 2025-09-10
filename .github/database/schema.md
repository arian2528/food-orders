# Database Schema for Food Order Management App

This document describes the database schema and entity relationships for the Food Order Management App. It is intended to guide the implementation of the Prisma schema and ensure a robust, scalable data model.

## Entities

### Authenticated User
- Represents a person who can log in, managed by the Auth proxy service.
- Has a role stored in the Auth service (e.g., `ADMIN`, `SELLER`, `CLIENT`).

### Client
- Represents a business or buyer.
- Has business details (name, contact info, etc.).
- Has id, name, address, phone, email.
- Has many authenticated users (role: CLIENT) referenced by Auth user IDs.
- Has many Orders.
- Has order confirmation and notification settings.
- Has one Seller.

### Seller
- Represents a sales representative.
- Can be managed by Admins.
- Has many Products (many-to-many).
- Has many Orders (1-to-many).
- Has schedules (availability, etc.).
- Has many Clients (1-to-many)
- Has many authenticated users (role: SELLER) referenced by Auth user IDs.

### Product
- Represents a food item or product.
- Has id, name, description, unit (e.g., 'case', 'pk').
- Can be associated with many Sellers (many-to-many).
- Can be part of many Orders via OrderItems.

### Order
- Represents a food order placed by a Client.
- Has id, clientId, status, items, createdAt.
- Belongs to a Client.
- Belongs to a Seller.
- Has many OrderItems.
- Has status, confirmation/cancellation logic, timestamps.

### OrderItem
- Represents a product within an Order.
- Has productId, quantity, confirmed (boolean).
- Belongs to an Order.
- Belongs to a Product.

### PendingOrder
- Represents a pending order for a client.
- Has clientId, status, notes.

### Schedule
- Represents availability for Seller.
- Belongs to a Seller.
- Uses enums and compound unique constraints for time slots.

### ChatMessage
- Represents a message in real-time chat.
- Belongs to an authenticated user (referenced by Auth user ID).
- Can be associated with an Order or general chat.
- Belongs to a Seller.
- Follows the relation between Clients & Sellers

## Relations
- **Authenticated User–Client:** Many authenticated users (role: CLIENT, referenced by Auth user ID) belong to one Client. Store Auth user IDs in the Client entity or as a reference field.
- **Client–Order:** One Client has many Orders.
- **Seller–Product:** Many-to-many (Seller can sell many Products; Product can be sold by many Sellers).
- **Seller–Client:** Sellers have many Clients (by clientId).
- **Seller–Order:** One Seller has many Orders.
- **Seller–Schedule:** One Seller has many Schedules.
- **Order–OrderItem:** One Order has many OrderItems.
- **OrderItem–Product:** Each OrderItem references one Product.
- **Order–Seller:** Each Order is assigned to one Seller.
- **Order–Client:** Each Order is placed by one Client.
- **ChatMessage–Authenticated User:** Each ChatMessage is sent by an authenticated user (referenced by Auth user ID).
- **ChatMessage–Order:** (optional) Can be linked to an Order for order-specific chat.
- **Client–Seller:** One Seller has many Clients.
- **PendingOrder–Client:** Each PendingOrder is assigned to a Client.

## Notes
- All user references in the database should use Auth user IDs, not local User IDs.
- User roles and permissions are managed via the Auth proxy service.
- Seller, Client, Product, Order, OrderItem, and PendingOrder should be reflected in the Prisma schema.
- When querying or creating entities related to users, use Auth user ID and role metadata for lookups and access control.
- Admins can manage Sellers and view analytics.
- All entities are managed via Prisma/Postgres.

Full-Stack Food Order App: Development Plan
This document provides a detailed set of instructions for building a full-stack food order management application. The plan is broken down into key phases, from project setup to feature implementation, designed to be followed step-by-step.

Non-Functional Requirements
Responsive Interface: The application must be fully responsive, providing an optimal user experience on desktops, tablets, and mobile devices. Layouts, typography, and interactive elements should adapt gracefully to different screen sizes.

Theme Management: The user interface should support both a dark mode and a light mode, with a toggle button or a system-based preference.

1. Project Setup and Core Technologies
Next.js App: Initialize a new Next.js project using create-next-app. Configure it with TypeScript and Tailwind CSS for styling. The project should use the modern App Router for best practices and future-proofing.

UI Components: Review UI preferences on ./ui-preferences.md

Vercel Deployment: Set up the project for deployment on Vercel. Ensure environment variables are configured correctly for both development and production.

Database:
For details on the selected database management system (PostgreSQL) and ORM (Prisma) for this project, see `database/dbms.md`.

Migrations & Seeding:
For instructions on managing schema migrations and seeding your database, see `.github/database/migrations.md`.

Authentication & User Management:
You have two main options for implementing authentication and user management as an API gateway (auth proxy) for this application:

1. **Better Auth Proxy API** (`.github/auth/auth-2bc-betterAuth.md`):
   - Implements a standalone authentication proxy using the Hono web framework and Better Auth library.
   - Acts as a centralized API gateway for authentication, authorization, and user data, suitable for microservices and SSO scenarios.
   - Offers flexibility to run as a separate service, supports social sign-in, 2FA, and can be deployed independently of the main Next.js app.
   - See `.github/auth/auth-2bc-betterAuth.md` for setup, integration, and deployment details.

2. **Clerk Proxy API** (`.github/auth/auth-b2c-clerk.md`):
   - Uses Clerk, a managed authentication provider, as the API gateway for authentication and user management.
   - Clerk provides a dedicated Next.js SDK, specifically designed for seamless integration with Next.js projects. This SDK simplifies authentication flows, session management, and role-based access control, and offers built-in UI components for sign-in, sign-up, and user profile management.
   - Clerk handles oAuth, passwordless, and multi-factor authentication out of the box, and is ideal for teams seeking a robust, low-maintenance, and Next.js-optimized solution.
   - See `.github/auth/auth-b2c-clerk.md` for implementation steps and best practices.

> **Note:** Only one Auth proxy API should be active at a time. All API endpoints in the Next.js app will be proxied through the selected Auth API gateway to provide security, enforce user role-based access, and ensure a consistent authentication layer across all services. For implementation details and available proxy options, see the documentation in the `auth` directory.

For a comprehensive overview and guidance on choosing an authentication process for modern web apps, see this video: [Choosing Authentication for Your Next.js App](https://www.youtube.com/watch?v=lxslnp-ZEMw). It is a highly recommended source for understanding the pros and cons of different authentication providers and strategies.

2. Database Schema
All information about the database schema, entities, and relationships has been moved to `database/schema.md`.

**Summary:**
- The schema covers all core entities: Authenticated User, Client, Seller, Product, Order, OrderItem, PendingOrder, Schedule, and ChatMessage.
- It details entity relationships (e.g., many-to-many, one-to-many) and how user references are managed via the Auth proxy service.
- Notes on using Auth user IDs, role metadata, and Prisma/Postgres best practices are included.

For full details, see `database/schema.md`.

## Migrations and Seeding (Recommended)
Migrations and seeding are essential practices for managing SQL database projects:
- **Migrations** allow you to version and apply schema changes safely across all environments, ensuring consistency and traceability.
- **Seeding** lets you populate your database with initial or test data, which is useful for development, testing, and demo purposes.

For this project, see `database/migrations.md` for:
- How to create, apply, and manage Prisma migrations
- How to seed your database with initial data
- Best practices for keeping your schema and data in sync

3. API Routes and Backend Logic
Develop the following API endpoints under the /api directory using Route Handlers for the App Router. This approach centralizes API logic and allows for clear separation of concerns.

/app/api/products/route.ts:

POST handler: Allow only SELLER users to add a new product.

GET handler: Allow all authenticated users to view all products.

/app/api/products/[id]/route.ts:

PUT or PATCH handler: Allow only SELLER users to update a product's details.

Crucial Logic: Implement a check to ensure only the SELLER role can modify the price field.

/app/api/orders/route.ts:

POST handler: Allow only BUYER users to place a new order. The backend logic will set the initial status to PENDING and, if the buyer's orderConfirmationMethod is AUTOMATIC, set the confirmationDeadline to orderDate plus a predefined time window (e.g., 5-10 minutes). This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

GET handler:

If the user is a BUYER, return only their own orders.

If the user is a seller or ADMIN, return all orders for analysis.

/app/api/orders/[id]/route.ts:

PUT or PATCH handler: Allow ADMIN or seller to update an order's status (e.g., PENDING to COMPLETED). This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

GET handler: Retrieve a single order and its details.

/app/api/orders/[id]/placed/route.ts:

PUT or PATCH handler: Only accessible by the buyer (client) who owns the order. This endpoint will change the order's status from PENDING to PLACED, but only for orders set to the MANUAL confirmation method. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

/app/api/orders/[id]/cancel/route.ts:

PUT or PATCH handler: Only accessible by the buyer who owns the order. This endpoint will change the order's status from PENDING to CANCELED. This can only be done if the order's confirmationDeadline has not passed. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

/app/api/schedule/route.ts:

PUT handler: Allow only seller users to set the order schedule, including days of the week and specific hours. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

/app/api/chat/schedule/route.ts:

PUT handler: Allow only seller users to set the chat schedule. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

/app/api/chat/messages/route.ts:

POST handler: Allow BUYER and seller users to send a new chat message. The server must check the ChatSchedule to ensure the chat is open before allowing a message to be sent. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

GET handler: Retrieve a conversation history between a specific buyer and seller.

/app/api/order-confirmation-settings/route.ts:

PUT handler: Allow only seller users to set the orderConfirmationMethod for each BUYER. This endpoint must be idempotent (see "Idempotency and Transaction Safety" section).

4. Frontend: UI/UX and Conditional Rendering
Build the user interface (UI) with distinct pages and components for each user role, leveraging shadcn/ui and Tailwind CSS. Use the app directory for all pages and layouts.

Login Page: A simple login form.

Dashboard (/app/dashboard/page.tsx):

Conditional Rendering: Based on the user's role, display the appropriate content. Data for these pages should be fetched using getServerSideProps for authenticated content.

BUYER View: A list of available products with icons. Clicking an icon or the product name should open a modal with a larger image and a detailed description (if available). The form to place an order will have an input for a general order message.

seller View: A list of all products with links to an "Edit Product" page and a "Create New Product" button. This view should also include an editable form to set the OrderSchedule and a separate, editable form for the ChatSchedule.

ADMIN View: A comprehensive dashboard to manage users and view all orders.

Order Placement Page (/app/order/page.tsx): A form for BUYER users to select products, specify quantities, add a general order message, and add a small note for each item. The frontend should generate a unique idempotencyKey (e.g., a UUID) for each new order request and include it in the request body.

Product Management Page (/app/seller/products/page.tsx):

A table displaying all products.

Buttons to create, edit, and delete products.

Access Control: Ensure this page is only accessible to seller users.

A button to upload csv file with the list of products 

Order History Page (/app/orders/page.tsx): Display a list of orders. The content should change based on the user's role. For PENDING orders:

If the buyer's method is MANUAL, show a "Confirm Order" button.

If the buyer's method is AUTOMATIC, show a countdown timer and a "Cancel" button.

Chat Interface: A real-time chat interface visible to both the buyer and seller, but only during the scheduled chat hours. When the chat is not available, the chat section should be visually disabled (e.g., grayed out) and a message should be displayed indicating the open hours. The frontend should generate a unique idempotencyKey for each chat message request to prevent duplicates.

Analytics Page (/app/analytics/page.tsx):

Graph Section: A page dedicated to displaying graphs and charts.

Trends: The graphs should visualize trends such as product acquisition over time and the most common times for placing orders.

5. Advanced Logic and Business Rules
Order Window: Implement a check on the server-side POST /api/orders route to ensure orders can only be placed during the times and days specified in the OrderSchedule table. Return an error if an order is attempted outside this window.

Chat Window: Similarly, implement a server-side check on the POST /api/chat/messages route to ensure messages can only be sent during the times and days specified in the ChatSchedule table.

Price and Quantity Updates: When a BUYER places an order, the OrderItem model must store the pricePerUnit and quantity at the time of the order.

Authorization Middleware: Create a reusable middleware function in a middleware.ts file in the root of the project to protect all relevant routes based on user roles. This is a critical security measure and a Next.js best practice.

Order Export: Add a feature for sellers to export an order to a PDF or a spreadsheet (e.g., CSV). This will require server-side logic to generate the file and send it to the client.

Font Optimization: Use Next.js's built-in next/font component to self-host and optimize fonts, improving performance and avoiding layout shifts.

6. Notifications
Order Placed Notification: When an order is successfully placed, the app should notify the assigned seller. The seller should have a preference setting to choose to receive this notification via email, SMS or UI notifications.

Order Confirmed Notification: When a seller confirms an order, the app should notify the BUYER. This notification can also be sent via email, SMS or UI notifications, based on buyer preference.

7. Analytics and Reporting
Data Aggregation: The backend should have endpoints to aggregate order data to support the analytics dashboard.

Trend Analysis:

Product Acquisition: Track how many times each product has been ordered over a given period.

Order Time: Analyze the distribution of order placement times to identify peak ordering hours and days.

Visualization: On the frontend, use a charting library (like Recharts for React) to display the aggregated data in clear and interactive graphs.

New Business Logic: Order Confirmation Flow
The application will support two distinct approaches for buyers to confirm an order, with the specific method configured per buyer by the seller.

Approach 1: Manual Confirmation
Process: When a buyer places an order, its status is initially set to 'PENDING'. The order is not considered final until the buyer explicitly confirms it by clicking a "Confirm Order" button on their order history page.

User Experience: This approach gives the buyer full control, allowing them to review the order, add or remove items, or update notes before finalizing. The order remains in a mutable state until confirmation.

Backend Logic: The POST /app/api/orders/route.ts will create the order with a status of PENDING. The buyer will use the /app/api/orders/[id]/confirm/route.ts endpoint to change the status to PLACED.

Approach 2: Time-Based Cancellation Window
Process: When a buyer places an order, its status is initially set to PENDING. A timer begins, and the confirmationDeadline field is populated. The buyer can cancel the order within a predefined window. Once this time window expires, the order's status automatically transitions to PLACED, and it can no longer be edited or canceled by the buyer.

User Experience: This method is designed for quick, frequent buyers. It provides a brief grace period for corrections. The user interface will need a countdown timer or a clear message indicating the remaining time to cancel.

Backend Logic: The POST /app/api/orders/route.ts will create the order with a status of PENDING and store a timestamp for when the order was placed. A scheduled job (e.g., a Vercel Cron Job) or a separate endpoint that is polled by the frontend will check the timestamp and, if the cancellation window has passed, automatically update the order status to PLACED.

The seller can configure the preferred method for each buyer using a new form or table on their dashboard.

Idempotency and Transaction Safety
Idempotency ensures that multiple identical requests sent to an API endpoint will have the same effect as a single request. This is critical for preventing duplicate resource creation (e.g., creating the same order twice) and for handling repeated requests due to client-side retries or network failures.

How to Implement Idempotency
Unique Request Keys: For API endpoints that create new resources (like POST /api/orders and POST /api/chat/messages), the client must generate a unique key (a UUID is a good choice) and include it in the request body. The server will check for this key before creating a new resource.

Server Logic:

Extract the idempotencyKey from the request.

Check the database for a record with this key.

If a record is found, return the existing resource's information and a successful response (e.g., a 200 OK or 201 Created status) without performing the creation again.

If no record is found, proceed with creating the new resource, storing the idempotencyKey with it.

State-Checking for Updates: For API endpoints that update an existing resource (like PUT/PATCH endpoints), the server must always check the current state of the resource before making a change.

Server Logic:

Retrieve the resource (e.g., an order) using its ID from the URL.

Before applying the update, check the current status. For example, when an order is being confirmed (/api/orders/[id]/confirm), the server should first check if the order's status is 'PENDING'.

If the status is already 'PLACED', the server should not perform any action and simply return a successful response (e.g., a 200 OK or 204 No Content). This makes the operation idempotent, as repeated confirmation requests will not change the outcome.

API Gateway Best Practices and Rate Limiting
Beyond authentication and idempotency, a robust API requires measures to protect it from abuse, manage traffic, and provide a stable experience for users.

Rate Limiting
Rate limiting controls the number of requests a user can make to an API over a specific time period. This is essential for preventing denial-of-service (DoS) attacks, protecting against brute-force attacks on login endpoints, and ensuring fair usage across all clients.

Implementation: The easiest way to implement this in a Next.js application deployed on Vercel is to use the platform's built-in Edge Middleware. You can configure a middleware function that runs on every request to an API route, checking the user's IP address or a custom header to rate-limit requests. For example, you might allow a user to make 10 requests per minute to a specific API endpoint.

Other Best Practices
Input Validation: Every API endpoint must rigorously validate incoming data. This includes checking data types, ensuring required fields are present, and sanitizing inputs to prevent common attacks like SQL injection. You should implement a schema validation library (like Zod) on the server side to enforce this.

Clear Error Handling: The API should return clear, standardized error responses. Use appropriate HTTP status codes (e.g., 400 Bad Request for invalid data, 401 Unauthorized for missing credentials, 403 Forbidden for a lack of permissions, and 404 Not Found for a non-existent resource). The error response body should provide a simple, machine-readable message without leaking sensitive server details.

Centralized Logging and Monitoring: Implement comprehensive logging for all API requests and responses. Tools like Vercel's built-in logs or an external service like Sentry or Logtail are ideal. Monitoring API performance metrics (latency, error rates) will help you quickly identify and debug issues.

CORS (Cross-Origin Resource Sharing): Correctly configure CORS headers on your API routes. This allows the frontend to safely make requests to your API while preventing unauthorized cross-origin access from malicious websites.

Testing
Unit & Integration Tests: Cover all core functionalities: order placement, confirmation, cancellation, and scheduled auto-confirmation.

Edge Cases: Test for scenarios such as expired cancellation windows, unauthorized access attempts to endpoints, and notification delivery failures.

Frontend Responsiveness: Ensure the UI adapts correctly on various devices and screen sizes.

Idempotency Tests: Simulate multiple, identical requests to the POST /api/orders endpoint to ensure only a single order is created. Also, test repeated PUT requests to the confirmation/cancelation endpoints to verify they do not alter the final state.

API Gateway Tests: Run tests to verify that the rate limiting is working as expected. This includes sending a burst of requests to an endpoint to confirm it returns a 429 Too Many Requests status after the limit is exceeded. Also, test endpoints with invalid inputs to ensure they return a 400 Bad Request with a clear error message.

Analytics
Data Aggregation: The backend should have endpoints to aggregate order data to support the analytics dashboard.

Trend Analysis:

Product Acquisition: Track how many times each product has been ordered over a given period.

Order Time: Analyze the distribution of order placement times to identify peak ordering hours and days.

Visualization: On the frontend, use a charting library (like Recharts for React) to display the aggregated data in clear and interactive graphs.

# Cross-Referencing Project Docs

For all implementation, design, and architecture decisions, always review and follow:
- [Authentication & User Management](./auth)
- [UI/UX Preferences & Design Guidelines](./ui-preferences.md)

These files contain the most up-to-date recommendations and implementation steps for authentication, user management, and UI/UX. Ensure all code, configuration, and documentation changes are consistent with these references.

Recommended Folder Structure
/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── seller/
│   │   │       ├── products/
│   │   │       │   └── page.tsx
│   │   │       ├── orders/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── confirm/
│   │   │       │   └── route.ts
│   │   │       └── cancel/
│   │   │           └── route.ts
│   │   ├── chat/
│   │   │   ├── messages/
│   │   │   │   └── route.ts
│   │   │   └── schedule/
│   │   │       └── route.ts
│   │   └── schedule/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   └── order/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   └── ... (shadcn/ui components)
│   ├── dashboard/
│   │   └── ... (buyer and seller dashboard components)
│   ├── shared/
│   │   └── ... (reusable components like Header, Footer, etc.)
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── middleware.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── ... (static assets like images, fonts)
├── types/
│   └── ... (TypeScript types and interfaces)
└── ... (other config files like next.config.js)

Explanation of the Structure
app/: This is the core of the App Router structure. All pages, layouts, and API routes are nested here.

(dashboard): This is a Route Group, indicated by the parentheses. It's used to group related routes (dashboard, analytics, orders, etc.) without affecting the URL path. This is useful for sharing a single layout file across multiple nested routes.

api/: This directory contains all Route Handlers, which serve as your backend API endpoints. Each file within this directory (route.ts) handles a specific HTTP method for a given path.

[id]: These are Dynamic Segments. The brackets around id indicate that this part of the path is a variable, allowing you to create routes like /api/orders/123 or /app/orders/456.

components/: This directory is for all your React components.

ui/: This is where you would place the components generated by shadcn/ui.

dashboard/: Specific components for the dashboard, such as product cards or tables.

shared/: Reusable components used across the entire application (e.g., navigation bar, modals).

lib/: This is a common convention for storing utility functions and external library configurations, such as your Prisma client instance or authentication logic.

middleware.ts: This file, at the root of the project, is where you'll implement the authorization logic to protect your routes based on user roles.

prisma/: This folder contains your Prisma schema and any related files.

public/: This is for static assets that can be served directly, like images or fonts.

types/: A dedicated folder for all custom TypeScript types and interfaces to keep your code organized.

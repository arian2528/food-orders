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

## Testing Strategy: Unit, Integration, and End-to-End Tests

A robust testing strategy is essential for ensuring the reliability, security, and maintainability of your food order management application. The following recommendations cover unit, integration, and end-to-end (E2E) testing:

### 1. Unit Testing
- **Purpose:** Validate individual functions, components, and modules in isolation.
- **What to Test:**
  - Utility functions (e.g., price calculations, date/time logic, idempotency key generation)
  - React components (UI rendering, props handling, conditional rendering)
  - API route handlers (input validation, error handling, business logic)
- **Recommended Tools:**
  - [Jest](https://jestjs.io/) for JavaScript/TypeScript unit tests
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for React components
- **Best Practices:**
  - Mock external dependencies (e.g., database, authentication)
  - Keep tests fast and focused on a single responsibility
  - Use descriptive test names and clear assertions

### 2. Integration Testing
- **Purpose:** Test how multiple modules or components work together, including interactions with the database and authentication layer.
- **What to Test:**
  - API endpoints with real or in-memory database (e.g., order placement, product updates, chat message flow)
  - Authentication and authorization flows (role-based access, protected routes)
  - Database migrations and seeding scripts
- **Recommended Tools:**
  - [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) for integration tests
  - [Supertest](https://github.com/ladjs/supertest) for HTTP API testing
  - [Prisma Test Utilities](https://www.prisma.io/docs/guides/testing/integration-testing)
- **Best Practices:**
  - Use a separate test database or an in-memory database for integration tests
  - Reset database state between tests to ensure isolation
  - Test both success and failure scenarios (e.g., unauthorized access, invalid data)

### 3. End-to-End (E2E) Testing
- **Purpose:** Simulate real user interactions across the entire application stack, from frontend to backend and database.
- **What to Test:**
  - User flows: login, product browsing, order placement, order confirmation/cancellation, chat, analytics dashboard
  - Role-based access: verify that buyers, sellers, and admins see and can do only what they are permitted
  - UI responsiveness and accessibility
- **Recommended Tools:**
  - [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/) for E2E browser automation
- **Best Practices:**
  - Run E2E tests against a deployed staging environment or a local instance with seeded data
  - Use realistic test accounts and data
  - Automate E2E tests in your CI/CD pipeline for every pull request

### General Testing Recommendations
- **Test Coverage:** Aim for high coverage on core business logic, API endpoints, and critical user flows.
- **Continuous Integration:** Integrate all test suites (unit, integration, E2E) into your CI/CD pipeline to catch regressions early.
- **Documentation:** Document your testing setup and how to run each test suite in the project README or a dedicated `TESTING.md` file.
- **Error Reporting:** Ensure failed tests provide clear, actionable error messages.

For more details and examples, see the official documentation for [Jest](https://jestjs.io/docs/getting-started), [React Testing Library](https://testing-library.com/docs/), [Cypress](https://docs.cypress.io/), and [Playwright](https://playwright.dev/docs/intro).

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

# API Response Timeouts and Fast Failures

To ensure a responsive user experience and prevent the frontend from hanging on slow API responses, all API calls should enforce a maximum response time of **5 seconds**. If an API does not respond within this window, the request should be aborted and a user-friendly error should be shown.

## How to Implement API Timeouts
- **Backend (Node.js/Next.js):**
  - For all outgoing HTTP requests (e.g., to external services), use `Promise.race` to enforce a timeout:
    ```js
    // Example: Enforce a 5-second timeout on any async API call
    async function withTimeout(promise, ms = 5000) {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
      ]);
    }
    // Usage:
    // await withTimeout(fetch(...))
    ```
  - Apply this pattern to all API route handlers that make network/database calls.
- **Frontend (React/Next.js):**
  - When calling your own API endpoints, use a similar timeout strategy (e.g., with `fetch` and `AbortController`).
  - Always show a loading spinner or skeleton, and display a clear error if the request times out.

## Project Policy: API Response SLA
- All API endpoints must respond within **5 seconds**. If a request cannot be fulfilled in this time, return a 504 Gateway Timeout or a custom error message.
- Monitor and log all slow requests for further optimization.

# Frontend: Better Loading Strategies

To provide a smooth and responsive user experience, implement the following loading strategies:

- **Skeleton Screens:**
  - Use skeleton components (e.g., with shadcn/ui or your own) to indicate loading state for lists, tables, and cards.
- **Optimistic UI Updates:**
  - For actions like order placement or chat messages, update the UI immediately and roll back if the API call fails.
- **Progress Indicators:**
  - Show spinners or progress bars for actions that may take more than 500ms.
- **Lazy Loading:**
  - Load non-critical data/components only when needed (e.g., analytics graphs, modals).
- **Error Boundaries:**
  - Use React error boundaries to catch and display errors gracefully.
- **Timeout Handling:**
  - If an API call takes longer than 5 seconds, show a timeout error and allow the user to retry.
- **Preloading and Prefetching:**
  - Use Next.js's `next/link` prefetching and `useEffect` to preload data for likely navigation targets.

> **Best Practice:** Always provide immediate visual feedback for user actions, and never leave the user waiting without indication.

# Performance Requirement: App Response Time

- The application must respond to all user actions (including API calls) in **less than 5 seconds**.
- Any operation expected to take longer should provide clear progress feedback and allow the user to cancel or retry.
- Monitor frontend and backend performance in production and address any slow paths as a priority.

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

# CI/CD: Continuous Integration and Deployment

A robust CI/CD (Continuous Integration and Continuous Deployment) pipeline is essential for maintaining code quality, automating tests, and ensuring reliable deployments. This project is designed to work seamlessly with GitHub Actions and GitHub Workflows.

## Recommended CI/CD Practices

- **Automated Testing:**
  - Run all unit, integration, and E2E tests on every pull request and push to main branches.
  - Fail the build if any test fails.
- **Linting and Formatting:**
  - Run code linters (e.g., ESLint) and formatters (e.g., Prettier) as part of the workflow.
  - Fail the build on lint or formatting errors.
- **Type Checking:**
  - Run TypeScript type checks to catch type errors early.
- **Build Verification:**
  - Ensure the Next.js app builds successfully before deployment.
- **Database Migrations:**
  - Run Prisma migrations in a staging environment before production deploys.
- **Preview Deployments:**
  - Use Vercel or a similar platform to create preview deployments for each pull request.
- **Secrets Management:**
  - Store sensitive environment variables and secrets in GitHub Actions secrets, not in the repository.
- **Deployment:**
  - Automate deployment to Vercel (or your chosen platform) on merge to the main branch.

## Example: GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: npm test
      # Optionally run integration/E2E tests here
      # - run: npm run test:e2e
```

> **Tip:** For deployment, use Vercel's GitHub integration or add a separate workflow for custom deployment logic.

## References
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)

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

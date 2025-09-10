# Authentication with Clerk & Role-Based Access Control (B2C)

This guide explains how to implement authentication and robust role-based access control in a Next.js B2C application using Clerk, leveraging Clerk's user.public_metadata for custom roles.

## Clerk Implementation Steps

1. **Install Clerk Packages**
   - Run: `npm install @clerk/clerk-sdk@latest @clerk/nextjs@latest`

2. **Set Up Clerk in Next.js**
   - Go to Clerk dashboard and create a new application.
   - Copy your Clerk Publishable Key and Secret Key.
   - Add these to your `.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
     CLERK_SECRET_KEY=your_secret_key
     ```

3. **Configure oAuth Providers**
   - In Clerk dashboard, enable Google, Microsoft, and LinkedIn as oAuth providers.
   - Follow Clerk's instructions to set up each provider (API keys, redirect URIs, etc.).

4. **Wrap Your App with ClerkProvider**
   - In `app/layout.tsx`:
     ```tsx
     import { ClerkProvider } from '@clerk/nextjs'
     // ...existing code...
     <ClerkProvider>
       {children}
     </ClerkProvider>
     // ...existing code...
     ```

5. **Protect Routes and Pages**
   - Use Clerk's `SignedIn` and `SignedOut` components or hooks to conditionally render content.
   - Example for login page:
     ```tsx
     import { SignIn } from '@clerk/nextjs'
     export default function LoginPage() {
       return <SignIn />
     }
     ```
   - Example for protected page:
     ```tsx
     import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
     export default function DashboardPage() {
       return (
         <>
           <SignedIn>
             {/* dashboard content */}
           </SignedOut>
           <SignedOut>
             <RedirectToSignIn />
           </SignedOut>
         </>
       )
     }
     ```

6. **Session and User Management**
   - Use Clerk's hooks (`useUser`, `useSession`) to access user/session data.
   - Clerk automatically handles session persistence and logout.

## Role-Based Access Control with Clerk (B2C)

### 1. User Metadata (for B2C applications)

- **Configure Session Token:**
  - In Clerk dashboard, customize the session token to include `user.public_metadata` in the metadata JSON object. This ensures user roles stored in public metadata are available in the session token.

- **Store Roles:**
  - When a user signs up or is created, store their custom role (e.g., "admin", "editor", "viewer") within their `public_metadata` object in the Clerk dashboard or programmatically.

- **Create Role-Checking Logic:**
  - **Server-Side:** Use Clerk's `auth()` function in server components or API routes to access the user's session and check their `public_metadata` for the assigned role.
  - **Middleware:** Implement `clerkMiddleware()` to protect routes based on user roles. You can define a matcher in your `middleware.ts` to redirect or deny access if a user lacks the required role.
  - **Client-Side (for UI rendering):** While not recommended for strict access control, you can use client-side hooks or components (e.g., `useAuth()`, `useUser()`) to conditionally render UI elements based on the user's role.

- **Protect Routes and Components:**
  - **Route Protection:** Apply middleware to secure entire routes or groups of routes.
  - **Component Protection:** In server components, use the role-checking logic to conditionally render or hide specific components or functionalities.

### Example: Server-Side Role Check
```ts
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { user } = auth();
  if (user?.publicMetadata?.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
  // ...admin logic...
}
```

### Example: Middleware Role Protection
```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export default clerkMiddleware((auth, req) => {
  const { user } = auth();
  const matcher = createRouteMatcher(['/admin(.*)']);
  if (matcher(req) && user?.publicMetadata?.role !== 'admin') {
    return Response.redirect('/login');
  }
});
```

### Notes
- Clerk supports server-side authentication and API route protection via middleware.
- oAuth login options will be visible on the login page.
- Clerk handles passwordless, social, and multi-factor authentication out of the box.
- See Clerk docs for advanced features: https://clerk.com/docs
- For more on authentication strategies, see: [Choosing Authentication for Your Next.js App](https://www.youtube.com/watch?v=lxslnp-ZEMw)

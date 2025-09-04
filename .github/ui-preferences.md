# UI Preferences and Structure

## General UI/UX Recommendations
- Use a clean, modern, and minimal CRM-style layout with a collapsible sidebar for navigation.
- Sidebar navigation should use icons and labels, with active state highlighting and smooth transitions.
- Main content area should be centered, padded, and use rounded cards with subtle shadows for separation.
- Typography should be bold for headings, with clear hierarchy and spacing.
- Use Tailwind CSS utility classes for all styling, as shown in the code snippet.
- Prefer gradients and soft color backgrounds for dashboard landing pages.
- Use color-coded buttons (e.g., blue for primary actions, purple for uploads) with rounded corners and hover transitions.
- Tables should be responsive, with sticky headers, zebra striping, and clear column labels.
- Modals should be centered, with backdrop blur and shadow, and use rounded corners and clear close buttons.
- Forms should use full-width inputs, rounded borders, and clear focus/hover states.
- Pagination controls should be rounded, with disabled states and clear navigation.
- CSV upload buttons should be styled as prominent, rounded buttons with clear labels.
- Use icons from lucide-react for visual cues (e.g., Box, ShoppingBag, PanelLeftClose/Open).
- All UI elements should be accessible, with sufficient color contrast and keyboard navigation support.
- Use animation classes (e.g., animate-scale-in) for modal transitions and interactive elements.
- Use max-w and min-h classes to ensure content is readable and not cramped.
- Use shadow-lg, shadow-xl, and shadow-inner for depth and separation between UI elements.
- Use divide-y and border classes for clear separation in lists and tables.
- Use sticky headers in tables for better usability on long lists.
- Use backdrop-blur for modal overlays to focus user attention.
- Use transition-all and transition-colors for smooth UI state changes.
- Use rounded-lg, rounded-md, and rounded-full for consistent border radii.
- Use space-y and gap classes for vertical and horizontal spacing between elements.
- Use text-gray-600, text-gray-700, text-gray-900 for readable text colors.
- Use bg-gradient-to-br, bg-white, bg-gray-50, bg-indigo-100 for backgrounds.
- Use focus:outline-none and focus:ring for accessible input focus states.
- Use hover:bg-gray-700, hover:bg-blue-700, hover:bg-purple-700 for interactive feedback.
- Use disabled:opacity-50 and disabled:cursor-not-allowed for disabled button states.
- Use z-50 for modal overlays to ensure they appear above all other content.
- Use max-h-[90vh] and overflow-y-auto for modal content to prevent overflow.
- Use text-center, text-left, text-right for alignment as needed.
- Use font-extrabold, font-bold, font-medium, font-semibold for text emphasis.
- Use uppercase and tracking-wide for table headers and navigation labels.

## Responsive Design
- Layout adapts for mobile, tablet, and desktop using Tailwind's responsive classes (e.g., `sm:`, `md:`).
- Sidebar collapses to icons-only on small screens or when toggled.
- Inputs, buttons, and tables scale appropriately for different screen sizes.
- Use max-w-xs, max-w-2xl, min-h-full, min-w-full for responsive sizing.

## Theme Management
- Support both light and dark mode using Tailwind's `dark:` classes and a toggle button.
- Persist theme preference in localStorage.

## Component Structure
- shared/: Reusable components used across the entire application (e.g., navigation bar, modals).
- dashboard/: CRM dashboard components (cards, tables, modals, sidebar).
- lib/: Utility functions and external library configs.
- middleware.ts: Authorization logic for role-based access.
- prisma/: Prisma schema and related files.
- public/: Static assets (images, fonts).
- types/: TypeScript types and interfaces.

## Previous Recommendations (moved from instructions.md)
- Use shadcn/ui for all components (buttons, forms, tables, etc.) and follow official documentation for setup.
- Do not customize shadcn/ui components beyond what is provided out of the box.
- All layouts, typography, and interactive elements should adapt gracefully to different screen sizes.
- The user interface should support both a dark mode and a light mode, with a toggle button or a system-based preference.

---
Preferred styles and structure are based on the code in `ui-preference-code-snippet.ts`. For new UI features, follow the patterns and CSS utility classes demonstrated in that file.

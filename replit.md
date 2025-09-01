# Overview

MediLab Pro is a comprehensive medical laboratory management system that enables patients to book diagnostic tests online and provides laboratory administrators with tools to manage operations. The application features a modern React frontend with a Node.js Express backend, supporting both patient-facing services (test booking, report access) and administrative functions (booking management, report processing).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Design System**: Radix UI primitives with custom theming using CSS variables for light/dark mode support

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture with structured error handling
- **Development**: Hot reload with Vite integration for seamless full-stack development
- **Build Process**: ESBuild for production server bundling

## Data Storage Solutions
- **Database**: PostgreSQL with connection via Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Centralized schema definitions in TypeScript with Zod validation
- **Migrations**: Drizzle Kit for database schema migrations and management

## Core Data Models
- **Patients**: Personal information, contact details, and medical history
- **Tests**: Available diagnostic tests with pricing and categories (pathology, radiology, packages)
- **Bookings**: Test appointments with collection methods (home/lab) and status tracking
- **Reports**: Test results with file storage and delivery status
- **Inquiries**: Customer support and general inquiries system
- **Users**: Administrative user accounts with authentication

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session storage
- **User Roles**: Basic admin/user role separation for administrative functions
- **Route Protection**: Middleware-based authentication for protected admin routes

## UI/UX Design Patterns
- **Component Structure**: Modular, reusable components with consistent prop interfaces
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Accessibility**: Radix UI primitives ensure WCAG compliance and keyboard navigation
- **Loading States**: Skeleton components and loading indicators for better user experience
- **Error Handling**: Toast notifications and form validation with clear error messages

# External Dependencies

## Database Services
- **Neon**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

## Frontend Libraries
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type checking
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

## Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Static type checking for enhanced developer experience
- **ESLint/Prettier**: Code quality and formatting tools
- **Replit Integration**: Development environment optimizations for Replit platform

## Build and Deployment
- **Production Build**: Vite for client bundle, ESBuild for server bundle
- **Asset Management**: Vite handles static asset optimization and bundling
- **Environment Configuration**: Environment variables for database connection and feature flags
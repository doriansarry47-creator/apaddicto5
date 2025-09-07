# Overview

Apaddicto is a French-language addiction recovery application designed to help patients manage cravings through physical exercise, relaxation techniques, and psychoeducation. The application serves both patients and administrators, providing a comprehensive platform for addiction recovery support with emergency intervention capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built as a React Single Page Application (SPA) using TypeScript and modern React patterns:

- **React 18** with functional components and hooks
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with **shadcn/ui** component library for consistent design
- **Vite** as the build tool and development server

The application uses a tab-based navigation system with role-based access control, separating patient and admin interfaces. Components are organized by feature (exercises, relaxation, education, goals) with shared UI components.

## Backend Architecture

The server follows a Node.js Express architecture pattern:

- **Express.js** server with TypeScript
- **RESTful API** design with `/api` prefix for all endpoints
- **Modular route organization** with centralized route registration
- **Middleware-based request logging** and error handling
- **Session-based authentication** with Replit OAuth integration

The server structure separates concerns with dedicated modules for database operations, authentication, and API routes.

## Data Storage

The application uses a PostgreSQL database with Drizzle ORM:

- **Neon Database** (PostgreSQL) as the primary database
- **Drizzle ORM** for type-safe database operations and migrations
- **Schema-first approach** with centralized schema definitions in `shared/schema.ts`
- **Connection pooling** using Neon's serverless driver

Key data entities include users, patient profiles, exercises, meditations, education modules, goals, user sessions, and emergency events. The schema supports role-based access with user types for patients and administrators.

## Authentication System

Authentication is handled through Replit's OAuth system:

- **OpenID Connect (OIDC)** integration with Replit
- **Passport.js** strategy for OAuth handling
- **Session storage** in PostgreSQL using connect-pg-simple
- **Role-based authorization** with middleware protection
- **Secure session management** with HTTP-only cookies

## State Management

Client-side state is managed through a combination of:

- **TanStack Query** for server state, caching, and synchronization
- **React hooks** (useState, useContext) for local component state
- **Custom hooks** (useAuth, useToast) for shared functionality
- **Query invalidation** patterns for real-time data updates

## Content Management

The application supports multiple content types for therapeutic interventions:

- **Exercise library** with difficulty levels and categories
- **Meditation sessions** with guided instructions
- **Education modules** for psychoeducation content
- **Goal tracking** with progress monitoring
- **Emergency interventions** with immediate response protocols

## Real-time Features

While not using WebSockets, the application provides near real-time updates through:

- **Optimistic updates** with TanStack Query mutations
- **Background refetching** for active data
- **Emergency event tracking** with immediate persistence
- **Session monitoring** for user activity

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migration and schema management tools

## Authentication Services  
- **Replit OAuth**: Primary authentication provider using OpenID Connect
- **Replit Identity Service**: User profile and session management

## Development Tools
- **Replit Environment**: Integrated development and hosting platform
- **Vite**: Frontend build tool with HMR and development server
- **Replit Cartographer**: Development-time debugging and introspection

## UI and Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library with consistent theming
- **Lucide React**: Icon library for consistent iconography

## Fonts and Assets
- **Google Fonts**: Custom font loading (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Unsplash**: External image CDN for exercise and meditation imagery

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware with secure cookie configuration

The application is designed to run entirely within the Replit environment, leveraging platform-specific features while maintaining standard web technologies for broad compatibility.
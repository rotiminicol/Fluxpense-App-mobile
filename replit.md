# ExpenseAI Mobile Expense Manager

## Overview

ExpenseAI is a comprehensive mobile expense management application built with React/TypeScript frontend and Express.js backend. The application focuses on smart expense capture through OCR receipt scanning, manual expense entry, budget tracking, and detailed reporting. It features a mobile-first design using modern UI components and provides users with intelligent expense categorization and budget monitoring capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Custom implementation with bcrypt for password hashing
- **Session Management**: Built-in session handling

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interfaces with gesture support
- Progressive Web App capabilities
- Bottom navigation for mobile UX patterns

## Key Components

### Authentication System
- User registration and login functionality
- Password hashing using bcrypt
- Session-based authentication
- Protected routes with authentication guards

### Expense Management
- Manual expense entry with form validation
- OCR-powered receipt scanning and processing
- Expense categorization with predefined categories
- Edit and delete expense functionality
- Multiple expense sources (manual, camera, email)

### Budget System
- Monthly budget setting per category
- Budget vs actual spending tracking
- Visual progress indicators
- Budget alerts and notifications

### Category Management
- Predefined expense categories (Food, Transport, Shopping, etc.)
- Category icons and color coding
- Category-based spending analysis

### OCR Integration
- Receipt image processing capabilities
- Automatic data extraction (vendor, amount, date)
- Smart categorization suggestions
- Image validation and error handling

### Reporting & Analytics
- Dashboard with spending summaries
- Category breakdown with visual charts
- Monthly spending trends
- Export functionality (CSV, PDF)

## Data Flow

### Expense Creation Flow
1. User initiates expense creation (manual or camera)
2. For camera: Image processed through OCR service
3. Extracted data validated and presented to user
4. User confirms or edits extracted information
5. Expense saved to database with category assignment
6. Dashboard and reports updated via cache invalidation

### Authentication Flow
1. User provides credentials
2. Server validates against database
3. Password verified using bcrypt
4. Session established and user data returned (excluding password)
5. Client stores user state for subsequent requests

### Budget Tracking Flow
1. Users set monthly budgets per category
2. Real-time budget vs spending calculations
3. Visual progress updates on dashboard
4. Alerts triggered when approaching budget limits

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **bcrypt**: Password hashing and authentication
- **zod**: Schema validation
- **react-hook-form**: Form state management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development tools

### OCR Service Integration
- Placeholder for external OCR service (Mindee, Nanonets, or Google Cloud Vision)
- Image upload and processing capabilities
- Structured data extraction from receipts

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- TypeScript compilation with strict mode
- Tailwind CSS with JIT compilation
- Express server with tsx for TypeScript execution

### Production Build
- Vite production build for optimized client assets
- esbuild for server-side TypeScript compilation
- Static asset serving through Express
- Database migrations through Drizzle Kit

### Database Management
- Drizzle migrations for schema changes
- PostgreSQL with Neon serverless architecture
- Environment-based configuration
- Connection pooling and optimization

### Hosting Considerations
- Node.js runtime environment required
- PostgreSQL database access
- File upload capabilities for receipt images
- Environment variables for database and API keys

## Changelog

- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
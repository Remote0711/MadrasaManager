# İslami Okul Yönetim Sistemi

## Overview

This is a comprehensive weekend Islamic school management system built with React, TypeScript, Express.js, and PostgreSQL. The application provides role-based access control for administrators, teachers, and parents to manage students, classes, lesson plans, attendance, progress tracking, and behavioral notes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Custom session-based authentication with bcrypt password hashing
- **API Design**: RESTful API with role-based route protection
- **Request Handling**: JSON middleware with CORS support

### Database Architecture
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication & Authorization
- **Session-based Authentication**: Uses express-session with PostgreSQL store
- **Password Security**: bcrypt for password hashing and verification
- **Role-based Access Control**: Three roles (ADMIN, TEACHER, PARENT) with specific permissions
- **Route Protection**: Middleware-based authentication and authorization checks

### Data Models
- **Users**: Admin, teacher, and parent accounts with role-based permissions
- **Students**: Student profiles with firstName, lastName, enrollmentDate (kayıt tarihi) linked to classes and parents
- **Classes**: Class management with program type associations
- **Program Types**: Three types - Haftasonu (Weekend), Yatılı (Boarding), Yetişkin (Adult)
- **Lesson Plans**: Weekly curriculum planning with page assignments
- **Progress Tracking**: Student progress with color-coded performance indicators (90%+ green, 50-89% yellow, <50% red)
- **Attendance**: Three status types - geldi (present), gelmedi (absent), mazeretli (excused)
- **Behavior**: Weekly behavioral notes and comments

### User Interface
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Turkish Localization**: Complete Turkish language interface
- **Component Library**: Comprehensive UI component system based on Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Progress Visualization**: Color-coded progress bars and status indicators

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Server validates credentials against database
3. Session is created and stored in PostgreSQL
4. User is redirected to role-appropriate dashboard
5. Subsequent requests include session authentication

### Data Management Flow
1. Frontend makes API requests using TanStack Query
2. Express middleware validates session and role permissions
3. Drizzle ORM handles database operations
4. Response data is cached and displayed in React components
5. Optimistic updates provide immediate user feedback

### Progress Tracking Flow
1. Teachers input weekly progress and attendance data
2. System calculates progress percentages based on lesson plans
3. Color-coded indicators provide visual feedback
4. Parents can view their child's progress in real-time
5. Administrators can monitor overall class performance

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **bcrypt**: Password hashing and verification
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui**: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form handling and validation
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and development
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Database Seeding**: Automatic seed data generation on startup
- **Session Secret**: Environment-based session configuration
- **TypeScript Compilation**: Real-time type checking

### Production Build
- **Frontend Build**: Vite builds optimized React application to `dist/public`
- **Backend Build**: esbuild compiles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Environment Variables**: DATABASE_URL and SESSION_SECRET required

### Database Management
- **Schema Migrations**: Drizzle Kit manages database schema changes
- **Connection Management**: Neon serverless handles connection pooling
- **Data Seeding**: Initial data population for development and testing
- **Backup Strategy**: Relies on Neon's built-in backup capabilities

### Scaling Considerations
- **Stateless Sessions**: Session data stored in PostgreSQL for horizontal scaling
- **Connection Pooling**: Neon serverless manages database connections
- **Static Assets**: Frontend assets can be served via CDN
- **API Caching**: TanStack Query provides client-side caching
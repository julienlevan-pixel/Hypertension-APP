# HTA Quiz Application

## Overview

This is an educational web application designed for medical and pharmacy students in Quebec to learn about hypertension (HTA - Hypertension Artérielle). The application implements a progressive quiz system based on Bloom's taxonomy with 4 levels: Knowledge, Comprehension, Application, and Analysis. Students must answer 5 questions correctly per level to progress, with strict error limits (maximum 3 total errors or 2 consecutive errors) that reset the game upon violation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Custom React hooks (useGameState, useQuestions, useLeaderboard) with React Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom medical-themed color variables and responsive design
- **Build Tool**: Vite with custom aliases and development plugins

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints serving CSV question data
- **Development Setup**: Custom Vite integration for seamless full-stack development
- **Static Assets**: Served through Express with Vite middleware in development

### Data Storage Solutions
- **Questions**: CSV file format parsed client-side for quiz content
- **Game State**: Local React state with custom hooks for game logic
- **Leaderboard**: Browser localStorage for persistent score tracking
- **Database**: Drizzle ORM configured for PostgreSQL (currently unused but ready for future expansion)

### Game Logic Implementation
- **Quiz Engine**: Custom TypeScript logic enforcing Bloom's taxonomy progression
- **Scoring System**: Time-based scoring with base points plus speed bonuses
- **Error Tracking**: Dual error limits (total and consecutive) with immediate game termination
- **Question Management**: CSV parsing with randomization and level-based organization

### External Dependencies
- **UI Framework**: Radix UI for accessible component primitives
- **Form Management**: React Hook Form with Zod validation schemas
- **Icons**: Lucide React for consistent iconography
- **Database**: Neon Database serverless PostgreSQL (configured but not actively used)
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Replit-specific plugins for runtime error handling and cartographer integration
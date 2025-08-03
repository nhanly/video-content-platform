# Video Content Platform - Frontend

A modern, responsive video content platform built with Next.js 15, React 19, and TypeScript. This application provides browsing and watching video content with advanced features like category management, and search functionality.

## 🚀 Features

- **Modern Video Streaming**: Support for HLS and DASH streaming protocols
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Category Management**: Browse videos by categories with visual thumbnails
- **Video Player**: Custom video player with skeleton loading states
- **Search & Discovery**: Advanced search with filtering capabilities
- **User Experience**: Smooth transitions, loading states, and error boundaries
- **Type Safety**: Full TypeScript coverage with strict configuration

## 🛠 Tech Stack

### Core Framework

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/UI** - Modern component library
- **Lucide React** - Icon library
- **next-themes** - Theme management

## 📁 Project Structure

The project follows Feature-Sliced Design (FSD) architecture:

```
frontend/
├── app/                          # Next.js App Router
│   ├── entities/                 # Business entities
│   │   ├── category/            # Category-related components
│   │   │   └── ui/
│   │   │       └── CategorySkeleton.tsx
│   │   └── video/               # Video-related components
│   │       └── ui/
│   │           ├── VideoCard.tsx
│   │           └── VideoCardSkeleton.tsx
│   ├── features/                # Feature-specific logic
│   │   └── video-player/        # Video player feature
│   ├── shared/                  # Shared utilities and components
│   │   ├── api/                 # API client and requests
│   │   │   └── api.ts
│   │   ├── lib/                 # Utility libraries
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   │   ├── use-mobile.ts
│   │   │   │   └── use-toast.ts
│   │   │   └── utils.ts         # Utility functions
│   │   ├── model/               # Type definitions and store
│   │   │   ├── store.ts
│   │   │   └── type.ts
│   │   └── ui/                  # Shared UI components
│   │       ├── components/
│   │       │   ├── ErrorBoundary.tsx
│   │       │   └── ui/          # Shadcn/UI components
│   │       │       ├── accordion.tsx
│   │       │       ├── button.tsx
│   │       │       ├── card.tsx
│   │       │       └── ... (35+ components)
│   ├── widgets/                 # Layout widgets
│   │   ├── header/              # Header widget
│   │   │   └── ui/
│   │   │       └── Header.tsx
│   │   └── sidebar/             # Sidebar widget
│   │       └── ui/
│   │           └── Sidebar.tsx
│   ├── providers/               # React context providers
│   │   ├── Providers.tsx        # Main providers wrapper
│   │   └── theme-provider.tsx   # Theme provider
│   ├── styles/                  # Global styles
│   │   └── globals.css
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── watch/                   # Video watch pages
│       └── [id]/
│           └── page.tsx
├── public/                      # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── components.json              # Shadcn/UI configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

### Architecture Principles

- **Feature-Sliced Design**: Organized by layers (entities, features, widgets, shared)
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Boundaries**: Graceful error handling at component level

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1/

# Optional: Additional configuration
NODE_ENV=development
```

### Key Configuration Files

- **`next.config.mjs`**: Next.js configuration with image optimization and build settings
- **`tsconfig.json`**: TypeScript configuration with path mapping
- **`components.json`**: Shadcn/UI configuration for component generation
- **`tailwind.config.js`**: Tailwind CSS configuration (auto-generated)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- PNPM (recommended) or npm
- Running backend API server

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd video-content-platform/frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Component Generation (Shadcn/UI)
npx shadcn-ui add <component-name>
```

## 🔧 API Integration

### API Client

The application uses a custom API client (`shared/api/api.ts`) with:

- **Type-safe requests**: Full TypeScript support
- **Error handling**: Comprehensive error management
- **URL building**: Dynamic parameter handling
- **HTTP methods**: GET, POST, PUT, DELETE support

## 🧪 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries

### Component Development

- Create reusable, composable components
- Use proper TypeScript interfaces
- Implement loading and error states
- Follow accessibility best practices

### State Management

- Use Zustand for client-side state
- Minimize state complexity

## 🚀 Production Deployment

### Build Optimization

```bash
pnpm build        # Creates optimized production build
pnpm start        # Serves production build
```

# SportsPlus Project Context

This document provides a detailed overview of the SportsPlus project, its tech stack, architecture, and current goals. This is intended to be shared with an AI assistant to facilitate planning and development.

## 1. Project Overview
**SportsPlus** is a comprehensive React-based mobile-style web application designed for sports game organization and community engagement. It caters to athletes looking to find, join, and host sports games in their local area.

## 2. Technology Stack
The project leverages modern web technologies to provide a smooth, app-like experience in the browser.

### Core Frameworks & Tools
- **Frontend Framework**: [React 18.3.1](https://reactjs.org/)
- **Build Tool**: [Vite 6.3.5](https://vitejs.dev/) with SWC compiler (`@vitejs/plugin-react-swc`)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Integrated via `index.css` and utility classes)

### Key Libraries & Components
- **UI Components**: [@radix-ui](https://www.radix-ui.com/) (Extensive use of accessible primitives like Dialog, Popover, Tabs, etc.)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.stevenbernhard.me/) (Toast messages)
- **Carousels**: [Embla Carousel](https://www.embla-carousel.com/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes)
- **Utilities**: `clsx`, `tailwind-merge`, `vaul` (Drawers), `cmdk` (Command menu)

## 3. Project Structure
The repository is organized following standard Vite/React conventions:

```text
Sports-Plus/
├── src/                    # Source code
│   ├── components/        # UI Screens and reusable components
│   ├── styles/            # Global and component-specific styles
│   ├── guidelines/        # Development and design guidelines
│   ├── App.tsx            # Main application logic, routing, and heart of the state
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global Tailwind CSS styles
│   └── CHANGELOG_v2.x.md  # Detailed version history
├── public/                # Static assets (images, icons)
├── vite.config.ts         # Vite configuration (aliasing, build optimization)
├── package.json           # Dependencies and scripts
└── CONTEXT.md             # This file
```

## 4. Core Features & Functionality
The application is feature-rich, focusing on the end-to-end experience of playing sports.

### User Journey
1.  **Onboarding & Auth**: Splash screen followed by a multi-step onboarding process, login/sign-up, and forgot password flows.
2.  **Home Dashboard**: A central hub to discover games, view joined games, and access quick actions.
3.  **Game Discovery & Interaction**: users can browse games, view details, and join games.
4.  **Game Creation**: Verified users can host games by specifying sport, skill levels, location, date, and time.
5.  **Queue System**: An active view for players who have joined a game, showing participants and location details.
6.  **Communication**: Integrated chat system for game-related discussions.
7.  **Community & Gamification**:
    *   **Teams**: Create and join squads, view members and achievements.
    *   **Leaderboard**: Track rankings and competitiveness.
    *   **Points & Badges**: Earn rewards for participation and reliability.
8.  **Profile & Settings**: Manage personal information, security, and app preferences.

## 5. Recent Version (v2.9) Updates
The latest update focused on UI polish and critical logic improvements:
- **Join Logic**: Implemented a "One Game at a Time" restriction for better management.
- **Queue Enhancements**: Added an interactive map view within the queue screen with animated location pins.
- **User Experience**: Enabled clicking user names in the queue to directly view mini-profiles.
- **UI Polish**: Significant spacing adjustments for bottom navigation and screen layouts.

## 6. Project Goals & Roadmap
### Current Objectives
- **UI Consistency**: Ensure all screens follow the new spacing and design guidelines.
- **Robustness**: Improve state management for game lifecycle (host vs. participant).
- **Engagement**: Build out the "Teams" and "Achievements" features to increase user retention.

### Future Roadmap
- **Real Maps Integration**: Transition from mock map visualizations to real Google Maps or Mapbox integration.
- **Location Services**: Real-time location sharing for active games.
- **Advanced Queuing**: Priority systems for highly popular games.
- **External API Integration**: Potential for real sports news and data integration.

## 7. Development Guide
### How to Run Locally
1. `npm install`
2. `npm run dev` (Defaults to [http://localhost:3000](http://localhost:3000))

### Build & Deployment
- `npm run build`: Generates a production-ready bundle in the `dist/` directory.
- The project is configured with `manualChunks` in Vite for better caching of Radix and Vendor libraries.
- `terser` is used for optimal production minification.

---
**Maintained by**: valiant-11
**Last Updated**: March 2026

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-01
### Added
- **Monetization (Module 1):** Implemented `SubscriptionScreen` paywall onboarding flow with dynamic routing for Player (`home`) and Organization (`org-portal`) accounts.
- **Monetization (Module 1):** Added global `ProBadge` UI component with adaptive sizing (`sm` and `md`) for feeds and profiles.
- **Monetization (Module 2):** Implemented `useSubscriptionLimits` mock hook to restrict 'FREE' tier organizers to 1 active tournament.
- **Monetization (Module 2):** Built mobile-responsive `LimitReachedDialog` to intercept tournament creation and drive premium upgrades.
- **Data:** Updated `mockData.ts` to include `subscriptionTier` ('FREE' | 'PREMIUM') across User and Organization interfaces.

### Changed
- **UI Polish:** Refined `LimitReachedDialog` with mobile-first constraints, heavy `rounded-[2rem]` geometry, and centered iconography.
- **UI Bug Fixes:** Forced `bg-[#10b981]` emerald overrides on primary buttons using `!` and inline styles to ensure visibility across all device states.
- **Grammar & UX:** Updated organization dashboard visual cues to cleaner "Free Limit Reached (X/Y)" format.

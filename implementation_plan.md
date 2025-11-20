# Update Auth Pages to Premium Design

## Goal
Update `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx` to use the new "Premium Dark Mode" design system. The current files use deprecated classes (`glass-strong`, `btn-primary-premium`, etc.) which will result in broken UI.

## Proposed Changes

### 1. Login Page (`src/app/(auth)/login/page.tsx`)
-   **Container**: Replace `glass-strong` with `glass-panel` or a clean `premium-card` style container.
-   **Inputs**: Update to use dark backgrounds (`bg-white/5`) with subtle borders.
-   **Buttons**: Replace `btn-primary-premium` with `btn-primary` and `btn-secondary-premium` with `btn-secondary`.
-   **Typography**: Remove gradient text if it conflicts, ensure high contrast white/gray text.
-   **Decorations**: Remove "blobs" and "animated gradients". Keep it clean and minimal.

### 2. Signup Page (`src/app/(auth)/signup/page.tsx`)
-   **Container**: Same as Login page.
-   **Inputs**: Same as Login page.
-   **Buttons**: Same as Login page.
-   **Decorations**: Remove "blobs".

## Verification
-   **Visual Check**: Ensure the pages look consistent with the Landing Page and Dashboard.
-   **Build Check**: Ensure no deprecated classes remain.

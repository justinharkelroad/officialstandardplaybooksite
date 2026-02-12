

## Make NewLanding the Official Home Page + Disable Producer Challenge CTA

### 1. Swap the landing page route

In `src/App.tsx`, the `/` route currently renders `<Index />` (the old landing page). We will:

- Change the `/` route to render `<NewLanding />` instead
- Move the old `<Index />` to a backup route like `/legacy` (so it's still accessible if needed)
- Keep the `/new` route pointing to `<NewLanding />` as well for backwards compatibility

### 2. Disable "Buy a Seat" buttons on Producer Challenge banner

In `src/pages/NewLanding.tsx`, both "Buy a Seat" buttons (front face and back face of the flip card) will be changed to:

- **Text**: "v2.0 Launching 2/20/26"
- **Element**: Changed from `<a>` links to `<span>` or `<button disabled>` elements so they are non-clickable
- **Styling**: Muted/disabled appearance (e.g., `opacity-60 cursor-not-allowed`) to signal they're inactive

---

### Technical Details

**Files changed:**

1. **`src/App.tsx`** (2 lines)
   - Change `<Route path="/" element={<Index />} />` to `<Route path="/" element={<NewLanding />} />`
   - Add `<Route path="/legacy" element={<Index />} />` as a fallback
   - Add `import NewLanding` at the top

2. **`src/pages/NewLanding.tsx`** (4 spots)
   - **Line ~695-702** (front face): Replace `<a href="...">Buy a Seat</a>` with a disabled button reading "v2.0 Launching 2/20/26"
   - **Line ~750-757** (back face): Same replacement -- disabled button with "v2.0 Launching 2/20/26"

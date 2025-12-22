# ⚡ Quick Fixes Checklist - Immediate Actions

This document contains **actionable tasks** you can complete TODAY to immediately improve code quality. Estimated time: **3-4 hours**.

---

## ✅ Task List

### 🎯 Phase 1: Type Definitions (1 hour)

- [ ] **Create `/types/` directory**
  ```bash
  mkdir types
  ```

- [ ] **Create `types/models.ts`** (20 min)
  - Copy Product interface from audit report
  - Add User, Order, OrderItem interfaces
  - Add LocalizedText, Address, SellerInfo types
  - Export all types

- [ ] **Create `types/api.ts`** (15 min)
  - Add PaginationParams, PaginationResponse
  - Add ProductsQuery, ProductsResponse
  - Add OrdersResponse, CreateOrderRequest
  - Add ErrorResponse

- [ ] **Create `types/common.ts`** (10 min)
  - Export Locale type
  - Add Filters interface
  - Add CartItem interface

- [ ] **Create `types/index.ts`** (5 min)
  ```typescript
  export * from './models';
  export * from './api';
  export * from './common';
  ```

- [ ] **Update one file to use new types** (10 min)
  - Choose `app/[locale]/products/page.tsx`
  - Replace local Product interface
  - Import from `@/types`
  - Verify no errors

**Validation**:
```bash
# Should compile without errors
npm run build
```

---

### 🔧 Phase 2: Constants (45 min)

- [ ] **Create `/lib/constants/` directory**
  ```bash
  mkdir lib/constants
  ```

- [ ] **Create `lib/constants/categories.ts`** (20 min)
  - Copy CATEGORIES array from one file
  - Add Category interface
  - Add helper functions: getCategoryBySlug, getCategoryIcon
  - Export all

- [ ] **Update `app/[locale]/page.tsx`** (10 min)
  - Remove local categories array
  - Import from `@/lib/constants/categories`
  - Test page still works

- [ ] **Update `app/[locale]/products/page.tsx`** (10 min)
  - Remove local categories array
  - Import from `@/lib/constants/categories`
  - Use `categoriesSlugsOnly()` helper

- [ ] **Update `components/layout/Header.tsx`** (5 min)
  - Remove local categories array
  - Import from `@/lib/constants/categories`
  - Use `categoriesIconsOnly()` helper

**Validation**:
```bash
# All pages should work
npm run dev
# Navigate to /, /products, check header
```

---

### 🛡️ Phase 3: Error Boundaries (30 min)

- [ ] **Create `app/error.tsx`** (15 min)
  ```typescript
  'use client';

  export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  ```

- [ ] **Create `app/[locale]/error.tsx`** (10 min)
  - Same as above but with locale awareness
  - Use translations if needed

- [ ] **Create `app/not-found.tsx`** (5 min)
  ```typescript
  export default function NotFound() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-xl text-gray-600">Page not found</p>
        </div>
      </div>
    );
  }
  ```

**Validation**:
- Navigate to non-existent page → should show 404
- Temporarily throw error in a component → should show error boundary

---

### 🎨 Phase 4: Component Extraction (1 hour)

- [ ] **Create `components/layout/Header/` directory**
  ```bash
  mkdir components/layout/Header
  ```

- [ ] **Extract `HeaderLogo.tsx`** (10 min)
  - Move logo rendering logic
  - Import Image, Link
  - Use locale from props or hook

- [ ] **Extract `HeaderActions.tsx`** (15 min)
  - Move cart, notifications, user menu
  - Accept `onMobileMenuToggle` prop
  - Keep existing functionality

- [ ] **Extract `HeaderCategories.tsx`** (15 min)
  - Move categories dropdown logic
  - Use CATEGORIES from constants
  - Keep dropdown state local

- [ ] **Update `components/layout/Header.tsx`** (20 min)
  - Import new sub-components
  - Replace inline JSX with components
  - Should be < 150 lines now
  - Test all functionality works

**Validation**:
- Header should look identical
- All dropdowns should work
- Mobile menu should work
- No console errors

---

### 🧪 Phase 5: Quick API Cleanup (30 min)

- [ ] **Fix one API route type** (15 min)
  - Choose `app/api/products/route.ts`
  - Replace `any` on line 34:
    ```typescript
    // Before
    const sortOptions: { [key: string]: any } = { ... }

    // After
    const sortOptions: Record<string, { [key: string]: 1 | -1 }> = { ... }
    ```
  - Test route still works

- [ ] **Add types to one more route** (15 min)
  - Choose `app/api/orders/route.ts`
  - Import types from `@/types`
  - Replace any types with proper ones
  - Test route

**Validation**:
```bash
# API should work
curl http://localhost:3000/api/products
curl http://localhost:3000/api/orders
```

---

## 📊 Progress Tracking

| Task | Estimated Time | Status | Notes |
|------|----------------|--------|-------|
| Create types/ directory | 1h | ⏳ Pending | |
| Centralize categories | 45min | ⏳ Pending | |
| Add error boundaries | 30min | ⏳ Pending | |
| Extract Header components | 1h | ⏳ Pending | |
| Fix API types | 30min | ⏳ Pending | |

**Total Time**: ~3-4 hours

---

## ✅ Completion Checklist

After completing all tasks above, verify:

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run dev` starts without warnings
- [ ] Homepage loads correctly
- [ ] Products page works with filters
- [ ] Header categories dropdown works
- [ ] Cart functionality unchanged
- [ ] Error page shows on 404
- [ ] No TypeScript errors in IDE
- [ ] All imports resolve correctly

---

## 🎯 Impact

After these quick fixes:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Product type definitions** | 11+ copies | 1 canonical | ✅ 91% reduction |
| **Categories definitions** | 3 copies | 1 source | ✅ 67% reduction |
| **Header.tsx lines** | 421 | ~150 | ✅ 65% reduction |
| **Error handling** | Crashes | Boundaries | ✅ User-friendly |
| **Type safety** | 2 routes | 4 routes fixed | ✅ +100% coverage |

---

## 🚀 Next Steps

After completing quick fixes, continue with:

1. **Week 2**: Full API client implementation
2. **Week 3**: Complete component refactoring
3. **Week 4**: Business logic extraction
4. **Week 5**: Testing infrastructure

See `ARCHITECTURE_AUDIT_REPORT.md` for full plan.

---

## 💡 Tips

- **Commit after each phase** - easier to rollback if needed
- **Test after each change** - catch issues early
- **Use TypeScript errors as guide** - they'll show what needs updating
- **Ask for help** - if stuck on a task for > 30 min
- **Take breaks** - fresh eyes catch more issues

---

## 📝 Commit Messages

Use these for each phase:

```bash
# Phase 1
git commit -m "feat: add centralized type definitions in /types"

# Phase 2
git commit -m "refactor: centralize categories in /lib/constants"

# Phase 3
git commit -m "feat: add error boundaries for better error handling"

# Phase 4
git commit -m "refactor: break down Header into smaller components"

# Phase 5
git commit -m "fix: improve type safety in API routes"
```

---

**Ready to start?** Begin with Phase 1 (Types) - it provides the foundation for everything else!

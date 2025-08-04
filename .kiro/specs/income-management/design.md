# Design Document

## Overview

The income management feature will provide a comprehensive interface for users to add, view, edit, and delete income sources within the FamilyHive dashboard. The design leverages the existing API endpoints and database schema while creating an intuitive user experience that integrates seamlessly with the current dashboard layout.

The feature will be implemented as a dedicated income section within the dashboard, featuring a modern card-based layout with forms, data tables, and visual charts. The design follows the established patterns in the codebase using Next.js 15, React Hook Form, Zod validation, and Shadcn/ui components.

## Architecture

### Component Hierarchy
```
Dashboard Page
├── Income Management Section
│   ├── Income Summary Card
│   ├── Add Income Form (Modal/Drawer)
│   ├── Income List/Table
│   │   ├── Income Item Card
│   │   └── Edit/Delete Actions
│   └── Income Charts
│       ├── Income by Source Chart
│       └── Monthly Income Trend Chart
```

### Data Flow
1. **Initial Load**: Dashboard fetches all income data via existing `/api/income` endpoint
2. **Add Income**: Form submission posts to `/api/income` with validation
3. **Edit Income**: Form pre-populates with existing data, updates via `/api/income/[id]` PATCH
4. **Delete Income**: Confirmation dialog triggers DELETE to `/api/income/[id]`
5. **Real-time Updates**: All operations update local state and refresh dashboard calculations

### State Management
- Local component state using React hooks for form data and UI states
- Dashboard-level state for income data shared across components
- Form state managed by React Hook Form with Zod validation
- Loading and error states for all async operations

## Components and Interfaces

### 1. Income Management Section Component
**Location**: `src/components/dashboard/income-management.tsx`

**Props Interface**:
```typescript
interface IncomeManagementProps {
  incomes: Income[];
  onIncomeChange: () => void;
  isLoading: boolean;
}
```

**Responsibilities**:
- Render income summary statistics
- Provide "Add Income" button to open form modal
- Display income list with edit/delete actions
- Show income visualization charts
- Handle loading and empty states

### 2. Add/Edit Income Form Component
**Location**: `src/components/dashboard/income-form.tsx`

**Props Interface**:
```typescript
interface IncomeFormProps {
  income?: Income; // undefined for add, populated for edit
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IncomeFormData) => Promise<void>;
}

interface IncomeFormData {
  source: 'job' | 'benefits' | 'gift' | 'side_hustle' | 'other';
  from: string;
  amount: number;
  date: Date;
  isRecurring: boolean;
  frequency?: 'once' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  endDate?: Date;
}
```

**Form Fields**:
- **Income Source**: Select dropdown with predefined options
- **Source Name**: Text input for employer/source name
- **Amount**: Number input with currency formatting
- **Date**: Date picker for income date
- **Recurring Toggle**: Checkbox to enable recurring options
- **Frequency**: Select dropdown (conditional on recurring)
- **End Date**: Date picker (optional, for recurring income)

**Validation Schema** (Zod):
```typescript
const incomeFormSchema = z.object({
  source: z.enum(['job', 'benefits', 'gift', 'side_hustle', 'other']),
  from: z.string().min(1, 'Source name is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  isRecurring: z.boolean(),
  frequency: z.enum(['once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually']).optional(),
  endDate: z.date().optional()
}).refine((data) => {
  if (data.isRecurring && !data.frequency) {
    return false;
  }
  return true;
}, {
  message: "Frequency is required for recurring income",
  path: ["frequency"]
});
```

### 3. Income List Component
**Location**: `src/components/dashboard/income-list.tsx`

**Props Interface**:
```typescript
interface IncomeListProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
  isLoading: boolean;
}
```

**Features**:
- Responsive card layout for mobile, table layout for desktop
- Sorting by amount, date, source name
- Search/filter functionality
- Edit and delete action buttons
- Empty state with call-to-action

### 4. Income Charts Component
**Location**: `src/components/dashboard/income-charts.tsx`

**Props Interface**:
```typescript
interface IncomeChartsProps {
  incomes: Income[];
}
```

**Chart Types**:
- **Pie Chart**: Income distribution by source type
- **Bar Chart**: Monthly income comparison (if historical data available)
- **Summary Cards**: Total monthly income, number of sources, recurring vs one-time

## Data Models

### Income Type (TypeScript Interface)
```typescript
interface Income {
  id: string;
  userId: string;
  source: 'job' | 'benefits' | 'gift' | 'side_hustle' | 'other';
  from: string;
  amount: string; // Stored as string in DB, parsed to number for calculations
  date: string; // ISO date string
  isRecurring: boolean;
  frequency?: 'once' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Form Data Transformation
```typescript
// Convert form data to API format
const transformFormToApi = (formData: IncomeFormData): Partial<Income> => ({
  source: formData.source,
  from: formData.from,
  amount: formData.amount.toString(),
  date: formData.date.toISOString(),
  isRecurring: formData.isRecurring,
  frequency: formData.isRecurring ? formData.frequency : null,
  endDate: formData.endDate?.toISOString() || null
});

// Convert API data to form format
const transformApiToForm = (income: Income): IncomeFormData => ({
  source: income.source,
  from: income.from,
  amount: parseFloat(income.amount),
  date: new Date(income.date),
  isRecurring: income.isRecurring,
  frequency: income.frequency || undefined,
  endDate: income.endDate ? new Date(income.endDate) : undefined
});
```

## Error Handling

### API Error Handling
```typescript
interface ApiError {
  message: string;
  status: number;
  field?: string; // For validation errors
}

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    return {
      message: error.statusText || 'An error occurred',
      status: error.status
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
};
```

### Form Validation Errors
- Real-time validation using Zod schema
- Field-level error messages displayed below inputs
- Form submission blocked until all errors resolved
- Server-side validation errors mapped to form fields

### Network Error Handling
- Loading states during API calls
- Retry mechanisms for failed requests
- Offline state detection and messaging
- Graceful degradation when API unavailable

## Testing Strategy

### Unit Tests
**Location**: `src/components/dashboard/__tests__/`

**Test Coverage**:
- Form validation logic with various input combinations
- Data transformation functions (API ↔ Form)
- Chart data calculation functions
- Error handling scenarios

**Test Files**:
- `income-form.test.tsx` - Form component behavior and validation
- `income-list.test.tsx` - List rendering, sorting, filtering
- `income-charts.test.tsx` - Chart data processing and rendering
- `income-utils.test.ts` - Utility functions and calculations

### Integration Tests
- API endpoint integration with form submissions
- Dashboard state updates after income operations
- Chart updates when income data changes
- Mobile responsive behavior

### User Acceptance Tests
- Complete income addition workflow
- Edit existing income source
- Delete income with confirmation
- View income charts and summaries
- Mobile device usage scenarios

## UI/UX Design Patterns

### Visual Design
- Consistent with existing dashboard luxury card styling
- Gradient backgrounds and modern shadows
- Color coding for different income sources
- Responsive design for mobile and desktop

### Interaction Patterns
- Modal/drawer for add/edit forms (responsive)
- Inline editing for quick updates
- Confirmation dialogs for destructive actions
- Toast notifications for success/error feedback

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Focus management in modals

### Loading States
- Skeleton loaders for income list
- Spinner indicators for form submissions
- Progressive loading for charts
- Optimistic updates where appropriate

## Integration Points

### Dashboard Integration
- Income data feeds into existing financial summary cards
- Monthly income calculations update dashboard totals
- Income changes trigger debt snowball recalculations
- Consistent styling with existing dashboard components

### API Integration
- Utilizes existing `/api/income` endpoints
- Maintains current authentication patterns (x-user-id header)
- Follows established error response formats
- Preserves existing data validation rules

### Database Integration
- No changes required to existing income schema
- Leverages current Drizzle ORM setup
- Maintains referential integrity with user accounts
- Supports existing backup and migration processes
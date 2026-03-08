# Data-Driven Testing Architecture

This document explains the architecture and rationale behind the data-driven testing approach used in this Playwright test suite.

## What is Data-Driven Testing?

Data-driven testing is a software testing approach where test input and expected outputs are separated from test logic. Instead of having separate test code for each scenario, a single test function iterates through multiple data sets to execute the same test logic with different inputs and assertions.

### Benefits in This Project

1. **Reduced Code Duplication**: One test implementation handles all 6 test cases
2. **Easier Maintenance**: Changes to test logic only need to be made once
3. **Scalability**: Adding new test cases requires only adding data rows
4. **Consistency**: All test cases follow identical logic and assertions
5. **Single Source of Truth**: Test expectations are defined in one place
6. **Readability**: Test data is clear and organized in a structured format

## Project Architecture

### 1. Test Data Layer (`tests/data/testData.ts`)

```typescript
interface TestCase {
  id: number;
  description: string;
  project: string;
  taskName: string;
  expectedColumn: string;
  expectedTags: string[];
}

export const testData: TestCase[] = [
  // 6 test cases defined here
];
```

**Responsibility**: Define all test scenarios in a centralized, structured format.

**Key Values**:
- `id`: Unique identifier for test case
- `description`: Human-readable test description
- `project`: Project name to navigate to
- `taskName`: Task to verify
- `expectedColumn`: Expected Kanban column (To Do, In Progress, Done)
- `expectedTags`: Expected tags/labels for the task

### 2. Helper Functions Layer (`tests/utils/helpers.ts`)

```typescript
export async function login(page: Page, credentials: LoginCredentials)
export async function navigateToProject(page: Page, projectName: string)
export async function findTaskInColumn(page: Page, taskName: string, columnName: string)
export async function getTaskTags(page: Page, taskName: string)
```

**Responsibility**: Provide reusable, page-agnostic utility functions.

**Design Considerations**:
- Each function handles a single responsibility
- Functions use flexible CSS selectors to adapt to app changes
- Error handling with try-catch for robustness
- Logging for debugging and troubleshooting

### 3. Test Suite Layer (`tests/tasks.spec.ts`)

```typescript
testData.forEach((testCase: TestCase) => {
  test(`Test Case ${testCase.id}: ${testCase.description}`, async ({ page }) => {
    // Single test implementation executed for each data row
    await login(page, LOGIN_CREDENTIALS);
    await navigateToProject(page, testCase.project);
    const taskExists = await findTaskInColumn(page, testCase.taskName, testCase.expectedColumn);
    expect(taskExists).toBe(true);
    const taskTags = await getTaskTags(page, testCase.taskName);
    for (const expectedTag of testCase.expectedTags) {
      expect(taskTags).toContain(expectedTag);
    }
  });
});
```

**Responsibility**: Execute the test logic for each test case.

**Key Features**:
- Uses `forEach` loop to iterate through test data
- Creates a test for each data row automatically
- Uses consistent, reusable helper functions
- Clear assertions based on test data expectations

## How It Works: Step-by-Step

### Adding a New Test Case (Example)

To add test case #7:

**Before (without data-driven approach):**
```typescript
// Test 7
test('Test 7: Verify some task', async ({ page }) => {
  // Repeat all login, navigation, assertion code again...
  // ~50 lines of duplicate code
});
```

**After (data-driven approach):**
```typescript
// In testData.ts - ADD ONE OBJECT:
{
  id: 7,
  description: "Verify 'New Task' in Some Project",
  project: "Some Project",
  taskName: "New Task",
  expectedColumn: "To Do",
  expectedTags: ["Tag1", "Tag2"],
}

// No changes needed to test code!
// The forEach loop automatically creates and runs a new test
```

## Selector Strategy

The selectors use progressive enhancement to handle various app structures:

1. **Login Form**:
   - Primary: `#username`, `#password` (ID-based, most reliable)
   - Fallback: `input[type="email"]`, `input[type="password"]` (Type-based)

2. **Project Navigation**:
   - Primary: `button:has(h2:has-text("${projectName}"))` (Nested selector)
   - Description: Finds a button containing an H2 that contains the project name

3. **Column Location**:
   - Primary: `h2:has-text("${columnName}")` (Header text)
   - Ensures we're looking in the correct column

4. **Task Cards**:
   - Primary: `h3:has-text("${taskName}")` (Task title)
   - Leverage HTML semantics for clarity

5. **Tags**:
   - Strategy: Find parent card, then iterate through spans with `bg-*` classes
   - Rationale: Tags use Tailwind CSS background classes
   - Flexible: Works as long as tags have background styling

## Test Execution Flow

```
FOR EACH testCase IN testData:
  CREATE a new test with name = "Test Case ${id}: ${description}"
  
  STEP 1: Login
    - Navigate to base URL
    - Fill username/password
    - Click Sign In
    - Wait for dashboard load
  
  STEP 2: Navigate to Project
    - Find project button
    - Click it
    - Wait for Kanban board to load
  
  STEP 3: Verify Task in Column
    - Find column header (H2)
    - Find task in that column (H3)
    - Assert task is visible
  
  STEP 4: Verify Tags
    - Find task card
    - Extract all tag text from colored spans
    - Assert each expected tag is in the list
```

## Advantages Over Traditional Testing

### Traditional vs. Data-Driven

| Aspect | Traditional | Data-Driven |
|--------|-----------|------------|
| **Lines of code** | ~300 (6 tests × 50 lines) | ~150 (test code) + ~80 (data) |
| **Adding new test** | Write 50 new lines | Add 1 data object |
| **Changing assertions** | Update 6 test functions | Update test logic once |
| **Reusing logic** | Code duplication | 100% reuse |
| **Maintainability** | Hard (changes in 6+ places) | Easy (one place) |
| **Test readability** | Scattered across files | Centralized, scannable data |

## Best Practices Demonstrated

1. **Separation of Concerns**
   - Test data in own file
   - Helpers in own file
   - Test logic in own file

2. **DRY Principle (Don't Repeat Yourself)**
   - Single source of truth
   - No duplicate assertions
   - Reusable helper functions

3. **Type Safety**
   - TypeScript interfaces
   - Strong typing on all functions
   - Compile-time error catching

4. **Descriptive Naming**
   - Clear test IDs and descriptions
   - Self-documenting code
   - Easy test identification in reports

5. **Error Handling**
   - Try-catch blocks in helpers
   - Graceful failures
   - Informative console logging

6. **Wait Strategies**
   - Explicit waits for page load states
   - Selector-based element waits
   - Appropriate timeouts

## Scalability Potential

This architecture can easily handle:
- **100+ test cases** (just objects in array)
- **Multiple environments** (add `environment` field to TestCase)
- **Different user roles** (add `userRole` field)
- **Data variations** (add more fields as needed)
- **Parameterized tests** (loop within forEach)

All without duplicating a single line of test code.

## Conclusion

The data-driven approach demonstrates professional testing practices that align with industry standards. It provides a foundation that can scale from 6 test cases to thousands while maintaining code quality and readability.

# Data-Driven Playwright Test Suite

A scalable, maintainable test suite using Playwright and TypeScript that leverages data-driven testing principles to minimize code duplication and ensure consistency across test cases.

## Overview

This project demonstrates best practices in automated testing by using a **data-driven approach**. All test cases are defined in a centralized JSON structure (`testData.ts`), and a single test implementation iterates through this data to execute multiple test scenarios. This design ensures:

- **No code duplication**: Each test case uses the same test logic
- **Easy scalability**: Adding new test cases requires only adding data, not new test code
- **Maintainability**: Changes to test logic need only be made in one place
- **Reduced errors**: Single source of truth for test expectations

## Project Structure

```
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── tests/
    ├── data/
    │   └── testData.ts       # Centralized test case data
    ├── utils/
    │   └── helpers.ts        # Reusable helper functions
    └── tasks.spec.ts         # Main test suite (data-driven)
```

## Key Features

### 1. Centralized Test Data (`tests/data/testData.ts`)
All test cases are defined as an array of objects with the following structure:
```typescript
{
  id: number;
  description: string;
  project: string;
  taskName: string;
  expectedColumn: string;
  expectedTags: string[];
}
```

### 2. Reusable Helper Functions (`tests/utils/helpers.ts`)
- `login()`: Handles login automation
- `navigateToProject()`: Navigates to a specific project
- `findTaskInColumn()`: Checks if a task exists in a column
- `getTaskTags()`: Retrieves tags from a task

### 3. Data-Driven Test Suite (`tests/tasks.spec.ts`)
A single test loop (`testData.forEach()`) that:
- Iterates through all test cases
- Executes the same test logic for each case
- Uses test case data to verify specific assertions

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

## Test Cases

The suite includes 6 test cases:

| # | Project | Task | Column | Tags |
|---|---------|------|--------|------|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

## Data-Driven Testing Benefits

### Before (Without Data-Driven Approach)
```typescript
// Test 1
test('Test 1', async ({ page }) => {
  await login(page, credentials);
  await navigateToProject(page, 'Web Application');
  const task1Exists = await findTaskInColumn(page, 'Implement user authentication', 'To Do');
  expect(task1Exists).toBe(true);
  const tags1 = await getTaskTags(page, 'Implement user authentication');
  expect(tags1).toContain('Feature');
  expect(tags1).toContain('High Priority');
});

// Test 2 (repeated logic)
test('Test 2', async ({ page }) => {
  await login(page, credentials);
  await navigateToProject(page, 'Web Application');
  const task2Exists = await findTaskInColumn(page, 'Fix navigation bug', 'To Do');
  expect(task2Exists).toBe(true);
  const tags2 = await getTaskTags(page, 'Fix navigation bug');
  expect(tags2).toContain('Bug');
});
// ... repeated 4 more times
```

### After (Data-Driven Approach)
```typescript
testData.forEach((testCase) => {
  test(`Test Case ${testCase.id}: ${testCase.description}`, async ({ page }) => {
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

## Adding New Test Cases

To add a new test case, simply add an entry to the `testData` array in `tests/data/testData.ts`:

```typescript
{
  id: 7,
  description: "Verify new task in a project",
  project: "Project Name",
  taskName: "Task Name",
  expectedColumn: "Column Name",
  expectedTags: ["Tag1", "Tag2"],
}
```

No changes to test code are needed!

## Demo App Credentials

- **URL**: https://animated-gingersnap-8cf7f2.netlify.app/
- **Email**: admin
- **Password**: password123

## Technology Stack

- **Playwright**: Cross-browser test automation
- **TypeScript**: Type-safe test code
- **Node.js**: Runtime environment

## Best Practices Implemented

1. **DRY (Don't Repeat Yourself)**: Single test logic handles all cases
2. **Separation of Concerns**: Test data, helpers, and tests are in separate files
3. **Type Safety**: TypeScript interfaces ensure consistency
4. **Descriptive Naming**: Clear test IDs and descriptions
5. **Modular Helpers**: Reusable functions for common actions
6. **Proper Waits**: Explicit waits for element visibility and navigation

## Troubleshooting

If tests fail:
1. Check that the demo app is accessible at the configured URL
2. Verify login credentials are correct
3. Ensure all page elements match the expected selectors in helpers.ts
4. Check browser console for errors using `--headed` mode
5. Use `--debug` mode to step through tests

## Maintenance

To maintain this test suite:
- Update test data when UI changes
- Modify helper functions if selectors change
- Run tests regularly to catch regressions
- Keep test cases focused on user-facing behavior

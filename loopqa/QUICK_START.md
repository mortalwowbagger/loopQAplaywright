# Quick Start Guide

Get started with the data-driven Playwright test suite in minutes.

## Prerequisites

- Node.js 18+ installed
- npm installed

## Installation

```bash
# Clone the repository (or navigate to the directory)
cd loopqa

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see the browser)
npm run test:headed

# Run tests with the Playwright Inspector UI
npm run test:ui

# Debug mode with step-by-step execution
npm run test:debug

# Run a specific test
npm test -- -g "Test Case 1"

# Run with multiple workers (faster)
npm test -- --workers=4

# View test report
npx playwright show-report
```

## Project Structure

```
loopqa/
├── tests/
│   ├── data/
│   │   └── testData.ts          # All test case definitions (6 cases)
│   ├── utils/
│   │   └── helpers.ts           # Reusable helper functions
│   └── tasks.spec.ts            # Main test suite (data-driven loop)
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── README.md                   # Full documentation
└── DATA_DRIVEN_ARCHITECTURE.md # Architecture explanation
```

## Test Cases Overview

All 6 test cases are defined in `tests/data/testData.ts`:

| Test # | Project | Task | Column | Tags |
|--------|---------|------|--------|------|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

## How It Works

### Data-Driven Approach

Instead of writing 6 separate tests with duplicated code, this project uses a single test implementation that loops through test data:

```typescript
// In tests/tasks.spec.ts
testData.forEach((testCase) => {
  test(`Test Case ${testCase.id}: ${testCase.description}`, async ({ page }) => {
    // Single implementation handles all test cases
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

### Adding a New Test Case

To add test case #7, simply add one object to `tests/data/testData.ts`:

```typescript
{
  id: 7,
  description: "Verify new task in project",
  project: "Project Name",
  taskName: "Task Name",
  expectedColumn: "Column Name",
  expectedTags: ["Tag1", "Tag2"],
}
```

That's it! The test suite automatically creates and runs a new test.

## Demo App Credentials

- **URL**: https://animated-gingersnap-8cf7f2.netlify.app/
- **Username**: admin
- **Password**: password123

## Key Files

### `tests/data/testData.ts`
Defines all 6 test cases in a structured, readable format. This is where you add new test cases.

### `tests/utils/helpers.ts`
Contains reusable functions:
- `login()` - Handles login automation
- `navigateToProject()` - Navigates to a project
- `findTaskInColumn()` - Verifies task exists in column
- `getTaskTags()` - Extracts tags from a task

### `tests/tasks.spec.ts`
The main test file that loops through `testData` and executes the same test logic for each case.

## Selector Strategy

The selectors are designed to be flexible and resilient:

- **Login**: Uses ID-based selectors (#username, #password)
- **Projects**: Uses button with nested H2 text selector
- **Columns**: Finds H2 headers with column names
- **Tasks**: Locates H3 headers within columns
- **Tags**: Finds spans with background color classes

## Troubleshooting

### Tests Fail With "Element Not Found"
1. The demo app URL might be down
2. Check that you're using the correct demo credentials
3. Run tests in headed mode: `npm run test:headed`
4. Take a screenshot: check the test-results/ folder

### Timeout Errors
1. Increase timeout in playwright.config.ts
2. Check your internet connection
3. Try running fewer tests in parallel: `npm test -- --workers=1`

### CSS Selector Errors
Playwright selectors support CSS, XPath, and text selectors. Current selectors use:
- Text selectors: `button:has-text("...")`
- Attribute selectors: `input[type="password"]`
- XPath for ancestors: `xpath=ancestor::div[...]`

## Performance Tips

1. **Parallel Execution**: Tests run in parallel by default (6 workers)
2. **Set Workers**: `npm test -- --workers=4`
3. **Run Specific Tests**: `npm test -- -g "Test Case 1"` to test one case
4. **Headed Mode**: Only for debugging, slower than headless

## Next Steps

1. Review [README.md](README.md) for complete documentation
2. Read [DATA_DRIVEN_ARCHITECTURE.md](DATA_DRIVEN_ARCHITECTURE.md) for architecture details
3. Open [tests/data/testData.ts](tests/data/testData.ts) to see all test cases
4. Run tests and check the HTML report: `npm test && npx playwright show-report`

## Support

For Playwright documentation: https://playwright.dev
For TypeScript help: https://www.typescriptlang.org/docs/

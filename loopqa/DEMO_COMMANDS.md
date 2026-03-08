# Demo Commands for Video

## Show All Tests
```bash
npx playwright test --list
```
*Shows the 6 test cases generated from data*

## Run Tests Individually (for demo)
```bash
npx playwright test --headed --workers=1 --grep "Test Case 1"
```
*Shows one test running with browser visible*

## Run All Tests
```bash
npm run test:headed
```
*Shows all tests running in headed mode*

## Show Test Results
```bash
npx playwright show-report
```
*Opens HTML report with detailed results*

## Key Files to Show
- `tests/data/testData.ts` - The test data array
- `tests/tasks.spec.ts` - Main test logic with forEach loop
- `tests/utils/helpers.ts` - Helper functions and locator strategies
- `playwright.config.ts` - Configuration settings
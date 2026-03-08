import { test, expect, Page } from '@playwright/test';
import { testData, TestCase } from './data/testData';
import { login, navigateToProject, findTaskInColumn, getTaskTags } from './utils/helpers';

// Login credentials for the demo app
const LOGIN_CREDENTIALS = {
  email: 'admin',
  password: 'password123',
};

/**
 * Data-driven test suite for Kanban board task verification
 * Instead of writing 6 separate test functions, we use a single test template
 * that runs once for each item in the testData array. This keeps the code DRY
 * and makes it easy to add new test cases by just adding data to the array.
 */
test.describe('Data-Driven Task Verification Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a higher timeout for all operations in this test
    test.setTimeout(60000);
  });

  // This loop creates 6 separate test cases from the testData array
  // Each iteration generates a unique test with its own name and data
  testData.forEach((testCase: TestCase) => {
    test(`Test Case ${testCase.id}: ${testCase.description}`, async ({ page }) => {
      // Step 1: Login to the demo app
      await test.step('Login to Demo App', async () => {
        await login(page, LOGIN_CREDENTIALS);
        // Verify we're logged in by checking for main content
        await page.waitForLoadState('networkidle');
      });

      // Step 2: Navigate to the specified project
      await test.step(`Navigate to "${testCase.project}"`, async () => {
        await navigateToProject(page, testCase.project);
      });

      // Step 3: Verify task exists in the correct column
      await test.step(`Verify "${testCase.taskName}" is in the "${testCase.expectedColumn}" column`, async () => {
        const taskExists = await findTaskInColumn(page, testCase.taskName, testCase.expectedColumn);
        expect(taskExists).toBe(true);
      });

      // Step 4: Verify task tags
      await test.step(`Confirm tags: ${testCase.expectedTags.join(', ')}`, async () => {
        const taskTags = await getTaskTags(page, testCase.taskName);

        // Verify each expected tag is present
        for (const expectedTag of testCase.expectedTags) {
          expect(taskTags).toContain(expectedTag);
        }
      });
    });
  });
});

import { Page, expect } from '@playwright/test';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Logs into the demo application using the provided credentials
 * Handles the login form submission and waits for the dashboard to load
 */
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  // Navigate to the app
  await page.goto('/');

  // Wait for the login form to load
  await page.waitForLoadState('networkidle');

  // Fill in the login credentials
  const usernameInput = page.locator('#username, input[id="username"]');
  await usernameInput.fill(credentials.email, { timeout: 10000 });

  const passwordInput = page.locator('#password, input[id="password"]');
  await passwordInput.fill(credentials.password, { timeout: 10000 });

  // Submit the login form
  const submitButton = page.locator('button:has-text("Sign in")');
  await submitButton.click({ timeout: 10000 });

  // Wait for navigation and dashboard to load
  await page.waitForLoadState('networkidle');
}

/**
 * Navigates to a specific project by clicking on it in the sidebar
 * The projects are shown as buttons in the left navigation panel
 */
export async function navigateToProject(page: Page, projectName: string): Promise<void> {
  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Find the project button which has an H2 child with the project name
  const projectButton = page.locator(`button:has(h2:has-text("${projectName}"))`).first();

  await projectButton.click({ timeout: 10000 });

  // Wait for the board to load
  await page.waitForLoadState('networkidle');

  // Wait for column headers (H2 with column names like "To Do (2)")
  await page.waitForSelector('h2', { timeout: 10000 });
}

/**
 * Checks if a specific task exists in a specific column on the Kanban board
 * The board has columns like "To Do", "In Progress", and "Done"
 * Each column has a header (H2) and contains task cards
 */
export async function findTaskInColumn(
  page: Page,
  taskName: string,
  columnName: string
): Promise<boolean> {
  try {
    // Wait for column headers to be visible
    await page.waitForSelector('h2', { timeout: 5000 });

    // Find the column header (H2 with format "ColumnName (count)")
    const columnHeader = page.locator(`h2:has-text("${columnName}")`).first();

    // Verify column exists and is visible
    const isColumnVisible = await columnHeader.isVisible();
    if (!isColumnVisible) {
      console.warn(`Column "${columnName}" not found or not visible`);
      return false;
    }

    // Try data attributes first (most reliable if available)
    let columnContainer = page.locator(`[data-column="${columnName}"]`).first();

    // If data attributes don't exist, fall back to XPath
    if (!(await columnContainer.isVisible().catch(() => false))) {
      console.log(`Data attribute [data-column="${columnName}"] not found, using XPath fallback`);
      columnContainer = columnHeader.locator('xpath=ancestor::div[@class and contains(@class, "flex-col")]').first();
    }

    // Look for the task within this column
    // Task title is in an H3 inside a task card div
    const task = columnContainer.locator(`h3:has-text("${taskName}")`).first();

    return await task.isVisible().catch(() => false);
  } catch (error) {
    console.error(`Error finding task "${taskName}" in column "${columnName}":`, error);
    return false;
  }
}

/**
 * Gets the tags for a specific task from the task card
 * Task tags appear as colored badges (spans with background colors)
 * Common tags include "Feature", "Bug", "Design", "High Priority"
 */
export async function getTaskTags(page: Page, taskName: string): Promise<string[]> {
  try {
    // Find the task card header (H3 with the task name)
    const taskHeader = page.locator(`h3:has-text("${taskName}")`).first();

    // Verify task exists
    const isTaskVisible = await taskHeader.isVisible().catch(() => false);
    if (!isTaskVisible) {
      console.warn(`Task "${taskName}" not found or not visible`);
      return [];
    }

    // Try data attributes first (most reliable if available)
    let taskCard = page.locator(`[data-task="${taskName}"]`).first();

    // If data attributes don't exist, fall back to XPath
    if (!(await taskCard.isVisible().catch(() => false))) {
      console.log(`Data attribute [data-task="${taskName}"] not found, using XPath fallback`);
      taskCard = taskHeader.locator('xpath=ancestor::div[@class and contains(@class, "bg-white")]').first();
    }

    // Find all span elements that might contain tags
    // Tags are typically span elements with background color classes
    const allSpans = await taskCard.locator('span').all();

    const tags: string[] = [];
    for (const span of allSpans) {
      const classes = await span.getAttribute('class');
      const text = await span.textContent();

      // Only include spans that have a background color class (they're likely tags)
      if (classes && classes.includes('bg-') && text && text.trim().length > 0) {
        tags.push(text.trim());
      }
    }

    return tags;
  } catch (error) {
    console.error(`Error getting tags for task "${taskName}":`, error);
    return [];
  }
}


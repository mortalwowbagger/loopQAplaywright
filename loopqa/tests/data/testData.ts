/**
 * Test data structure following a data-driven approach
 * Each test case defines: project, task name, expected column, and expected tags
 */

export interface TestCase {
  id: number;
  description: string;
  project: string;
  taskName: string;
  expectedColumn: string;
  expectedTags: string[];
}

export const testData: TestCase[] = [
  // Test Case 1: Basic authentication feature in Web Application
  // This task should be in the To Do column and have both Feature and High Priority tags
  {
    id: 1,
    description: "Verify 'Implement user authentication' task in Web Application project",
    project: "Web Application",
    taskName: "Implement user authentication",
    expectedColumn: "To Do",
    expectedTags: ["Feature", "High Priority"],
  },

  // Test Case 2: Bug fix for navigation menu
  // This is a bug that needs to be addressed in the Web Application
  {
    id: 2,
    description: "Verify 'Fix navigation bug' task in Web Application project",
    project: "Web Application",
    taskName: "Fix navigation bug",
    expectedColumn: "To Do",
    expectedTags: ["Bug"],
  },

  // Test Case 3: Design system work that's currently in progress
  // This task is actively being worked on in the Web Application
  {
    id: 3,
    description: "Verify 'Design system updates' task in Web Application project",
    project: "Web Application",
    taskName: "Design system updates",
    expectedColumn: "In Progress",
    expectedTags: ["Design"],
  },

  // Test Case 4: New feature for mobile push notifications
  // This is a feature request for the Mobile Application
  {
    id: 4,
    description: "Verify 'Push notification system' task in Mobile Application project",
    project: "Mobile Application",
    taskName: "Push notification system",
    expectedColumn: "To Do",
    expectedTags: ["Feature"],
  },

  // Test Case 5: High priority offline functionality
  // This feature is both important and currently being worked on
  {
    id: 5,
    description: "Verify 'Offline mode' task in Mobile Application project",
    project: "Mobile Application",
    taskName: "Offline mode",
    expectedColumn: "In Progress",
    expectedTags: ["Feature", "High Priority"],
  },

  // Test Case 6: App icon design work that's completed
  // This design task has been finished in the Mobile Application
  {
    id: 6,
    description: "Verify 'App icon design' task in Mobile Application project",
    project: "Mobile Application",
    taskName: "App icon design",
    expectedColumn: "Done",
    expectedTags: ["Design"],
  },
];

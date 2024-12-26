export const tasks = [
  {
    id: 1,
    col_id: 1,
    name: "Remove unused tests",
    priority_id: 1,
    following: true,
    assignees_ids: []
  },
  {
    id: 2,
    col_id: 2,
    name: "Integrate Ant Design",
    priority_id: 2,
    assignees_ids: [1]
  },
  {
    id: 3,
    col_id: 2,
    name: "Fix typo in config",
    priority_id: 3,
    assignees_ids: [2]
  },
  {
    id: 4,
    col_id: 2,
    name: "Improve typescript setup",
    priority_id: 2,
    following: true,
    comments_count: 3,
    assignees_ids: [1, 2, 3, 4]
  },
  {
    id: 5,
    col_id: 2,
    name: "Update LICENSE.md",
    priority_id: 4,
    assignees_ids: [2]
  },
  {
    id: 6,
    col_id: 1,
    name: "Enable config for all files",
    priority_id: 1,
    comments_count: 11,
    assignees_ids: []
  },
  {
    id: 7,
    col_id: 1,
    name: "Migrate backend Python version from 2.6 to 3.11",
    priority_id: 1,
    assignees_ids: []
  },
  {
    id: 8,
    col_id: 1,
    name: "Try to put out that fire we started 🔥",
    priority_id: 1,
    comments_count: "999+",
    assignees_ids: []
  },
  {
    id: 9,
    col_id: 1,
    name: "Check cookie when needed",
    priority_id: 1,
    comments_count: "1",
    assignees_ids: []
  }
];

export const columns = [
  { id: 1, name: "Backlog", order: 1 },
  { id: 2, name: "To-Do", order: 2 },
  { id: 3, name: "In progress", order: 3 },
  { id: 4, name: "Review", order: 4 },
  { id: 5, name: "Done", order: 5 },
  { id: 6, name: "Delivered", order: 6 }
];

# Using Lowcoder Component Plugin

## Prerequisites
Before you start, ensure you have a running Lowcoder installation. Alternatively, you can use it online at [https://app.lowcoder.cloud](https://app.lowcoder.cloud).

## Gantt Chart Component Plugin Overview
The Gantt Chart component plugin for Lowcoder allows you to create, manage, and visualize project tasks and timelines efficiently. This component is highly customizable, offering various styling and interaction options to fit your application's needs.

### Opensource
This pugin based on the fantastic work of [MaTeMaTuK](https://github.com/MaTeMaTuK/). Please find here the original sources: [gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react)

### Key Features
- **Task Management**: Create and manage tasks with start/end dates, progress tracking, and dependencies.
- **View Modes**: Multiple view modes such as Hour, Day, Week, Month, and Year.
- **Customizable Styles**: Extensive styling options for Gantt chart elements, including bar colors, text sizes, row heights, and more.
- **Event Handling**: Handle various events like task date changes, clicks, deletions, and progress updates.
- **Tooltip and Legend**: Customize tooltips and legend styles for a better user experience.

### Styling Options
The Gantt Chart plugin offers several sections for styling different parts of the chart:
- **Legend Header Style**: Customize the header of the task list.
- **Legend Style**: Style the task list.
- **Tooltip Style**: Define the appearance of tooltips.
- **Chart Style**: Adjust the main chart's appearance, including bar colors, corner radius, and more.

### Event Handling
The plugin supports various events to enhance interactivity:
- **Task Date Changed**: Triggered when task dates are modified.
- **Task Clicked**: Triggered when a task is clicked.
- **Task Deleted**: Triggered when a task is deleted.
- **Task Progress Changed**: Triggered when task progress changes.
- **Task Selected**: Triggered when a task is selected.
- **Task Updated**: Triggered when a task is updated.

## Steps to Use the Plugin
1. **Open the App Editor**: Navigate to the App Editor within your Lowcoder application.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Main%20Screeen%20clean.png" alt="Lowcoder App Editor">
</p>

1. **Access Components Panel**: In the App Editor, locate the right panel where components are listed.

2. **Switch to Extensions**: Find and switch on the "Extensions" toggle. This option allows you to add additional components to your project.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Import%20Component%20Plugin%201.png" alt="Lowcoder App Editor">
</p>

3. **Load the Plugin**: Here you have the option to load a Lowcoder Component Plugin from NPM. For example, to load the "hill charts" plugin, type `lowcoder-comp-hillcharts` in the provided field.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Import%20Component%20Plugin%202.png" alt="Lowcoder App Editor">
</p>

4. **Start Using the Plugin**: After loading the plugin, it will be available for use within your Lowcoder project. You can now integrate and customize the component as per your application's needs.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Import%20Component%20Plugin%203.png" alt="Lowcoder App Editor">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Import%20Component%20Plugin%204.png" alt="Lowcoder App Editor">
</p>
# Lowcoder Component Builder

## How to build a Lowcoder Component Plugin

This script helps you to create a skeleton Lowcoder Component, which you can then publish on npm and use it as imported Plugin in any app.

The main steps are:

- Fork of the repository
- Local installation
- Developing & preview the Component 
- Publish the component

### Forking of the Repository

To ensure you can develop your Component Plugin including as your repository, please fort (update) our lowcoder-org/lowcoder-create-component-plugin repository first. Find here more information: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo

### Cloning of the new repository to work local

Now you can clone your new repository to develop local.

```bash
https://github.com/<your org>/lowcoder-create-component-plugin.git

or 

git@github.com:<your org>/lowcoder-create-component-plugin.git
```

### Local Development preparation

1) Navigate your terminal or bash to your /root folder of the cloned repository to install general dependencies and the Lowcoder SDK
```bash
yarn install
```
2) execute the Plugin Builder Script. Please name your plugin with the prefix **"lowcoder-comp-"** to make it easy for other users to find Lowcoder Component Pluins on NPM

```bash
npm create lowcoder-plugin lowcoder-comp-my-plugin
```
3) Navigate your terminal or bash to the newly created Plugin folder
```bash
cd lowcoder-comp-my-plugin
```
4) install all dependencies:
```bash
yarn install
```
5) Start the Playground (Components Preview): Now you can start your Plugin in the playground, so during development you have a realtime preview.
```bash
yarn start
```
This will start the local development server and open a browser on http://localhost:9000 

## Local development

After the preparation, a skeleton project for Lowcoder Component Plugin development was created and the SDK prepared.
A new browser window should open at http://localhost:9000
This is the Components Preview, which allows you to see your new component in action, as it would work in the Lowcoder Editor.

Data, methods and properties are visible and interactive, so you can test your Component during development.
The view will get automatically refreshed.

Find the /src folder in the new created project. Here are some demonstration files prepared.
The Lowcoder Component Builder makes the development & publishing of multiple individual components as bundle possible.
In the left navigation of the Components Preview you can switch between your components.

Before you publish, please cleanup all demonstration files like the "HelloWorldComp.tsx" and the references to HelloWorldComp.

Folder Structure:

#### lowcoder-comp-my-plugin/
 * ├ icons/
 * ├ locales/
 * └ src/
   * └ index.ts

In "icons" you will place an SVG, which will later displayed to drag the component to the Lowcoder Editor Canvas.
In "locales" you place translation files for all displayed texts of your components
And in the "src" folder you place all code. Make sure, your Copmonent is referenced right in the index.ts file.

## How to publish a Component Plugin

With the following command you can publish the script to the NPM repository:
```bash
yarn build --publish
```
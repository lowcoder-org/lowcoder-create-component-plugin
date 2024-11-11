#!/usr/bin/env node
import fs from "fs-extra";
import path, {dirname} from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "cross-spawn";
import { writeFileSync, existsSync } from "node:fs";
import chalk from "chalk";
import { createCommand } from "commander";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file).toString());
}

function currentDirName(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}

const currentDir = currentDirName(import.meta.url);
const pkg = readJson(path.resolve(currentDir, "./package.json"));

const isUsingYarn = true;
// const isUsingYarn = (process.env.npm_config_user_agent || "").indexOf("yarn") === 0;
const cliPackageName = "lowcoder-cli";
const sdkPackageName = "lowcoder-sdk";

let verbose = false;
let registry;

createCommand(pkg.name)
  .version(pkg.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [Options]`)
  .option("-t, --template", "template name", "typescript")
  .option("-f, --force", "force create project, if target dir is not empty, will empty it")
  .option("--verbose", "print more info")
  .option("--registry [addr]", "npm registry")
  .action((name, options) => {
    verbose = options.verbose;
    registry = options.registry;
    return createProject(name, options);
  })
  .parse();

function writePackageJson(file, content) {
  writeFileSync(file, JSON.stringify(content, null, 2));
}

function writeYarnFile() {
  writeFileSync("yarn.lock", "");
}

async function isDirEmpty(dir) {
  if (!existsSync(dir)) {
    return true;
  }
  const files = await fs.promises.readdir(dir);
  return files.length === 0;
}

async function install(dependencies) {
  return new Promise((resolve, reject) => {

    let cmd = "npm";
    let args = ["install", "--no-audit", "--save", "--save-exact", "--loglevel", "error"];
    if (isUsingYarn) {
      cmd = "yarn";
      args = ["add"];
    }

    if (registry) {
      args.push("--registry", registry);
    }
    args.push(...dependencies);

    const child = spawn(cmd, args, { stdio: "inherit" });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${cmd} ${args.join(" ")}`,
        });
        return;
      }
      resolve();
    });
  });
}

function executeNodeScript({ cwd, args }, data, source) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...args, "-e", source, "--", JSON.stringify(data)], {
      cwd,
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `node ${args.join(" ")}`,
        });
        return;
      }
      resolve();
    });
  });
}

/**
 * create lowcoder comps project
 * 1. create dir
 * 2. create package.json
 * 3. install lowcoder-cli
 * 4. run `lowcoder-cli init`
 */
async function createProject(projectName, options) {
  const { template, force } = options;
  const originalDirectory = process.cwd();
  const root = path.resolve(originalDirectory, projectName);

  const isRootEmpty = await isDirEmpty(root);
  if (!isRootEmpty) {
    if (force) {
      fs.emptyDirSync(root);
    } else {
      console.log();
      console.error(`${root} is not empty`);
      process.exit(1);
    }
  }

  const packageJsonFile = path.resolve(root, "package.json");
  fs.ensureDirSync(root);
  process.chdir(root);

  const initialPackageJson = {
    name: projectName,
    version: "0.0.1",
    type: "module",
    license: "MIT",
  };

  // now we prepare the files
  writePackageJson(packageJsonFile, initialPackageJson);
  // without empty yarn file the setup will fail
  writeYarnFile();

  await install([
    cliPackageName,
    sdkPackageName,
    "react",
    "react-dom",
    "@types/react",
    "@types/react-dom",
    "vite",
  ]);

  await executeNodeScript(
    {
      cwd: process.cwd(),
      args: ["--input-type=module"],
    },
    { template, registry },
    `
    import init from '${cliPackageName}/actions/init.js';
    init(JSON.parse(process.argv[1]));
    `
  );

  process.chdir(originalDirectory);
  console.log("Done.");
}

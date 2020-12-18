const { prompt } = require("inquirer");
const chalk = require("chalk");
const fse = require("fs-extra");
const exec = require("child_process").exec;
const ora = require("ora");
const fs = require("fs");

function Project(options) {
  this.config = Object.assign(
    {
      projectName: "NewProject",
      templateName: "none",
    },
    options
  );
}

Project.prototype.create = function() {
  let { templateName, projectName } = this.config;
  const question = [
    {
      type: "input",
      name: "name",
      message: "Project name",
      default: projectName,
      filter(val) {
        return val.trim();
      },
      validate(val) {
        const validate = val.trim().split(" ").length === 1;
        return validate || "Project name is not allowed to have spaces ";
      },
      transformer(val) {
        return val;
      },
    },
    {
      type: "input",
      name: "description",
      message: "Project description",
      default: "Vue project",
      validate() {
        return true;
      },
      transformer(val) {
        return val;
      },
    },
    {
      type: "input",
      name: "author",
      message: "Author",
      default: "",
      validate() {
        return true;
      },
      transformer(val) {
        return val;
      },
    },
  ];
  prompt(question).then(({ name, description, author }) => {
    const gitPlace = require("../templates")[templateName].path;
    const spinner = ora("Downloading please wait...");
    spinner.start();
    let cmdStr = `git clone ${gitPlace} ${name} && cd ${name} `;
    console.log(chalk.white("\n Start generating..."));
    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit();
      }
      console.log(chalk.green("\n √ Generation completed!"));
      fs.readFile(`./${name}/package.json`, "utf8", function(err, data) {
        if (err) {
          spinner.stop();
          console.error(err);
          return;
        }
        const packageJson = JSON.parse(data);
        packageJson.name = name;
        packageJson.description = description;
        packageJson.author = author;

        fs.writeFile(`./${name}/package.json`, JSON.stringify(packageJson, null, 2), "utf8", function(err) {
          if (err) {
            spinner.stop();
            console.error(err);
            process.exit();
          } else {
            spinner.stop();
            console.log(chalk.green("project init successfully!"));
            console.log(`
          ${chalk.white(`Now you can cd ${name} `)}
          ${chalk.white(`and you can run`)}
          ${chalk.yellow("npm install")}
          ${chalk.yellow("npm run dev")}
           `);
            process.exit();
          }
        });
      });
    });
  });
};

module.exports = Project;

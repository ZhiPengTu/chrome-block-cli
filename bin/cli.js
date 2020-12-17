#! /usr/bin/env node
process.env.NODE_PATH = __dirname + "/../node_modules/";
const Project = require("../commands/init");
const program = require("commander");
const Templates = require("../templates");

program.version(require("../package").version);

program.usage("<command>");

program
  .usage("<command> [options]")
  .command("init [name]")
  .description("create a new project")
  .action((...args) => {
    const templates = Object.keys(Templates);
    const templateName = args[0] || "";
    const projectName = args[2][0] || "";
    if (templates.includes(templateName)) {
      const project = new Project({
        templateName,
        projectName,
      });
      project.create();
    } else {
      console.log(`未找到对应项目的模板，${templateName}`);
    }
  });
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}

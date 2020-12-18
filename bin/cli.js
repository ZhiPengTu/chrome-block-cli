#! /usr/bin/env node
process.env.NODE_PATH = __dirname + "/../node_modules/";
const Project = require("../commands/init");
const program = require("commander");
const Templates = require("../templates");

program.version(require("../package").version);

program
  .usage("<command> [options]")
  .command("init [name]")
  .description("新建项目");
program
  .helpOption("-h, --HELP", "输出帮助")
  .option("-crx, --CRX [project name]", "输出一个 Chrome Extension CRX 模板")
  .option("-nuxt, --NUXT [project name]", "输出一个 NUXT.js 模板")
  .option("-vueplugin, --VUEPLUGIN [plugin name]", "输出一个VUE插件模板")
  .option("-vue, --VUE [project name]", "输出一个 NUXT.js 模板");

program.on("option:CRX", function(...arg) {
  const project = new Project({
    templateName: "CRX",
    projectName: arg[0] ? arg[0] : "newProject",
  });
  project.create();
});

program.on("option:NUXT", function(...arg) {
  const project = new Project({
    templateName: "NUXT",
    projectName: arg[0],
  });
  project.create();
});

program.parse(process.argv);

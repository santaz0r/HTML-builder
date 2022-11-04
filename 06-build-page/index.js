const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "project-dist");
const stylesPath = path.join(__dirname, "styles");
const assetsPath = path.join(__dirname, "assets");
const templatePath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");

async function createDir() {
  try {
    await fsPromises.mkdir(distPath, {
      recursive: true,
    });
  } catch (error) {
    console.error(error);
  }
}
createDir();

let templateHTML = "";
async function createMarkUp() {
  const readTemplateHTML = fs.createReadStream(templatePath);
  const writeToIndexHtml = fs.createWriteStream(
    path.join(distPath, "index.html")
  );
  readTemplateHTML.on("data", async (data) => {
    templateHTML = data.toString();
    const componentsList = await fsPromises.readdir(componentsPath);
    let counter = 0;
    componentsList.map((file) => {
      const readComponentHTML = fs.createReadStream(
        path.join(componentsPath, file)
      );
      readComponentHTML.on("data", (data) => {
        templateHTML = templateHTML.replace(changeName(file), data.toString());
        counter++;
        if (counter === componentsList.length) {
          writeToIndexHtml.write(templateHTML);
        }
      });
    });
  });
}
createMarkUp();

function changeName(string) {
  return `{{${string.split(".")[0]}}}`;
}

const bundlePath = path.join(__dirname, "project-dist", "style.css");
const writeStyles = fs.createWriteStream(bundlePath);

async function mergeStyles() {
  const stylesList = await fsPromises.readdir(stylesPath);
  stylesList.forEach((file) => {
    const fileExt = path.extname(file);
    if (fileExt === ".css") {
      const readStyles = fs.createReadStream(path.join(stylesPath, file));
      readStyles.on("data", (data) => {
        writeStyles.write(data.toString() + "\n");
      });
    }
  });
}
mergeStyles();

const copyToPath = path.join(distPath, "assets");
async function copyDir() {
  try {
    await fsPromises.rm(copyToPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyToPath, { recursive: true }, (err) => {
      if (err) throw err;
    });

    async function copyDeep(from, to) {
      const copiedFrom = await fsPromises.readdir(from, {
        withFileTypes: true,
      });
      copiedFrom.forEach(async (item) => {
        if (item.isDirectory()) {
          copyDeep(path.join(from, item.name), path.join(to, item.name));
        } else {
          fsPromises.mkdir(to, { recursive: true }, (err) => {
            if (err) throw err;
          });
          await fsPromises.copyFile(
            path.join(from, item.name),
            path.join(to, item.name)
          );
        }
      });
    }
    copyDeep(assetsPath, copyToPath);
  } catch (err) {
    console.error(err);
  }
}

copyDir();

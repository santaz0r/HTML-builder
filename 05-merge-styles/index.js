const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

const stylesPath = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");
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
